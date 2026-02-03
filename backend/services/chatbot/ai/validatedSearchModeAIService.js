import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import RAGService from '#services/rag/ragService'
import { ValidationError } from '#errors/validationError'
import { RouterUtils } from '#utils/aiUtils/routerUtils'


export class ValidatedSearchModeAIService extends BaseService {
  /**
   * Replace placeholders in prompt template with actual values
   * Supports Langfuse-style {{placeholder}} syntax
   * @param {string} template - Template string with {{placeholders}}
   * @param {Object} variables - Key-value pairs to replace
   * @returns {string} Processed template with replaced values
   */
  static replacePlaceholders(template, variables) {
    let result = template
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`
      result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value)
    }
    return result
  }

  /**
   * Parse citations from AI response text
   * Extracts citation numbers like [1], [2], etc.
   * @param {string} text - The AI response text
   * @returns {Set<number>} Set of citation indices used (1-indexed)
   */
  static parseCitations(text) {
    const citationPattern = /\[(\d+)\]/g
    const citations = new Set()
    let match

    while ((match = citationPattern.exec(text)) !== null) {
      const citationIndex = parseInt(match[1], 10)
      citations.add(citationIndex)
    }

    return citations
  }

  /**
   * Filter sources to only include those that were cited in the response
   * @param {Array} sources - All available sources from RAG
   * @param {Set<number>} usedCitations - Set of citation indices used (1-indexed)
   * @returns {Array} Filtered sources that were actually cited
   */
  static filterUsedSources(sources, usedCitations) {
    return sources
      .map((source, index) => ({
        ...source,
        citationIndex: index + 1 // Citations are 1-indexed [1], [2], etc.
      }))
      .filter(source => usedCitations.has(source.citationIndex))
  }

  /**
   * Generate AI response using Validated Search Mode (RAG + Gemini)
   * Retrieves relevant context from summary notes, then generates response
   * @param {Object} params - Parameters
   * @param {number} params.userId - User ID
   * @param {number} params.conversationId - Conversation ID
   * @param {string} params.message - User's message
   * @returns {Promise<Object>} AI response with sources and credits used
   */
  static async call({ userId, conversationId, message }) {
      // Get chatbot constants for configuration
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: [
              'chatbot_validated_enabled',
              'chatbot_validated_model',
              'chatbot_validated_embedding_model',
              'chatbot_validated_cost',
              'chatbot_validated_last_message_count',
              'chatbot_validated_system_prompt',
              'chatbot_validated_search_count',
              'chatbot_validated_threshold',
              'chatbot_validated_rewrite_enabled',
              'chatbot_validated_rewrite_prompt',
            ]
          }
        }
      })

      const constantsMap = {}
      constants.forEach(c => { constantsMap[c.key] = c.value })

      const modeActive = constantsMap.chatbot_validated_enabled === 'true'
      if (!modeActive) {
          throw new ValidationError("Validated mode sedang tidak aktif. Silakan pilih mode lain")
      }

      const modelName = constantsMap.chatbot_validated_model || 'gemini-2.5-flash'
      const embeddingModel = constantsMap.chatbot_validated_embedding_model || 'gemini-2.5-flash'
      const creditsPerMessage = parseFloat(constantsMap.chatbot_validated_cost) || 10
      const lastMessageCount = parseInt(constantsMap.chatbot_validated_last_message_count) || 10
      const systemPrompt = constantsMap.chatbot_validated_system_prompt
      const searchCount = parseInt(constantsMap.chatbot_validated_search_count) || 5
      const threshold = parseFloat(constantsMap.chatbot_validated_threshold) || 0.3
      const rewriteEnabled = constantsMap.chatbot_validated_rewrite_enabled === 'true'
      const rewritePrompt = constantsMap.chatbot_validated_rewrite_prompt

      // Step 0: Query reformulation (if enabled)
      let queryForRetrieval = message
      if (rewriteEnabled) {
        console.log('Query rewrite enabled. Checking if reformulation is needed...')

        // Get recent conversation history for context (reuse lastMessageCount)
        const recentMessages = await prisma.chatbot_messages.findMany({
          where: {
            conversation_id: conversationId,
            is_deleted: false
          },
          orderBy: { id: 'desc' },
          take: lastMessageCount,
          select: {
            sender_type: true,
            content: true
          }
        })

        if (recentMessages.length > 0) {
          // Format conversation history
          const conversationHistory = recentMessages
            .reverse()
            .map(msg => `${msg.sender_type === 'user' ? 'User' : 'AI'}: ${msg.content}`)
            .join('\n')

          // Prepare rewrite prompt
          const rewritePromptWithVars = this.replacePlaceholders(rewritePrompt, {
            conversation_history: conversationHistory,
            user_query: message
          })

          console.log('Rewriting query with conversation context...')

          // Use AI to rewrite the query
          const AIService = RouterUtils.call(modelName)
          if (AIService) {
            try {
              const rewrittenQuery = await AIService.generateFromText(
                modelName,
                rewritePromptWithVars,
                [] // No conversation history for the rewrite itself
              )

              queryForRetrieval = rewrittenQuery.trim()
              console.log(`Original query: "${message}"`)
              console.log(`Rewritten query: "${queryForRetrieval}"`)
            } catch (error) {
              console.error('Query rewrite failed, using original query:', error)
              // Fallback to original query if rewrite fails
            }
          }
        }
      }

      // Step 1: Retrieve relevant context using RAG (with potentially rewritten query)
      console.log(`Searching for relevant context (limit: ${searchCount})...`)
      const ragResults = await RAGService.getRelevantContext(queryForRetrieval, {
        limit: searchCount,
        threshold: threshold,
        model: embeddingModel,
      })

      // Group chunks by note ID to avoid duplicate sources
      const groupedByNote = {}
      ragResults.sources.forEach(source => {
        if (!groupedByNote[source.noteId]) {
          groupedByNote[source.noteId] = {
            noteId: source.noteId,
            title: source.title,
            chunks: [],
            maxScore: source.score
          }
        }
        groupedByNote[source.noteId].chunks.push(source.content)
        // Keep the highest score for this note
        if (source.score > groupedByNote[source.noteId].maxScore) {
          groupedByNote[source.noteId].maxScore = source.score
        }
      })

      // Create unique sources (one per note) with combined content
      const uniqueSources = Object.values(groupedByNote).map(note => ({
        sourceType: 'summary_note',
        title: note.title,
        content: note.chunks.join('\n\n'), // Combine all chunks from same note
        noteId: note.noteId,
        score: note.maxScore
      }))

      console.log(`Grouped ${ragResults.sources.length} chunks into ${uniqueSources.length} unique notes`)

      // Construct context with unique note IDs
      const contextParts = uniqueSources.map((source, index) => {
        return `[Sumber ${index + 1} - Note ID: ${source.noteId} - ${source.title}]\n${source.content}\n`
      })
      const context = contextParts.join('\n---\n\n')

      console.log(context, uniqueSources)

      // Step 2: Get conversation history for final response generation
      const messages = await prisma.chatbot_messages.findMany({
        where: {
          conversation_id: conversationId,
          is_deleted: false
        },
        orderBy: { id: 'desc' },
        take: lastMessageCount,
        select: {
          sender_type: true,
          content: true
        }
      })

      const conversationHistory = messages.reverse()

      // Step 3: Replace placeholders in system prompt with actual RAG context
      console.log('Replacing placeholders in system prompt...')
      const processedSystemPrompt = this.replacePlaceholders(systemPrompt, {
        context: context || "Tidak ada konteks yang tersedia"
      })

      // Step 4: Generate streaming response using RouterUtils with processed prompt
      console.log('Generating AI response with RAG context (streaming)...')
      const AIService = RouterUtils.call(modelName)
      console.log(processedSystemPrompt)

      if (!AIService) {
        throw new ValidationError(`No AI provider found for model: ${modelName}`)
      }

      const stream = await AIService.generateStreamWithHistory(
        modelName,
        processedSystemPrompt,
        conversationHistory,
        message
      )

      // Map sources to include proper URLs for summary notes
      const sourcesWithUrls = uniqueSources.map(source => ({
        ...source,
        url: `/summary-notes/${source.noteId}`
      }))

      return {
        stream: stream,
        sources: sourcesWithUrls,
        creditsUsed: creditsPerMessage,
        provider: RouterUtils.getProvider(modelName),
      }
  }
}
