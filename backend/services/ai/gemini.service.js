import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseAiService } from "./base.service.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class GeminiService extends BaseAiService {
    static async generateFromText(model, systemPrompt, messages = [], options = {}) {
        // Create model with system instruction
        const geminiModel = genAI.getGenerativeModel({
            model: model,
            systemInstruction: systemPrompt,
            ...options
        });

        // If no messages, use minimal trigger
        const contents = messages.length > 0 ? messages : [
            {
                role: 'user',
                parts: [{ text: 'Generate the requested content.' }]
            }
        ];

        const result = await geminiModel.generateContent({ contents });

        const response = await result.response;
        const text = response.text();

        return text
    }

    /**
     * Generate result from PDF buffer with custom prompt
     * Uses inline base64 data (fast, simple, reliable)
     * @param {string} model - Model name (e.g., 'gemini-2.5-flash')
     * @param {string} systemPrompt - System prompt
     * @param {Buffer} pdfBuffer - PDF file buffer
     * @returns {Promise<any>} Parsed JSON response
     */
    static async generateFromPDF(model, systemPrompt, pdfBuffer) {
        return this.generateFromFile(model, systemPrompt, pdfBuffer, 'application/pdf');
    }

    /**
     * Generate result from file buffer (PDF, Image, etc.) with custom prompt
     * Uses inline base64 data (fast, simple, reliable)
     * @param {string} model - Model name (e.g., 'gemini-2.5-flash', 'gemini-2.0-flash')
     * @param {string} systemPrompt - System prompt
     * @param {Buffer} fileBuffer - File buffer
     * @param {string} mimeType - File mime type (e.g., 'application/pdf', 'image/jpeg', 'image/png')
     * @returns {Promise<string>} Raw text response
     */
    static async generateFromFile(model, systemPrompt, fileBuffer, mimeType) {
        // Check file size (max 20MB for inline files)
        const fileSizeMB = fileBuffer.length / (1024 * 1024);

        console.log(`Processing file buffer (${mimeType}) - Size: ${fileSizeMB.toFixed(2)} MB`);

        if (fileSizeMB > 20) {
            throw new Error(`File too large: ${fileSizeMB.toFixed(2)} MB (max 20 MB for inline data)`);
        }

        // Convert to base64
        const fileBase64 = fileBuffer.toString('base64');

        console.log('File converted to base64, generating content...');

        // Generate content using inline file data
        const geminiModel = genAI.getGenerativeModel({ model: model });

        const result = await geminiModel.generateContent([
            {
                inlineData: {
                    mimeType: mimeType,
                    data: fileBase64,
                },
            },
            { text: systemPrompt },
        ]);

        const response = await result.response;
        const text = response.text();

        return text;
    }

    static async buildConversationHistory(conversationHistory, userMessage) {
        const messages = conversationHistory.map(msg => ({
            role: msg.sender_type === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }))

        // Add current message
        messages.push({
            role: 'user',
            parts: [{ text: userMessage }]
        })
        return messages
    }
}
