import { BaseAiService } from "./base.service.js";
import { ValidationError } from '#errors/validationError';
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

// The API matches `search_domain_filter` on the host alone and takes at most 200
// entries: a list carrying schemes, paths or `www.` prefixes quietly matches
// nothing, and one entry too many fails the whole search with a 400. The admin
// trusted-domain list is maintained by hand and does overflow both, so every
// request is normalised here rather than at each call site.
const MAX_DOMAIN_FILTER = 200

const toHostList = (domains) => {
    const hosts = []
    const seen = new Set()

    for (const raw of Array.isArray(domains) ? domains : []) {
        const host = String(raw ?? '').trim().toLowerCase()
            .replace(/^https?:\/\//, '')
            .split('/')[0]
            .replace(/^www\./, '')

        if (!host || seen.has(host)) continue
        seen.add(host)
        hosts.push(host)
        if (hosts.length >= MAX_DOMAIN_FILTER) break
    }

    return hosts
}

// Returns the options with a usable domain filter, or without one when nothing
// survives normalising — an empty filter array is itself a 400.
const withNormalizedDomainFilter = (options) => {
    if (!options.search_domain_filter) return options

    const hosts = toHostList(options.search_domain_filter)
    const normalized = { ...options }

    if (hosts.length === 0) {
        delete normalized.search_domain_filter
        console.warn('[Perplexity] domain filter dropped: no usable host in the configured list')
        return normalized
    }

    if (hosts.length < options.search_domain_filter.length) {
        console.log(`[Perplexity] domain filter normalised: ${options.search_domain_filter.length} entries → ${hosts.length} hosts (cap ${MAX_DOMAIN_FILTER})`)
    }

    normalized.search_domain_filter = hosts
    return normalized
}

// Flipped the first time the Search API answers "search_mode is not supported".
// The parameter is in the SDK but is not accepted on every key, and a search is
// worth more than the web/academic split it asks for.
let isSearchModeSupported = true

const isUnsupportedSearchMode = (error) => {
    const message = error?.error?.error?.message || error?.error?.message || error?.message || ''

    return error?.status === 400 && /search_mode/i.test(message)
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
    static async generateFromFile(model, systemPrompt, pdfBuffer, _mimeType) {
        // Check file size (max 50MB for Perplexity)
        const fileSizeMB = pdfBuffer.length / (1024 * 1024);

        console.log(`Processing PDF buffer - Size: ${fileSizeMB.toFixed(2)} MB`);

        if (fileSizeMB > 50) {
            throw new ValidationError(`PDF too large: ${fileSizeMB.toFixed(2)} MB (max 50 MB for Perplexity)`);
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
        const requestParams = withNormalizedDomainFilter({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            stream: true,
            ...mergedOptions
        })

        // Create streaming chat completion
        console.log(requestParams)
        const stream = await perplexity.chat.completions.create(requestParams)

        return stream
    }

    /**
     * Non-streaming search — returns search_results with snippets for RAG use.
     * Use this when you want Perplexity as a retriever only (not for answer generation).
     * @returns {{ searchResults: Array, citations: string[] }}
     */
    static async fetchSearchResults(model, systemPrompt, conversationHistory, userMessage, options = {}) {
        const messages = await this.buildConversationHistory(conversationHistory, userMessage)

        const mergedOptions = {
            temperature: 0.2,
            return_citations: true,
            return_images: false,
            ...options,
            stream: false
        }

        const response = await perplexity.chat.completions.create(withNormalizedDomainFilter({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            ...mergedOptions
        }))

        const searchResults = response.search_results || []
        const citations = response.citations || []

        console.log(`[Perplexity] fetchSearchResults: ${searchResults.length} results, ${citations.length} citations`)

        return { searchResults, citations }
    }

    /**
     * Perplexity Search API: web page results for one or several queries, with
     * no model answering on top. The raw response comes back too, since the
     * Searcher panel can show it verbatim.
     * @param {Object} params - query (string or array), search_mode, max_results, filters
     * @returns {Promise<{ id: string, results: Array, raw: Object }>}
     */
    static async search(params) {
        const response = await this.createSearch(params)

        return {
            id: response.id,
            results: response.results || [],
            raw: response,
        }
    }

    /**
     * The search request itself, with `search_mode` treated as optional at the
     * API's discretion: a key whose plan rejects it failed the whole search, so
     * the first rejection drops the parameter, retries, and is remembered for
     * the rest of the process rather than paying a failed round trip every
     * time. Only the web/academic split is lost — every other filter stands.
     * @param {Object} params - query (string or array), search_mode, max_results, filters
     */
    static async createSearch(rawParams) {
        const params = withNormalizedDomainFilter(rawParams)
        const withoutMode = { ...params }
        delete withoutMode.search_mode

        if (!params.search_mode || !isSearchModeSupported) {
            return perplexity.search.create(withoutMode)
        }

        try {
            return await perplexity.search.create(params)
        } catch (error) {
            if (!isUnsupportedSearchMode(error)) throw error

            isSearchModeSupported = false
            console.warn('[Perplexity] search_mode rejected by this API key, searching without it')

            return perplexity.search.create(withoutMode)
        }
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
