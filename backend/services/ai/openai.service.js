import OpenAI from 'openai';
import { BaseAiService } from "./base.service.js";
import { ValidationError } from '#errors/validationError';
import fs from 'fs';
import path from 'path';
import os from 'os';

const openai = new OpenAI({
    apiKey: "test"
});

export class OpenAIService extends BaseAiService {
    /**
     * Generate result from text with custom prompt
     * @param {string} model - Model name (e.g., 'gpt-4o', 'gpt-4o-mini')
     * @param {string} systemPrompt - System prompt
     * @param {Array} messages - Conversation history in OpenAI format
     * @param {Object} options - Additional generation config options
     * @returns {Promise<string>} Raw text response
     */
    static async generateFromText(model, systemPrompt, messages = [], options = {}) {
        // Build messages array with system prompt
        const apiMessages = [
            { role: 'system', content: systemPrompt }
        ];

        // Add conversation history if provided
        if (messages.length > 0) {
            apiMessages.push(...messages);
        } else {
            // If no messages, add a minimal trigger
            apiMessages.push({
                role: 'user',
                content: 'Generate the requested content.'
            });
        }

        const completion = await openai.chat.completions.create({
            model: model,
            messages: apiMessages,
            temperature: options.temperature || 0.7,
            ...options
        });

        return completion.choices[0].message.content;
    }

    /**
     * Generate result from file buffer (PDF, Image, etc.) with custom prompt
     * Uses File API (upload file, use with Assistants) - better for documents
     * @param {string} model - Model name (e.g., 'gpt-4o', 'gpt-4o-mini')
     * @param {string} systemPrompt - System prompt
     * @param {Buffer} fileBuffer - File buffer
     * @param {string} mimeType - File mime type (e.g., 'application/pdf', 'image/jpeg', 'image/png')
     * @returns {Promise<string>} Raw text response
     */
    static async generateFromFile(model, systemPrompt, fileBuffer, mimeType) {
        const fileSizeMB = fileBuffer.length / (1024 * 1024);
        console.log(`Processing file buffer (${mimeType}) - Size: ${fileSizeMB.toFixed(2)} MB`);
        if (fileSizeMB > 512) {
            throw new ValidationError("File uploaded cannot more than 50 MB")
        }

        // Create temporary file
        const tempDir = os.tmpdir();
        const extension = mimeType === 'application/pdf' ? '.pdf' : '.jpg';
        const tempFileName = `openai-upload-${Date.now()}-${Math.random().toString(36).substring(7)}${extension}`;
        const tempFilePath = path.join(tempDir, tempFileName);

        try {
            // Write buffer to temp file
            fs.writeFileSync(tempFilePath, fileBuffer);
            console.log(`Temporary file created: ${tempFilePath}`);

            // Upload file to OpenAI File API
            console.log('Uploading file to OpenAI...');
            const uploadedFile = await openai.files.create({
                file: fs.createReadStream(tempFilePath),
                purpose: 'assistants'
            });

            console.log(`Uploaded file: ${uploadedFile.id}`);

            // Create an assistant with file_search enabled
            const assistant = await openai.beta.assistants.create({
                name: "Document Analyzer",
                instructions: systemPrompt,
                model: model,
                tools: [{ type: "file_search" }]
            });

            console.log(`Created assistant: ${assistant.id}`);

            // Create a thread and attach the file
            const thread = await openai.beta.threads.create({
                messages: [
                    {
                        role: "user",
                        content: "Please analyze this document according to the instructions.",
                        attachments: [
                            {
                                file_id: uploadedFile.id,
                                tools: [{ type: "file_search" }]
                            }
                        ]
                    }
                ]
            });

            console.log(`Created thread: ${thread.id}`);

            // Run the assistant
            const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
                assistant_id: assistant.id
            });

            console.log(`Run completed with status: ${run.status}`);

            // Get the messages
            const messages = await openai.beta.threads.messages.list(thread.id);
            const lastMessage = messages.data[0];
            const text = lastMessage.content[0].text.value;

            console.log('Content generated successfully');

            // Clean up: delete assistant, thread, and file
            try {
                await openai.beta.assistants.del(assistant.id);
                console.log('Assistant deleted from OpenAI');

                await openai.beta.threads.del(thread.id);
                console.log('Thread deleted from OpenAI');

                await openai.files.del(uploadedFile.id);
                console.log('File deleted from OpenAI');
            } catch (deleteError) {
                console.warn('Failed to delete resources from OpenAI:', deleteError.message);
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
     * @param {string} model - Model name (e.g., 'gpt-4o', 'gpt-4o-mini')
     * @param {string} systemPrompt - System prompt
     * @param {Array} conversationHistory - Previous messages from database
     * @param {string} userMessage - Current user message
     * @param {Object} options - Additional generation config options
     * @returns {Promise<AsyncGenerator>} Stream generator
     */
    static async generateStreamWithHistory(model, systemPrompt, conversationHistory, userMessage, options = {}) {
        // Build conversation history
        const messages = await this.buildConversationHistory(conversationHistory, userMessage);

        // Add system prompt at the beginning
        const apiMessages = [
            { role: 'system', content: systemPrompt },
            ...messages
        ];

        // Generate streaming response
        const stream = await openai.chat.completions.create({
            model: model,
            messages: apiMessages,
            temperature: options.temperature || 0.7,
            stream: true,
            ...options
        });

        // Convert OpenAI stream format to match Gemini's async generator
        return this.convertOpenAIStream(stream);
    }

    /**
     * Convert OpenAI stream to async generator that matches Gemini format
     * @param {Stream} openaiStream - OpenAI stream
     * @returns {AsyncGenerator} Async generator
     */
    static async* convertOpenAIStream(openaiStream) {
        for await (const chunk of openaiStream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield {
                    text: () => content
                };
            }
        }
    }

    /**
     * Build conversation history in OpenAI format
     * @param {Array} conversationHistory - Previous messages from database
     * @param {string} userMessage - Current user message
     * @returns {Promise<Array>} Messages in OpenAI format
     */
    static async buildConversationHistory(conversationHistory, userMessage) {
        const messages = conversationHistory.map(msg => ({
            role: msg.sender_type === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        // Add current message
        messages.push({
            role: 'user',
            content: userMessage
        });

        return messages;
    }
}
