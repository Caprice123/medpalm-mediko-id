import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { GetSkripsiTrustedDomainsService } from '#services/skripsi/getSkripsiTrustedDomainsService'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { PerplexityService } from '#services/ai/perplexity.service'

export class SkripsiResearchModeV2 extends BaseService {
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
   * All prompt content from DB constants (skripsi_ai_researcher_v2_* keys).
   */
  static async call({ tabId, userId, message, tabType }) {
    const mode = 'ai_researcher'

    const constants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            `skripsi_${mode}_enabled`,
            `skripsi_${mode}_model`,
            `skripsi_${mode}_reformulation_model`,
            `skripsi_${mode}_context_messages`,
            `skripsi_${mode}_v2_reformulation_prompt`,
            `skripsi_${mode}_v2_retrieval_system_prompt`,
            `skripsi_${mode}_v2_user_message_template`,
            `skripsi_${mode}_v2_generation_prompt`,
            `skripsi_${mode}_v2_generation_model`,
          ]
        }
      }
    })

    const c = {}
    constants.forEach(row => { c[row.key] = row.value })

    if (c[`skripsi_${mode}_enabled`] !== 'true') {
      throw new ValidationError('Research mode sedang tidak aktif. Silakan pilih mode lain')
    }

    const retrievalModel     = c[`skripsi_${mode}_model`]                           // Perplexity sonar
    const reformulationModel = c[`skripsi_${mode}_reformulation_model`] || 'gemini-2.5-flash'
    const lastMessageCount   = parseInt(c[`skripsi_${mode}_context_messages`]) || 10
    const reformulationPrompt    = c[`skripsi_${mode}_v2_reformulation_prompt`]
    const retrievalSystemTpl     = c[`skripsi_${mode}_v2_retrieval_system_prompt`]
    const userMessageTpl         = c[`skripsi_${mode}_v2_user_message_template`]
    const generationPromptTpl    = c[`skripsi_${mode}_v2_generation_prompt`]
    const generationModel        = c[`skripsi_${mode}_v2_generation_model`] || 'gemini-2.5-flash'

    // Resolve setId from tab for per-set domain preferences
    const tab = await prisma.skripsi_tabs.findUnique({
      where: { id: tabId },
      select: { set_id: true }
    })

    const trustedDomains = await GetSkripsiTrustedDomainsService.call(tab?.set_id ?? null)
    const domainsForQuery = trustedDomains.enabled && trustedDomains.domains.length > 0
      ? trustedDomains.domains
      : []

    // Get conversation history
    const dbMessages = await prisma.skripsi_messages.findMany({
      where: { tab_id: tabId },
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
      console.log('🔄 [SkripsiResearchV2] Stage 1 reformulation:', queryResult)

      // ── STAGE 2: Perplexity non-streaming retrieval ───────────────────────
      const searchResults = await this.fetchSearchResults(
        retrievalModel, queryResult, conversationHistory,
        retrievalSystemTpl, userMessageTpl,
        domainsForQuery, trustedDomains.enabled, trustedDomains
      )
      console.log(`🔍 [SkripsiResearchV2] Stage 2 retrieved ${searchResults.length} results`)

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
      console.error('[SkripsiResearchV2] Error:', error)
      throw new Error('Failed to generate research response: ' + error.message)
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // STAGE 1 — Gemini query reformulation
  // ────────────────────────────────────────────────────────────────────────────

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
      console.error('[SkripsiResearchV2] Reformulation failed:', error.message)
      return { main_query: query, related_queries: [] }
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
    const systemPrompt = retrievalSystemTpl || 'You are a research search assistant. Find the most relevant academic sources for the query.'

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
  // ────────────────────────────────────────────────────────────────────────────

  static async generateWithGemini(
    generationModel, originalQuery, queryResult,
    sources, conversationHistory, generationPromptTpl
  ) {
    const AIService = RouterUtils.call(generationModel)
    if (!AIService) throw new ValidationError(`AI service not found: ${generationModel}`)

    // Format sources as numbered context for Gemini
    const context = sources.map((s, i) =>
      `[Sumber ${i + 1}]\nJudul: ${s.title}\nURL: ${s.url}\nKonten: ${s.content || '-'}`
    ).join('\n\n')

    const systemPrompt = this.replacePlaceholders(generationPromptTpl, { context })

    console.log(`🤖 [SkripsiResearchV2] Stage 3 Gemini generation with ${sources.length} sources`)

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
