import { Perplexity } from '@perplexity-ai/perplexity_ai'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { GetTrustedDomainsService } from '#services/chatbot/getTrustedDomainsService'
import { RouterUtils } from '#utils/aiUtils/routerUtils'

export class ResearchModeAIService extends BaseService {
  /**
   * Generate AI response using Research Mode (Perplexity API for web search)
   * @param {Object} params - Parameters
   * @param {number} params.userId - User ID
   * @param {number} params.conversationId - Conversation ID
   * @param {string} params.message - User's message
   * @returns {Promise<Object>} AI response with web sources and credits used
   */
  static async call({ userId, conversationId, message }) {
    try {
      // Get chatbot constants for configuration
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: [
              'chatbot_research_enabled',
              'chatbot_research_model',
              'chatbot_research_last_message_count',
              'chatbot_research_system_prompt',
              'chatbot_research_citations_count',
            ]
          }
        }
      })

      const constantsMap = {}
      constants.forEach(c => { constantsMap[c.key] = c.value })
      
      const modeActive = constantsMap.chatbot_research_enabled === 'true'
      if (!modeActive) {
        throw new ValidationError("Research mode sedang tidak aktif. Silakan pilih mode lain")
      }

      const model = constantsMap.chatbot_research_model
      const lastMessageCount = parseInt(constantsMap.chatbot_research_last_message_count) || 10
      const systemPrompt = constantsMap.chatbot_research_system_prompt
      const citationsCount = parseInt(constantsMap.chatbot_research_citations_count) || 5

      // Get trusted domains for filtering
      const trustedDomains = await GetTrustedDomainsService.call()

      // Get conversation history for context
      const messages = await prisma.chatbot_messages.findMany({
        where: {
          conversation_id: conversationId,
          is_deleted: false
        },
        orderBy: { id: 'desc' },
        take: lastMessageCount, // Fewer messages for research mode to keep context focused
        select: {
          sender_type: true,
          content: true
        }
      })

      const conversationHistory = messages.reverse()

      // Call appropriate research API
      const result = await this.callPerplexityAPI(model, message, conversationHistory, systemPrompt, citationsCount, trustedDomains)

      return {
        stream: result.stream,
        sources: result.sources
      }
    } catch (error) {
      console.error('Error in Research Mode AI Service:', error)
      throw new Error('Failed to generate research response: ' + error.message)
    }
  }

  /**
   * Call Perplexity API for research with web search (streaming)
   * @param {string} model - Model name
   * @param {string} query - User's query
   * @param {Array} conversationHistory - Previous messages
   * @param {string} systemPrompt - System instructions
   * @param {number} citationsCount - Number of sources to cite
   * @param {Object} trustedDomains - Trusted domains configuration
   * @returns {Promise<Object>} Stream generator and sources
   */
  static async callPerplexityAPI(model, query, conversationHistory, systemPrompt, citationsCount, trustedDomains) {
    try {
      const perplexity = new Perplexity({
        apiKey: process.env.PERPLEXITY_API_KEY
      })

      if (!process.env.PERPLEXITY_API_KEY) {
        throw new ValidationError('api key not configured')
      }

      // Build messages array with history
      const messages = [
        { role: 'system', content: systemPrompt }
      ]

      // Add conversation history
      conversationHistory
        .forEach(msg => {
          messages.push({
            role: msg.sender_type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })
        })

      // Add current query
      messages.push({ role: 'user', content: query })

      // Build API request parameters
      const requestParams = {
        model: model || 'sonar-deep-research',
        messages: messages,
        // max_tokens: 2048,
        temperature: 0.7,
        return_citations: true,
        return_images: false,
        stream: true
      }

      // Add time filtering based on type
      // Note: search_recency_filter cannot be combined with date filters
      if (trustedDomains) {
        if (trustedDomains.timeFilterType === 'recency') {
          // Use recency filter (hour, day, week, month, year)
          requestParams.search_recency_filter = trustedDomains.recencyFilter || 'month'
          console.log(`Research mode: using recency filter: ${trustedDomains.recencyFilter}`)
        } else if (trustedDomains.timeFilterType === 'date_range') {
          // Use date range filters - format must be MM/DD/YYYY (e.g., "3/1/2025")
          // Published date filters
          if (trustedDomains.publishedAfter) {
            requestParams.search_after_date_filter = trustedDomains.publishedAfter
          }
          if (trustedDomains.publishedBefore) {
            requestParams.search_before_date_filter = trustedDomains.publishedBefore
          }

          // Last updated date filters
          if (trustedDomains.updatedAfter) {
            requestParams.last_updated_after_filter = trustedDomains.updatedAfter
          }
          if (trustedDomains.updatedBefore) {
            requestParams.last_updated_before_filter = trustedDomains.updatedBefore
          }

          console.log(`Research mode: using date range filters`, {
            published: {
              after: trustedDomains.publishedAfter || 'none',
              before: trustedDomains.publishedBefore || 'none'
            },
            lastUpdated: {
              after: trustedDomains.updatedAfter || 'none',
              before: trustedDomains.updatedBefore || 'none'
            }
          })
        }
      }

      // Add domain filtering if enabled
      if (trustedDomains && trustedDomains.enabled && trustedDomains.domains.length > 0) {
        requestParams.search_domain_filter = trustedDomains.domains
        console.log(`Research mode: filtering to ${trustedDomains.domains.length} trusted domains`)
      }

      console.log(requestParams)

      // Create streaming chat completion
      const stream = await perplexity.chat.completions.create(requestParams)

      return {
        stream: stream,
        sources: [], // Citations will be extracted from the stream
        provider: RouterUtils.getProvider(model),
      }
    } catch (error) {
      console.error('Error calling Perplexity API:', error)

      // Fallback response if API fails
      throw error
    }
  }
}
