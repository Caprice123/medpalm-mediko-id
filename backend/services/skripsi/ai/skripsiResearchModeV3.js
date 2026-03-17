import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { OpenAlexService } from '#services/ai/openAlex.service'

export class SkripsiResearchModeV3 extends BaseService {
  static replacePlaceholders(template, variables) {
    let result = template
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`
      result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value)
    }
    return result
  }

  /**
   * THREE-STAGE APPROACH (V3 — OpenAlex):
   * 1. Gemini reformulation  → { main_query, related_queries[] }
   * 2. OpenAlex API          → fetch peer-reviewed papers filtered by trusted journals
   * 3. Gemini streaming      → generate answer grounded in paper abstracts
   */
  static async call({ tabId, userId, message, tabType }) {
    const mode = 'ai_researcher'

    const constants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            `skripsi_${mode}_enabled`,
            `skripsi_${mode}_context_messages`,
            `skripsi_${mode}_v3_reformulation_model`,
            `skripsi_${mode}_v3_reformulation_prompt`,
            `skripsi_${mode}_v3_generation_model`,
            `skripsi_${mode}_v3_generation_prompt`,
            `skripsi_${mode}_v3_max_results`,
          ]
        }
      }
    })

    const c = {}
    constants.forEach(row => { c[row.key] = row.value })

    if (c[`skripsi_${mode}_enabled`] !== 'true') {
      throw new ValidationError('Research mode sedang tidak aktif. Silakan pilih mode lain')
    }

    const reformulationModel  = c[`skripsi_${mode}_v3_reformulation_model`]  || 'gemini-2.5-flash'
    const reformulationPrompt = c[`skripsi_${mode}_v3_reformulation_prompt`]
    const generationModel     = c[`skripsi_${mode}_v3_generation_model`]     || 'gemini-2.5-flash'
    const generationPromptTpl = c[`skripsi_${mode}_v3_generation_prompt`]
    const maxResults          = parseInt(c[`skripsi_${mode}_v3_max_results`]) || 8
    const lastMessageCount    = parseInt(c[`skripsi_${mode}_context_messages`]) || 10

    // Resolve trusted journal names from the set's selected domains
    const tab = await prisma.skripsi_tabs.findUnique({
      where: { id: tabId },
      select: { set_id: true }
    })
    const trustedJournals = await this.resolveJournalNames(tab?.set_id ?? null)

    // Conversation history
    const dbMessages = await prisma.skripsi_messages.findMany({
      where: { tab_id: tabId },
      orderBy: { id: 'desc' },
      take: lastMessageCount,
      select: { sender_type: true, content: true }
    })
    const conversationHistory = dbMessages.reverse()

    try {
      // ── STAGE 1: Gemini query reformulation ──────────────────────────────
      const queryResult = await this.reformulateQuery(
        message, conversationHistory, reformulationModel, reformulationPrompt
      )
      console.log('🔄 [SkripsiResearchV3] Stage 1 reformulation:', queryResult)

      // ── STAGE 2: OpenAlex multi-query search with journal filter ──────────
      console.log('🔬 [SkripsiResearchV3] Stage 2 OpenAlex filter:', {
        trustedJournals: trustedJournals.length > 0 ? trustedJournals : '(none — searching all journals)',
        maxResults
      })

      const sources = await OpenAlexService.searchMulti(
        queryResult.main_query,
        queryResult.related_queries,
        { trustedJournals },
        maxResults
      )
      console.log(`📚 [SkripsiResearchV3] Stage 2 retrieved ${sources.length} papers`)

      if (sources.length === 0) {
        return { stream: null, provider: 'gemini', sources: [], noResults: true }
      }

      // ── STAGE 3: Gemini streaming generation ─────────────────────────────
      const { stream } = await this.generateWithGemini(
        generationModel, message,
        sources, conversationHistory, generationPromptTpl
      )

      return { stream, provider: 'gemini', sources }

    } catch (error) {
      console.error('[SkripsiResearchV3] Error:', error)
      throw new Error('Failed to generate research response: ' + error.message)
    }
  }

  // ── Resolve journal names from the set's selected_journals ────────────────
  // For tutor users: reads selected_journals directly from skripsi_set_settings
  // If domain_filter_enabled is false → return [] (no filter)
  // If selected_journals is empty → return [] (search all journals)

  static async resolveJournalNames(setId) {
    try {
      if (!setId) return []
      const setSettings = await prisma.skripsi_set_settings.findUnique({
        where: { set_id: setId },
        select: { domain_filter_enabled: true, selected_journals: true }
      })
      if (!setSettings?.domain_filter_enabled) return []
      const journals = Array.isArray(setSettings.selected_journals) ? setSettings.selected_journals : []
      if (journals.length > 0) {
        console.log(`[SkripsiResearchV3] Journal filter: ${journals.length} journals from set selection`)
        return journals
      }
      console.log('[SkripsiResearchV3] No journal selected — searching all journals')
      return []
    } catch (err) {
      console.warn('[SkripsiResearchV3] Could not resolve journal names:', err.message)
      return []
    }
  }

  // ── STAGE 1 — Gemini query reformulation ───────────────────────────────────

  static async reformulateQuery(query, conversationHistory, reformulationModel, reformulationPrompt) {
    try {
      const conversationContext = conversationHistory.length > 0
        ? conversationHistory.map(m => `${m.sender_type === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n')
        : 'No previous conversation'

      const prompt = this.replacePlaceholders(reformulationPrompt, {
        conversation_history: conversationContext,
        user_query: query
      })

      const AIService = RouterUtils.call(reformulationModel)
      if (!AIService) throw new Error(`AI service not found: ${reformulationModel}`)

      const result = await AIService.generateFromText(reformulationModel, prompt, [], { temperature: 0.1 })

      let rawText
      if (typeof result === 'string') rawText = result.trim()
      else if (result.text)    rawText = result.text.trim()
      else if (result.content) rawText = result.content.trim()
      else throw new Error('Unexpected response format')

      try {
        const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const parsed = JSON.parse(cleaned)
        if (parsed.main_query) {
          return {
            main_query: parsed.main_query,
            related_queries: Array.isArray(parsed.related_queries) ? parsed.related_queries.slice(0, 3) : []
          }
        }
      } catch (_) { /* not JSON */ }

      return { main_query: rawText, related_queries: [] }

    } catch (error) {
      console.error('[SkripsiResearchV3] Reformulation failed:', error.message)
      return { main_query: query, related_queries: [] }
    }
  }

  // ── STAGE 3 — Gemini streaming generation ──────────────────────────────────

  static async generateWithGemini(generationModel, originalQuery, sources, conversationHistory, generationPromptTpl) {
    const AIService = RouterUtils.call(generationModel)
    if (!AIService) throw new ValidationError(`AI service not found: ${generationModel}`)

    const context = sources.map((s, i) =>
      `[Sumber ${i + 1}]\nJudul: ${s.title}\nURL: ${s.url}\nAbstrak: ${s.content || '-'}`
    ).join('\n\n')

    const systemPrompt = this.replacePlaceholders(generationPromptTpl, { context })

    console.log(`🤖 [SkripsiResearchV3] Stage 3 Gemini generation with ${sources.length} papers`)

    const stream = await AIService.generateStreamWithHistory(
      generationModel,
      systemPrompt,
      conversationHistory,
      originalQuery,
      { temperature: 0.3 }
    )

    return { stream, sources }
  }
}
