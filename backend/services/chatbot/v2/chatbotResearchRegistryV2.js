import { GetConstantsService } from '#services/constant/getConstantsService'
import { ResearchModeV3 } from '#services/chatbot/ai/researchModeV3'
import { ResearchModeV2 } from '#services/chatbot/ai/researchModeV2'
import { ResearchModeAIService } from '#services/chatbot/ai/researchModeAIService'
import { ResearchModeWithQueryReformulation } from '#services/chatbot/ai/researchModeWithQueryReformulation'

// V1's SendMessageService hardcodes `ResearchModeV3` (OpenAlex retrieval + Gemini
// generation) as the one research implementation. Four implementations actually
// exist in `services/chatbot/ai/`, all returning the same
// `{ stream, provider, sources, noResults? }` shape, so which one answers a
// research message is a choice — not something that should need a deploy.
//
// V2 reads that choice from the `chatbot_v2_research_implementation` constant so
// an admin can move research mode between OpenAlex and Perplexity from the panel.
// The default is `perplexity_retrieval_v2` — Perplexity retrieves, Gemini writes
// the answer. V1 stays hardcoded to `openalex_v3`, so the two differ on purpose:
// moving V2 back to OpenAlex is one constant value away.
export const RESEARCH_IMPLEMENTATION_KEY = 'chatbot_v2_research_implementation'
export const DEFAULT_RESEARCH_IMPLEMENTATION = 'perplexity_retrieval_v2'

// `retriever` is documentation for the admin panel, not behaviour — the handler is
// picked off the `provider` the service actually returns.
export const RESEARCH_IMPLEMENTATIONS = {
  openalex_v3: {
    service: ResearchModeV3,
    retriever: 'openalex',
    label: 'OpenAlex V3 — jurnal peer-reviewed + generasi Gemini',
  },
  perplexity_retrieval_v2: {
    service: ResearchModeV2,
    retriever: 'perplexity',
    label: 'Perplexity V2 — retrieval Perplexity + generasi Gemini',
  },
  perplexity_sonar: {
    service: ResearchModeAIService,
    retriever: 'perplexity',
    label: 'Perplexity Sonar — streaming langsung dengan filter domain',
  },
  perplexity_reformulated: {
    service: ResearchModeWithQueryReformulation,
    retriever: 'perplexity',
    label: 'Perplexity + reformulasi kueri Inggris',
  },
}

// A developer can try another implementation without touching the constant the
// whole environment shares: `CHATBOT_RESEARCH_IMPLEMENTATION` in that machine's
// own .env wins over the database. Nothing sets it in production, so production
// keeps answering from the constant.
export const RESEARCH_IMPLEMENTATION_ENV = 'CHATBOT_RESEARCH_IMPLEMENTATION'

export class ChatbotResearchRegistryV2 {
  // Resolves the configured research implementation. An unknown or unset
  // constant falls back to the default rather than failing the message — a typo
  // in the panel must not take research mode offline.
  static async resolve() {
    const override = process.env[RESEARCH_IMPLEMENTATION_ENV]
    if (override) {
      if (RESEARCH_IMPLEMENTATIONS[override]) {
        console.log(`[ChatbotResearchRegistryV2] ${RESEARCH_IMPLEMENTATION_ENV}=${override} overrides the constant`)
        return { key: override, ...RESEARCH_IMPLEMENTATIONS[override] }
      }
      console.warn(`[ChatbotResearchRegistryV2] ${RESEARCH_IMPLEMENTATION_ENV}=${override} is not a known implementation, ignoring it`)
    }

    const constants = await GetConstantsService.call([RESEARCH_IMPLEMENTATION_KEY])
    const configured = constants[RESEARCH_IMPLEMENTATION_KEY]
    const key = RESEARCH_IMPLEMENTATIONS[configured] ? configured : DEFAULT_RESEARCH_IMPLEMENTATION

    return { key, ...RESEARCH_IMPLEMENTATIONS[key] }
  }
}
