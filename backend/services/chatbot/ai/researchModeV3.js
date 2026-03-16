import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { OpenAlexService } from '#services/ai/openAlex.service'

export class ResearchModeV3 extends BaseService {
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
   *                            (journal filter = domain filter equivalent)
   *                            parallel multi-query search, deduped by work ID
   * 3. Gemini streaming      → generate answer grounded in paper abstracts,
   *                            citing only relevant papers with [1] [2] [3]
   */
  static async call({ userId, conversationId, message }) {
    const constants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            'chatbot_research_enabled',
            'chatbot_research_last_message_count',
            'chatbot_research_v3_reformulation_model',
            'chatbot_research_v3_reformulation_prompt',
            'chatbot_research_v3_generation_model',
            'chatbot_research_v3_generation_prompt',
            'chatbot_research_v3_max_results',
            'chatbot_research_v3_fields_of_study',
            'chatbot_research_v3_trusted_journals',
          ]
        }
      }
    })

    const c = {}
    constants.forEach(row => { c[row.key] = row.value })

    if (c.chatbot_research_enabled !== 'true') {
      throw new ValidationError('Research mode sedang tidak aktif. Silakan pilih mode lain')
    }

    const reformulationModel  = c.chatbot_research_v3_reformulation_model  || 'gemini-2.5-flash'
    const reformulationPrompt = c.chatbot_research_v3_reformulation_prompt
    const generationModel     = c.chatbot_research_v3_generation_model     || 'gemini-2.5-flash'
    const generationPromptTpl = c.chatbot_research_v3_generation_prompt
    const maxResults       = parseInt(c.chatbot_research_v3_max_results) || 8
    const fieldsOfStudy    = c.chatbot_research_v3_fields_of_study      || ''
    const lastMessageCount = parseInt(c.chatbot_research_last_message_count) || 10

    // Resolve journal names from user's selected domains
    // User selects domain URLs → we look up their journal_name in the DB → pass to OpenAlex
    const trustedJournals = await this.resolveJournalNames(userId)

    // Conversation history for context
    const dbMessages = await prisma.chatbot_messages.findMany({
      where: { conversation_id: conversationId, is_deleted: false },
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
      console.log('🔄 [ResearchV3] Stage 1 reformulation:', queryResult)

      // ── STAGE 2: OpenAlex multi-query search with journal filter ──────────
      console.log('🔬 [ResearchV3] Stage 2 OpenAlex filter:', {
        trustedJournals: trustedJournals.length > 0 ? trustedJournals : '(none — searching all journals)',
        fieldsOfStudy: fieldsOfStudy || '(none)',
        maxResults
      })
      const searchOptions = { trustedJournals, fieldsOfStudy }

      const sources = await OpenAlexService.searchMulti(
        queryResult.main_query,
        queryResult.related_queries,
        searchOptions,
        maxResults
      )
      console.log(`📚 [ResearchV3] Stage 2 retrieved ${sources.length} papers`)

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
      console.error('[ResearchV3] Error:', error)
      throw new Error('Failed to generate research response: ' + error.message)
    }
  }

  // ── Resolve journal names from user's selected journals ─────────────────────
  // Tutor users can select specific journal names in their settings.
  // If user has a selection → use those. If not → use all active journal names.

  static async resolveJournalNames(userId) {
    try {
      const userSettings = await prisma.user_chatbot_settings.findUnique({
        where: { user_id: userId },
        select: { domain_filter_enabled: true, selected_journals: true }
      })

      if (!userSettings?.domain_filter_enabled) return []

      const selectedJournals = Array.isArray(userSettings.selected_journals) ? userSettings.selected_journals : []

      if (selectedJournals.length > 0) {
        console.log(`[ResearchV3] Journal filter: ${selectedJournals.length} journals from user selection`)
        return selectedJournals
      }

      // No selection → no filter (search all journals)
      console.log(`[ResearchV3] No journal selected — searching all journals`)
      return []
    } catch (err) {
      console.warn('[ResearchV3] Could not resolve journal names:', err.message)
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
      } catch (_) { /* not JSON — use raw text as query */ }

      return { main_query: rawText, related_queries: [] }

    } catch (error) {
      console.error('[ResearchV3] Reformulation failed:', error.message)
      return { main_query: query, related_queries: [] }
    }
  }

  // ── STAGE 3 — Gemini streaming generation ──────────────────────────────────

  static async generateWithGemini(generationModel, originalQuery, sources, conversationHistory, generationPromptTpl) {
    const AIService = RouterUtils.call(generationModel)
    if (!AIService) throw new ValidationError(`AI service not found: ${generationModel}`)

    // Format papers as numbered context — full abstracts give Gemini rich academic content
    const context = sources.map((s, i) =>
      `[Sumber ${i + 1}]\nJudul: ${s.title}\nURL: ${s.url}\nAbstrak: ${s.content || '-'}`
    ).join('\n\n')

    const systemPrompt = this.replacePlaceholders(generationPromptTpl, { context })

    console.log(`🤖 [ResearchV3] Stage 3 Gemini generation with ${sources.length} papers`)

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
