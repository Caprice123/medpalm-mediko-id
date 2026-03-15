import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { GetTrustedDomainsService } from '#services/chatbot/getTrustedDomainsService'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { PerplexityService } from '#services/ai/perplexity.service'

export class ResearchModeV2 extends BaseService {
  static replacePlaceholders(template, variables) {
    let result = template
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`
      result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value)
    }
    return result
  }

  /**
   * THREE-STAGE APPROACH:
   * 1. Gemini reformulation  → { main_query, related_queries[] }
   * 2. Perplexity non-streaming → fetch search_results (retriever only)
   * 3. Gemini streaming      → generate answer grounded in search_results,
   *                            filtering out irrelevant citations inline
   *
   * All prompt content from DB constants (chatbot_research_v2_* keys).
   */
  static async call({ userId, conversationId, message }) {
    const constants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            'chatbot_research_enabled',
            'chatbot_research_model',
            'chatbot_research_reformulation_model',
            'chatbot_research_v2_reformulation_prompt',
            'chatbot_research_v2_retrieval_system_prompt',
            'chatbot_research_v2_user_message_template',
            'chatbot_research_v2_generation_prompt',
            'chatbot_research_v2_generation_model',
            'chatbot_research_last_message_count',
            'chatbot_research_trusted_domains',
            'chatbot_research_domain_filter_enabled',
          ]
        }
      }
    })

    const c = {}
    constants.forEach(row => { c[row.key] = row.value })

    if (c.chatbot_research_enabled !== 'true') {
      throw new ValidationError("Research mode sedang tidak aktif. Silakan pilih mode lain")
    }

    const retrievalModel      = c.chatbot_research_model                                   // Perplexity sonar
    const reformulationModel  = c.chatbot_research_reformulation_model || 'gemini-2.5-flash'
    const reformulationPrompt = c.chatbot_research_v2_reformulation_prompt
    const retrievalSystemTpl  = c.chatbot_research_v2_retrieval_system_prompt
    const userMessageTpl      = c.chatbot_research_v2_user_message_template
    const generationPromptTpl = c.chatbot_research_v2_generation_prompt
    const generationModel     = c.chatbot_research_v2_generation_model || 'gemini-2.5-flash'
    const lastMessageCount    = parseInt(c.chatbot_research_last_message_count) || 10
    const domainFilterEnabled = c.chatbot_research_domain_filter_enabled === 'true'

    const adminDomains = c.chatbot_research_trusted_domains
      ? c.chatbot_research_trusted_domains.split(',').map(d => d.trim()).filter(Boolean)
      : []

    const trustedDomains  = await GetTrustedDomainsService.call(userId)
    const domainsForQuery = trustedDomains.domains.length > 0 ? trustedDomains.domains : adminDomains

    const dbMessages = await prisma.chatbot_messages.findMany({
      where: { conversation_id: conversationId, is_deleted: false },
      orderBy: { id: 'desc' },
      take: lastMessageCount,
      select: { sender_type: true, content: true }
    })
    const conversationHistory = dbMessages.reverse()

    try {
      // ── STAGE 1: Gemini reformulation ────────────────────────────────────
      const queryResult = await this.reformulateQuery(
        message, conversationHistory, reformulationModel, reformulationPrompt
      )
      console.log('🔄 [ResearchV2] Stage 1 reformulation:', queryResult)

      // ── STAGE 2: Perplexity non-streaming retrieval ───────────────────────
      const searchResults = await this.fetchSearchResults(
        retrievalModel, queryResult, conversationHistory,
        retrievalSystemTpl, userMessageTpl,
        domainsForQuery, domainFilterEnabled, trustedDomains
      )
      console.log(`🔍 [ResearchV2] Stage 2 retrieved ${searchResults.length} results`)

      if (searchResults.length === 0) {
        return { stream: null, provider: 'gemini', sources: [], noResults: true }
      }

      // ── STAGE 3: Gemini streaming with search results as RAG context ──────
      const { stream, sources } = await this.generateWithGemini(
        generationModel, message, queryResult,
        searchResults, conversationHistory, generationPromptTpl
      )

      return { stream, provider: 'gemini', sources }

    } catch (error) {
      console.error('[ResearchV2] Error:', error)
      throw new Error('Failed to generate research response: ' + error.message)
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // STAGE 1 — Gemini query reformulation
  // ────────────────────────────────────────────────────────────────────────────

  static async reformulateQuery(indonesianQuery, conversationHistory, reformulationModel, reformulationPrompt) {
    try {
      const conversationContext = conversationHistory.length > 0
        ? conversationHistory.map(m => `${m.sender_type === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n')
        : 'No previous conversation'

      const prompt = this.replacePlaceholders(reformulationPrompt, {
        conversation_history: conversationContext,
        user_query: indonesianQuery
      })

      const AIService = RouterUtils.call(reformulationModel)
      if (!AIService) throw new Error(`AI service not found: ${reformulationModel}`)

      const result = await AIService.generateFromText(reformulationModel, prompt, [], { temperature: 0.1 })

      let rawText
      if (typeof result === 'string') rawText = result.trim()
      else if (result.text) rawText = result.text.trim()
      else if (result.content) rawText = result.content.trim()
      else throw new Error('Unexpected response format')

      // Try JSON parse (new prompt format)
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
      console.error('[ResearchV2] Reformulation failed:', error.message)
      return { main_query: indonesianQuery, related_queries: [] }
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // STAGE 2 — Perplexity non-streaming retrieval
  // Returns formatted sources array: [{ sourceType, title, content, url, score }]
  // ────────────────────────────────────────────────────────────────────────────

  static async fetchSearchResults(
    retrievalModel, queryResult, conversationHistory,
    retrievalSystemTpl, userMessageTpl,
    domainsForQuery, domainFilterEnabled, timeFilter
  ) {
    // Build retrieval system prompt (no {{trusted_domains}} needed — just a simple retrieval instruction)
    const systemPrompt = retrievalSystemTpl || 'You are a medical search assistant. Find the most relevant sources for the query.'

    // Build user message with expanded queries
    const relatedQueriesText = queryResult.related_queries.length > 0
      ? queryResult.related_queries.join('\n')
      : ''

    const userMessage = this.replacePlaceholders(userMessageTpl, {
      main_query: queryResult.main_query,
      related_queries: relatedQueriesText
    })

    const options = {
      return_citations: true,
      return_images: false,
    }

    if (timeFilter.timeFilterType === 'recency') {
      options.search_recency_filter = timeFilter.recencyFilter || 'month'
    } else if (timeFilter.timeFilterType === 'date_range') {
      if (timeFilter.publishedAfter)  options.search_after_date_filter  = timeFilter.publishedAfter
      if (timeFilter.publishedBefore) options.search_before_date_filter = timeFilter.publishedBefore
      if (timeFilter.updatedAfter)    options.last_updated_after_filter = timeFilter.updatedAfter
      if (timeFilter.updatedBefore)   options.last_updated_before_filter = timeFilter.updatedBefore
    }

    if (domainFilterEnabled && domainsForQuery.length > 0) {
      options.search_domain_filter = domainsForQuery
    }

    const { searchResults, citations } = await PerplexityService.fetchSearchResults(
      retrievalModel, systemPrompt, conversationHistory, userMessage, options
    )

    // Prefer search_results (rich: title + snippet). Fall back to citations (URLs only).
    if (searchResults.length > 0) {
      return searchResults.slice(0, 10).map((r, i) => ({
        sourceType: 'web_search',
        title: r.title || r.url,
        content: r.snippet || r.date || '',
        url: r.url,
        score: 1.0 - (i * 0.05)
      }))
    }

    // Fallback: use citations URLs when search_results is empty
    return citations.slice(0, 10).map((url, i) => ({
      sourceType: 'web_search',
      title: url,
      content: '',
      url,
      score: 1.0 - (i * 0.05)
    }))
  }

  // ────────────────────────────────────────────────────────────────────────────
  // STAGE 3 — Gemini streaming answer generation
  // Injects search results as numbered RAG context via {{context}} placeholder.
  // Gemini cites only relevant sources with [1][2][3] inline.
  // ────────────────────────────────────────────────────────────────────────────

  static async generateWithGemini(
    generationModel, originalIndonesianQuery, queryResult,
    sources, conversationHistory, generationPromptTpl
  ) {
    const AIService = RouterUtils.call(generationModel)
    if (!AIService) throw new ValidationError(`AI service not found: ${generationModel}`)

    // Format sources as numbered context for Gemini
    const context = sources.map((s, i) =>
      `[Sumber ${i + 1}]\nJudul: ${s.title}\nURL: ${s.url}\nKonten: ${s.content || '-'}`
    ).join('\n\n')

    // Inject context into generation prompt
    const systemPrompt = this.replacePlaceholders(generationPromptTpl, { context })

    // User message: original Indonesian question (Gemini answers in Indonesian)
    const userMessage = originalIndonesianQuery

    console.log(`🤖 [ResearchV2] Stage 3 Gemini generation with ${sources.length} sources`)

    const stream = await AIService.generateStreamWithHistory(
      generationModel,
      systemPrompt,
      conversationHistory,
      userMessage,
      { temperature: 0.3 }
    )

    return { stream, sources }
  }
}
