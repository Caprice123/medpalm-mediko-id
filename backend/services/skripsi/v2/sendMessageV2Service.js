import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'
import { ValidationError } from '#errors/validationError'
import { SendMessageService } from '#services/skripsi/sendMessageService'
import { SkripsiAIService } from '#services/skripsi/ai/skripsiAIService'
import { SkripsiResearchV2Handler } from '#services/skripsi/handlers/skripsiResearchV2Handler'
import { SkripsiResearchRegistryV2 } from '#services/skripsi/v2/skripsiResearchRegistryV2'
import { NormalChatV2Service } from '#services/skripsi/v2/normalChatV2Service'
import { normalizeContextSelection } from '#services/skripsi/v2/skripsiReportContextV2'
import { GetConstantsService } from '#services/constant/getConstantsService'
import { checkAccessAndDeductCredit } from '#services/shared/checkAccessAndDeductCreditService'
import { V2_CHAT_TAB_MODE_TYPES, legacyTabTypeFor } from '#services/skripsi/v2/skripsiTabsV2'

// V2 send path for a skripsi tab. Two differences from V1, and nothing else:
//   1. research mode resolves its implementation through
//      SkripsiResearchRegistryV2 instead of hardcoding SkripsiResearchModeV3,
//      so OpenAlex <-> Perplexity is a constant rather than a code change.
//   2. validation messages are in Indonesian, per the project rule.
//
// The streaming handlers are NOT duplicated: this delegates to the same
// `SendMessageService.handle*StreamingResponse` statics and the same
// SkripsiResearchV2Handler that V1 uses, so message persistence, citation
// handling and abort behaviour keep exactly one implementation. V1's own
// `call()` is untouched and still serves /api/v1/skripsi.
export class SendMessageV2Service extends BaseService {
  static async call({ tabId, userId, message, modeType = 'validated', context = null, onStream, onComplete, onError, checkClientConnected, streamAbortSignal }) {
    const trimmed = typeof message === 'string' ? message.trim() : ''
    if (!trimmed) {
      throw new ValidationError('Pesan wajib diisi')
    }

    // Ownership is held by the set, not the tab, so it is checked through the
    // relation rather than on the tab row.
    const tab = await prisma.skripsi_tabs.findFirst({
      where: { id: tabId },
      include: { skripsi_set: true },
    })

    if (!tab || tab.skripsi_set.user_id !== userId) {
      throw new NotFoundError('Tab tidak ditemukan')
    }

    // V2's two chat tabs ARE the mode choice: the AI Chat tab always answers
    // in normal mode and the Research tab always in research mode, so
    // whatever the client sent is ignored for them. Both run the AI-researcher
    // pipeline underneath, which is why they borrow its tab type — its prompts,
    // its `skripsi_ai_researcher_*` constants and its access check all apply
    // unchanged. A legacy tab (V1's ai_researcher_1/2/3, paraphraser) keeps
    // taking its mode from the request.
    const tabType = legacyTabTypeFor(tab.tab_type)
    const answerMode = V2_CHAT_TAB_MODE_TYPES[tab.tab_type] ?? modeType
    const mode = SendMessageService.getMode(tabType)

    // A V2 chat tab is gated and priced by V2's own keys; a legacy tab keeps
    // reading the per-mode keys V1 set up.
    const isV2ChatTab = tab.tab_type in V2_CHAT_TAB_MODE_TYPES
    const enabledKey = isV2ChatTab ? 'pbl_ai_chat_enabled' : `skripsi_${mode}_enabled`
    const costKey = isV2ChatTab ? 'pbl_ai_chat_cost' : `skripsi_${mode}_cost`

    const constants = await GetConstantsService.call(['skripsi_access_type', enabledKey, costKey])

    if (constants[enabledKey] !== 'true') {
      throw new ValidationError('Fitur AI Chat sedang tidak aktif')
    }

    await checkAccessAndDeductCredit(prisma, {
      userId,
      userRole: 'user',
      accessTypeKey: 'skripsi_access_type',
      creditCostKey: costKey,
      deductCredit: false,
      description: '',
      featureKey: 'skripsi_builder',
    })

    const accessType = constants.skripsi_access_type || 'free'
    const requiresCredits = accessType === 'credits' || accessType === 'subscription_and_credits'

    // Deliberately 0, matching V1: the per-message cost lookup is commented out
    // in SendMessageService, so skripsi messages have never actually charged
    // credits. V2 reproduces that rather than quietly starting to bill — wiring
    // the real cost in is a product decision, not a refactor.
    const messageCost = 0

    const shared = {
      tabId,
      setId: tab.set_id,
      userId,
      userMessageContent: trimmed,
      modeType: answerMode,
      messageCost,
      requiresCredits,
      onStream,
      onComplete,
      onError,
      checkClientConnected,
      streamAbortSignal,
    }

    try {
      // Only the AI researcher tabs have a research mode; the paraphraser and
      // diagram builder always run their own single pipeline.
      if (answerMode === 'research' && mode === 'ai_researcher' && onStream) {
        const implementation = await SkripsiResearchRegistryV2.resolve()
        const result = await implementation.service.call({
          tabId,
          userId,
          message: trimmed,
          tabType,
        })

        // An implementation that streams straight from Perplexity carries its
        // citations inline, so it uses the Perplexity handler; the retrieval
        // pipelines hand their sources to the research handler instead.
        if (result.provider === 'perplexity') {
          return await SendMessageService.handlePerplexityStreamingResponse({ ...shared, stream: result.stream })
        }

        return await SkripsiResearchV2Handler.handle({
          ...shared,
          stream: result.stream,
          sources: result.sources,
          noResults: result.noResults,
        })
      }

      // Normal mode is V2's own: same prompt and model as the generic branch
      // of SkripsiAIService, plus whatever the student attached from their
      // report. Everything else — the paraphraser, the diagram builder, and
      // any legacy tab still asking for validated — stays on the shared
      // service, which V1 also runs.
      const result = answerMode === 'normal' && mode === 'ai_researcher'
        ? await NormalChatV2Service.call({
          tabId,
          setId: tab.set_id,
          message: trimmed,
          context: normalizeContextSelection(context || {}),
        })
        : await SkripsiAIService.call({
          tabId,
          message: trimmed,
          tabType,
          modeType: answerMode,
        })

      if (onStream && result.stream) {
        if (result.provider === 'perplexity') {
          return await SendMessageService.handlePerplexityStreamingResponse({ ...shared, stream: result.stream })
        }

        // Gemini is the fallback, not a matched case, and this is a behaviour
        // FIX rather than a port. SkripsiAIService never returns a `provider`
        // at all, while V1 dispatched on `provider === 'gemini'` — so every
        // non-research message (validated mode, which is the default, plus the
        // paraphraser and diagram-builder tabs) matched no branch and died on
        // V1's "Streaming is required for Skripsi Builder" error. Treating an
        // absent provider as Gemini is what makes those modes answer at all.
        return await SendMessageService.handleStreamingResponse({
          ...shared,
          stream: result.stream,
          sources: result.sources,
        })
      }

      throw new ValidationError('Streaming wajib untuk Skripsi Builder')
    } catch (error) {
      if (onError) {
        onError(error)
        return
      }
      throw error
    }
  }
}
