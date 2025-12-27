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

        // Parse JSON response
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsedContent = JSON.parse(cleanedText);
        return parsedContent
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
        // Check file size (max 20MB for inline PDFs)
        const fileSizeMB = pdfBuffer.length / (1024 * 1024);

        console.log(`Processing PDF buffer - Size: ${fileSizeMB.toFixed(2)} MB`);

        if (fileSizeMB > 20) {
            throw new Error(`PDF too large: ${fileSizeMB.toFixed(2)} MB (max 20 MB for inline data)`);
        }

        // Convert to base64
        const pdfBase64 = pdfBuffer.toString('base64');

        console.log('PDF converted to base64, generating content...');

        // Generate content using inline PDF data
        const geminiModel = genAI.getGenerativeModel({ model: model });
        console.log([
            {
                inlineData: {
                    mimeType: 'application/pdf',
                    data: pdfBase64,
                },
            },
            { text: systemPrompt },
        ])

        const result = await geminiModel.generateContent([
            {
                inlineData: {
                    mimeType: 'application/pdf',
                    data: pdfBase64,
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
