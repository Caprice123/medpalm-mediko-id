import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { GetConstantsService } from '#services/constant/getConstantsService'
import { buildReportContext } from '#services/skripsi/v2/skripsiReportContextV2'

// The AI Chat tab's answer, in normal mode: the configured prompt, its own
// model, the recent turns of this tab, and — this is the part V1 never had —
// whatever the student attached from their own report.
//
// The model is read from `pbl_ai_chat_model` rather than the researcher key
// this tab used to share. That key is the Searcher's, and on this site it held
// `sonar-pro`: a plain chat was being answered by a search model, which cannot
// stream in a shape the chat handler reads and whose answers the Searcher's
// citation rules then discard.
//
// The prompt itself lives in `pbl_ai_chat_prompt` and is used exactly as the
// admin typed it. DEFAULT_PROMPT is only what a database that was never seeded
// falls back to, so the tab still answers before anyone has opened the panel.
//
// Its last paragraph is load-bearing, not boilerplate: this tab has no
// retrieval, so it never holds a reference list. Without being told that, a
// model asked for sources invents them — and the frontend turns a `[1]` it
// writes into a link to a source that does not exist. Worth keeping in
// whatever an admin replaces it with.
const DEFAULT_PROMPT = [
  'Kamu adalah asisten AI yang mendampingi mahasiswa kedokteran menyusun laporan PBL (Problem-Based Learning).',
  '',
  'Peranmu:',
  '- Menjelaskan konsep klinis dan mekanisme penyakit yang relevan dengan kasus',
  '- Membantu menyusun kerangka pembahasan dan alur argumen laporan',
  '- Meninjau struktur, koherensi, dan kualitas penulisan akademis',
  '- Membantu merumuskan learning issue dan menajamkan pertanyaan',
  '- Memberi masukan konstruktif atas bagian laporan yang dilampirkan mahasiswa',
  '',
  'Panduan:',
  '- Gunakan bahasa Indonesia formal dan akademis',
  '- Jawab langsung dan runtut; pakai poin bila itu memudahkan pembaca',
  '- Jika mahasiswa melampirkan isi laporannya, jadikan itu rujukan utama, dan jangan mengarang isi bagian yang masih kosong',
  '- Katakan terus terang bila kamu tidak yakin, dan sebutkan apa yang perlu mahasiswa verifikasi ke sumber primer',
  '- Untuk klaim klinis yang spesifik, arahkan mahasiswa memverifikasi lewat tab Searcher yang mencari jurnal dan guideline',
  '',
  'Tab ini percakapan biasa tanpa pencarian otomatis, jadi kamu tidak memegang daftar referensi. Jangan mengaku mengutip sumber yang tidak kamu miliki, dan jangan menuliskan penanda sitasi seperti [1].',
].join('\n')

//
// Kept out of SkripsiAIService on purpose. That service is shared with V1 and
// its generic branch is what the paraphraser and the diagram builder fall
// through to; teaching it about sections and cases would put V2's concerns in
// V1's path. Everything here is additive: with no context selected it produces
// exactly what that branch produced.
export class NormalChatV2Service extends BaseService {
  static async call({ tabId, setId, message, context }) {
    const tab = await prisma.skripsi_tabs.findUnique({
      where: { id: tabId },
      include: {
        messages: {
          orderBy: { id: 'asc' },
          take: 50,
        },
      },
    })

    if (!tab) {
      throw new ValidationError('Tab tidak ditemukan')
    }

    const constants = await GetConstantsService.call([
      'skripsi_ai_researcher_enabled',
      'pbl_ai_chat_model',
      'pbl_ai_chat_prompt',
      'skripsi_ai_researcher_context_messages',
    ])

    if (constants.skripsi_ai_researcher_enabled !== 'true') {
      throw new ValidationError('Mode chat sedang tidak aktif')
    }

    const basePrompt = constants.pbl_ai_chat_prompt || DEFAULT_PROMPT

    const modelName = constants.pbl_ai_chat_model || 'gemini-2.5-flash'
    const ModelService = RouterUtils.call(modelName)
    if (!ModelService) {
      throw new ValidationError(`Model ${modelName} tidak didukung`)
    }

    const systemPrompt = await this.buildSystemPrompt({ basePrompt, setId, context })

    const contextMessages = parseInt(constants.skripsi_ai_researcher_context_messages || '20')

    // An answer row is created empty and only filled once the client calls
    // finalize, so a stream the user stopped — or one that failed before its
    // first chunk — leaves a blank turn behind. Gemini ignores those, but
    // Perplexity rejects the whole request ("message N: content cannot be
    // empty"), and either way a blank turn is not context worth paying for.
    const history = tab.messages
      .filter(msg => msg.content && msg.content.trim().length > 0)
      .slice(-contextMessages)

    const stream = await ModelService.generateStreamWithHistory(
      modelName,
      systemPrompt,
      history,
      message,
    )

    // The provider is what tells the caller which streaming handler can read
    // this stream. Left absent it falls through to the Gemini handler, which
    // reads `chunk.text` — undefined on every other provider, so the answer
    // arrives as 0 characters with no error raised anywhere.
    return { stream, provider: RouterUtils.getProvider(modelName) }
  }

  // The report is given as reference material, never as something to echo: a
  // student who attaches a section wants it read, not read back to them.
  static async buildSystemPrompt({ basePrompt, setId, context }) {
    const hasSelection = context.includeCase
      || context.includeCitations
      || context.sectionIds.length > 0

    if (!hasSelection) return basePrompt

    const set = await prisma.skripsi_sets.findUnique({
      where: { id: setId },
      select: { id: true, title: true, case_text: true, citation_style: true },
    })

    if (!set) return basePrompt

    const reportContext = await buildReportContext({ set, selection: context })
    if (!reportContext) return basePrompt

    return [
      basePrompt,
      '',
      '--- KONTEKS LAPORAN MAHASISWA ---',
      'Berikut isi laporan yang sedang dikerjakan. Gunakan sebagai rujukan saat menjawab.',
      'Jangan menyalin ulang bagian ini ke dalam jawaban kecuali diminta, dan jangan mengarang isi bagian yang ditandai masih kosong.',
      '',
      reportContext,
      '--- AKHIR KONTEKS ---',
    ].join('\n')
  }
}
