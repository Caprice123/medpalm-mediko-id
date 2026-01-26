import { BaseAiService } from "./base.service.js";
import Perplexity from "@perplexity-ai/perplexity_ai";

const perplexity = new Perplexity({
    apiKey: process.env.PERPLEXITY_API_KEY
})

const defaultOptions = {
    temperature: 0.7,
    return_citations: true,
    return_images: false,
    search_recency_filter: 'month',
}

export class PerplexityService extends BaseAiService {
    /**
     * Generate result from text with custom prompt
     * @param {string} model - Model name (e.g., 'sonar', 'sonar-pro')
     * @param {string} systemPrompt - System prompt
     * @param {Array} messages - Conversation messages
     * @param {Object} options - Additional options
     * @returns {Promise<any>} Parsed JSON response
     */
    static async generateFromText(model, systemPrompt, messages = [], options = {}) {
        const mergedOptions = { ...defaultOptions, ...options }

        const response = await perplexity.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            ...mergedOptions,
        });

        const text = response.choices[0].message.content

        // Parse JSON response
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsedContent = JSON.parse(cleanedText);
        return parsedContent
    }

    /**
     * Generate result from PDF buffer with custom prompt
     * Uses base64 encoding for PDF attachments
     * @param {string} model - Model name (e.g., 'sonar', 'sonar-pro')
     * @param {string} systemPrompt - System prompt
     * @param {Buffer} pdfBuffer - PDF file buffer
     * @returns {Promise<any>} Parsed JSON response
     */
    static async generateFromFile(model, systemPrompt, pdfBuffer) {
        // Check file size (max 50MB for Perplexity)
        const fileSizeMB = pdfBuffer.length / (1024 * 1024);

        console.log(`Processing PDF buffer - Size: ${fileSizeMB.toFixed(2)} MB`);

        if (fileSizeMB > 50) {
            throw new Error(`PDF too large: ${fileSizeMB.toFixed(2)} MB (max 50 MB for Perplexity)`);
        }

        // Convert to base64 (Perplexity expects base64 without data URI prefix)
        const pdfBase64 = pdfBuffer.toString('base64');

        console.log('PDF converted to base64, generating content...');

        // Generate content using PDF attachment
        const response = await perplexity.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'document',
                            document: {
                                data: pdfBase64,
                                media_type: 'application/pdf'
                            }
                        },
                        {
                            type: 'text',
                            text: systemPrompt
                        }
                    ]
                }
            ],
            temperature: 0.7,
            return_citations: false,
            return_images: false
        });

        const text = response.choices[0].message.content;

        // Parse JSON response
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsedContent = JSON.parse(cleanedText);

        return parsedContent;
    }

    /**
     * Generate streaming response with conversation history
     * @param {string} model - Model name (e.g., 'sonar', 'sonar-pro')
     * @param {string} systemPrompt - System prompt
     * @param {Array} conversationHistory - Previous messages from database
     * @param {string} userMessage - Current user message
     * @param {Object} options - Additional options (search filters, etc.)
     * @returns {Promise<AsyncGenerator>} Stream generator
     */
    static async generateStreamWithHistory(model, systemPrompt, conversationHistory, userMessage, options = {}) {
        // Build conversation history
        const messages = await this.buildConversationHistory(conversationHistory, userMessage)

        // Merge with default options
        const mergedOptions = { ...defaultOptions, ...options }

        // Build request params
        const requestParams = {
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            stream: true,
            ...mergedOptions
        }

        // Create streaming chat completion
        const stream = await perplexity.chat.completions.create(requestParams)

        return stream
    }

    static async buildConversationHistory(conversationHistory, userMessage) {
        const messages = conversationHistory.map(msg => ({
            role: msg.sender_type === 'user' ? 'user' : 'assistant',
            content: msg.content
        }))

        // Add current query
        messages.push({ role: 'user', content: userMessage })
        return messages
    }
}
