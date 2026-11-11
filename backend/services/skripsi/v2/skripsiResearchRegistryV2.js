import { GetConstantsService } from '#services/constant/getConstantsService'
import { SkripsiResearchModeV3 } from '#services/skripsi/ai/skripsiResearchModeV3'
import { SkripsiResearchModeV2 } from '#services/skripsi/ai/skripsiResearchModeV2'
import { SkripsiResearchModeWithQueryReformulation } from '#services/skripsi/ai/skripsiResearchModeWithQueryReformulation'

// The same arrangement the chatbot has, for the same reason: three research
// implementations live in `services/skripsi/ai/`, all returning the same
// `{ stream, provider, sources, noResults? }` shape, and V1's SendMessageService
// hardcodes SkripsiResearchModeV3 (OpenAlex) — so moving research between
// OpenAlex and Perplexity was a deploy rather than a setting.
//
// V2 reads the choice from `skripsi_v2_research_implementation`. The default is
// `openalex_v3`, exactly what V1 does today, and an unknown value falls back
// instead of taking research mode offline.
//
// Kept separate from the chatbot's registry on purpose: these services resolve
// their journal filter from a skripsi SET's settings, not from the user's chat
// settings, so the two features' research configuration is genuinely different
// and must stay independently switchable.
export const RESEARCH_IMPLEMENTATION_KEY = 'skripsi_v2_research_implementation'
export const DEFAULT_RESEARCH_IMPLEMENTATION = 'openalex_v3'

export const RESEARCH_IMPLEMENTATIONS = {
  openalex_v3: {
    service: SkripsiResearchModeV3,
    retriever: 'openalex',
    label: 'OpenAlex V3 — jurnal peer-reviewed + generasi Gemini',
  },
  perplexity_retrieval_v2: {
    service: SkripsiResearchModeV2,
    retriever: 'perplexity',
    label: 'Perplexity V2 — retrieval Perplexity + generasi Gemini',
  },
  perplexity_reformulated: {
    service: SkripsiResearchModeWithQueryReformulation,
    retriever: 'perplexity',
    label: 'Perplexity + reformulasi kueri Inggris',
  },
}

export class SkripsiResearchRegistryV2 {
  static async resolve() {
    const constants = await GetConstantsService.call([RESEARCH_IMPLEMENTATION_KEY])
    const configured = constants[RESEARCH_IMPLEMENTATION_KEY]
    const key = RESEARCH_IMPLEMENTATIONS[configured] ? configured : DEFAULT_RESEARCH_IMPLEMENTATION

    return { key, ...RESEARCH_IMPLEMENTATIONS[key] }
  }
}
