import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseAiService } from "./base.service.js";
import fs from 'fs';
import path from 'path';
import os from 'os';

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

        console.log({
            model: model,
            systemInstruction: systemPrompt,
            contents,
        })

        const result = await geminiModel.generateContent({ contents });

        const response = await result.response;
        const text = response.text();

        return text
    }

    /**
     * Generate result from file buffer (PDF, Image, etc.) with custom prompt
     * Uses File API (upload file, use URI reference) - better for large files
     * @param {string} model - Model name (e.g., 'gemini-2.5-flash', 'gemini-2.0-flash')
     * @param {string} systemPrompt - System prompt
     * @param {Buffer} fileBuffer - File buffer
     * @param {string} mimeType - File mime type (e.g., 'application/pdf', 'image/jpeg', 'image/png')
     * @returns {Promise<string>} Raw text response
     */
    static async generateFromFile(model, systemPrompt, fileBuffer, mimeType) {
        const fileSizeMB = fileBuffer.length / (1024 * 1024);
        console.log(`Processing file buffer (${mimeType}) - Size: ${fileSizeMB.toFixed(2)} MB`);

        if (fileSizeMB > 50) {
            throw new Error("File uploaded cannot more than 50 MB")
        }

        // Create temporary file
        const tempDir = os.tmpdir();
        const tempFileName = `gemini-upload-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const tempFilePath = path.join(tempDir, tempFileName);

        try {
            // Write buffer to temp file
            fs.writeFileSync(tempFilePath, fileBuffer);
            console.log(`Temporary file created: ${tempFilePath}`);

            // Upload file to Gemini File API
            console.log('Uploading file to Gemini...');
            const uploadedFile = await genAI.files.upload({
                file: tempFilePath,
                mimeType: mimeType,
                displayName: tempFileName
            });

            console.log(`Uploaded file ${uploadedFile.displayName} as: ${uploadedFile.name}`);
            console.log(`File URI: ${uploadedFile.uri}`);

            // Generate content using uploaded file
            const response = await genAI.models.generateContent({
                model: model,
                contents: [
                    {
                        fileData: {
                            mimeType: uploadedFile.mimeType,
                            fileUri: uploadedFile.uri,
                        },
                    },
                    { text: systemPrompt },
                ],
            });

            const text = response.text;
            console.log('Content generated successfully');

            // Optional: Delete file from Gemini (files auto-expire after 48 hours anyway)
            try {
                await genAI.files.delete(uploadedFile.name);
                console.log('File deleted from Gemini');
            } catch (deleteError) {
                console.warn('Failed to delete file from Gemini:', deleteError.message);
            }

            return text;
        } finally {
            // Clean up temporary file
            try {
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                    console.log('Temporary file deleted');
                }
            } catch (cleanupError) {
                console.warn('Failed to delete temporary file:', cleanupError.message);
            }
        }
    }

    /**
     * Generate streaming response with conversation history
     * @param {string} model - Model name (e.g., 'gemini-2.5-flash')
     * @param {string} systemPrompt - System prompt
     * @param {Array} conversationHistory - Previous messages from database
     * @param {string} userMessage - Current user message
     * @param {Object} options - Additional generation config options
     * @returns {Promise<AsyncGenerator>} Stream generator
     */
    static async generateStreamWithHistory(model, systemPrompt, conversationHistory, userMessage, options = {}) {
        // Build conversation history
        const messages = await this.buildConversationHistory(conversationHistory, userMessage)

        // Initialize Gemini model with system instruction
        const geminiModel = genAI.getGenerativeModel({
            model: model,
            systemInstruction: systemPrompt
        })

        // Default generation config
        const generationConfig = {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            ...options
        }

        console.log({
            model: model,
            systemInstruction: systemPrompt,
            messages,
            generationConfig
        })

        // Generate streaming response
        const result = await geminiModel.generateContentStream({
            contents: messages,
            generationConfig
        })

        return result.stream
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
