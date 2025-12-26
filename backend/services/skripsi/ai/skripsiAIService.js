import { GoogleGenerativeAI } from '@google/generative-ai'
import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export class SkripsiAIService extends BaseService {
  /**
   * Generate AI response based on tab type with streaming support
   * @param {number} tabId - The tab ID
   * @param {string} message - The user's message
   * @param {string} tabType - The tab type (ai_researcher_1, ai_researcher_2, ai_researcher_3, paraphraser, diagram_builder)
   * @returns {Promise<{stream: AsyncGenerator}>}
   */
  static async call({ tabId, message, tabType }) {
    // Get tab conversation history (fetch more than needed, we'll slice based on config)
    const tab = await prisma.skripsi_tabs.findUnique({
      where: { id: tabId },
      include: {
        messages: {
          orderBy: { created_at: 'asc' },
          take: 50 // Fetch up to 50, will be trimmed based on context_messages setting
        }
      }
    })

    if (!tab) {
      throw new ValidationError('Tab not found')
    }

    // Map tab type to mode (ai_researcher_1/2/3 all use ai_researcher)
    const mode = this.getMode(tabType)

    // Get constants for this mode and global settings
    const constantKeys = [
      'skripsi_is_active',
      `skripsi_${mode}_enabled`,
      `skripsi_${mode}_model`,
      `skripsi_${mode}_prompt`,
      `skripsi_${mode}_context_messages`
    ]

    const constants = await prisma.constants.findMany({
      where: {
        key: { in: constantKeys }
      }
    })

    const constantsMap = {}
    constants.forEach(c => { constantsMap[c.key] = c.value })

    // Check if feature is globally enabled
    const featureActive = constantsMap['skripsi_is_active'] === 'true'
    if (!featureActive) {
      throw new ValidationError('Skripsi Builder feature is currently disabled')
    }

    // Check if mode is enabled
    const modeEnabled = constantsMap[`skripsi_${mode}_enabled`] === 'true'
    if (!modeEnabled) {
      throw new ValidationError(`Mode ${mode} is currently disabled`)
    }

    // Get system prompt and model
    const systemPrompt = constantsMap[`skripsi_${mode}_prompt`]
    if (!systemPrompt) {
      throw new ValidationError(`System prompt not configured for ${mode}`)
    }

    const modelName = constantsMap[`skripsi_${mode}_model`] || 'gemini-2.0-flash-exp'
    const contextMessages = parseInt(constantsMap[`skripsi_${mode}_context_messages`] || '20')

    // Build conversation history with configurable context length
    const history = tab.messages.slice(-contextMessages).map(msg => ({
      role: msg.sender_type === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    // Initialize Gemini model with system instruction
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt
    })

    // Start chat with history
    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    })

    // Send message and get streaming response
    const result = await chat.sendMessageStream(message)

    return {
      stream: result.stream
    }
  }

  /**
   * Map tab type to mode
   * ai_researcher_1, ai_researcher_2, ai_researcher_3 → ai_researcher
   * paraphraser → paraphraser
   * diagram_builder → diagram_builder
   */
  static getMode(tabType) {
    if (tabType.startsWith('ai_researcher')) {
      return 'ai_researcher'
    }
    return tabType
  }
}
