import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { SendMessageService } from '#services/chatbot/sendMessageService'
import { NormalModeAIService } from '#services/chatbot/ai/normalModeAIService'
import { ValidatedSearchModeAIService } from '#services/chatbot/ai/validatedSearchModeAIService'
import { ResearchV2Handler } from '#services/chatbot/handlers/researchV2Handler'
import { ChatbotResearchRegistryV2 } from '#services/chatbot/v2/chatbotResearchRegistryV2'
import { GetConstantsService } from '#services/constant/getConstantsService'
import { checkAccessAndDeductCredit } from '#services/shared/checkAccessAndDeductCreditService'

const VALID_MODES = ['normal', 'validated', 'research']

// V2 send path. Two differences from V1, and nothing else:
//   1. research mode resolves its implementation through
//      ChatbotResearchRegistryV2 instead of hardcoding ResearchModeV3, so
//      OpenAlex ↔ Perplexity is a constant, not a code change.
//   2. validation messages are in Indonesian, per the project rule.
//
// The streaming handlers themselves are NOT duplicated — this delegates to the
// same `SendMessageService.handle*StreamingResponse` statics and the same
// ResearchV2Handler that V1 uses, so message persistence, credit deduction on
// first chunk, citation filtering and abort handling have exactly one
// implementation. V1's own `call()` is untouched and still serves /api/v1.
export class SendMessageV2Service extends BaseService {
  static async call({ userId, conversationId, message, mode, onStream, onComplete, onError, checkClientConnected, streamAbortSignal }) {
    this.validate({ userId, conversationId, message, mode })

    const conversation = await prisma.chatbot_conversations.findFirst({
      where: { unique_id: conversationId, is_deleted: false },
      select: { id: true, user_id: true },
    })

    if (!conversation) {
      throw new ValidationError('Percakapan tidak ditemukan')
    }

    if (conversation.user_id !== userId) {
      throw new ValidationError('Anda tidak memiliki akses ke percakapan ini')
    }

    const internalConversationId = conversation.id

    const constants = await GetConstantsService.call([
      'chatbot_access_type',
      `chatbot_${mode}_enabled`,
      `chatbot_${mode}_cost`,
    ])

    if (constants[`chatbot_${mode}_enabled`] !== 'true') {
      throw new ValidationError(`Mode ${mode} sedang tidak aktif. Silakan pilih mode lain`)
    }

    // Checks subscription/credit access without deducting — the deduction itself
    // happens on the first streamed chunk, inside the shared handlers.
    await checkAccessAndDeductCredit(prisma, {
      userId,
      userRole: 'user',
      accessTypeKey: 'chatbot_access_type',
      creditCostKey: `chatbot_${mode}_cost`,
      deductCredit: false,
      description: '',
      featureKey: 'chatbot',
    })

    const accessType = constants.chatbot_access_type || 'free'
    const requiresCredits = accessType === 'credits' || accessType === 'subscription_and_credits'
    const creditsUsed = requiresCredits ? (parseFloat(constants[`chatbot_${mode}_cost`]) || 5) : 0

    let result
    try {
      result = await this.generate({ userId, conversationId: internalConversationId, message, mode })
    } catch (error) {
      if (onError) {
        onError(error)
        return
      }
      throw error
    }

    const shared = {
      userId,
      conversationId: internalConversationId,
      userMessageContent: message,
      stream: result.stream,
      creditsUsed,
      mode,
      requiresCredits,
      onStream,
      onComplete,
      onError,
      checkClientConnected,
      streamAbortSignal,
    }

    // Research answers are assembled from retrieved sources, so they go through
    // the dedicated handler that knows how to re-number and filter citations —
    // unless the implementation streams straight from Perplexity, which carries
    // its citations inline and uses the Perplexity handler instead.
    if (mode === 'research' && onStream) {
      if (result.provider === 'perplexity') {
        return await SendMessageService.handlePerplexityStreamingResponse(shared)
      }

      return await ResearchV2Handler.handle({
        ...shared,
        sources: result.sources,
        noResults: result.noResults,
      })
    }

    if (onStream && result.stream) {
      if (result.provider === 'gemini') {
        return await SendMessageService.handleGeminiStreamingResponse({ ...shared, sources: result.sources })
      }
      if (result.provider === 'perplexity') {
        return await SendMessageService.handlePerplexityStreamingResponse(shared)
      }
    }

    throw new ValidationError('Mode chat ini tidak mendukung streaming')
  }

  static async generate({ userId, conversationId, message, mode }) {
    if (mode === 'normal') {
      return await NormalModeAIService.call({ userId, conversationId, message })
    }

    if (mode === 'validated') {
      return await ValidatedSearchModeAIService.call({ userId, conversationId, message })
    }

    const implementation = await ChatbotResearchRegistryV2.resolve()
    return await implementation.service.call({ userId, conversationId, message })
  }

  static validate({ userId, conversationId, message, mode }) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('ID pengguna tidak valid')
    }

    if (!conversationId) {
      throw new ValidationError('ID percakapan tidak valid')
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new ValidationError('Pesan wajib diisi')
    }

    if (message.length > 5000) {
      throw new ValidationError('Pesan terlalu panjang (maksimal 5000 karakter)')
    }

    if (!mode || !VALID_MODES.includes(mode)) {
      throw new ValidationError('Mode tidak valid. Pilih salah satu: normal, validated, research')
    }
  }
}
