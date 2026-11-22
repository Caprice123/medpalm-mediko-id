import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { GetConstantsService } from '#services/constant/getConstantsService'
import { buildReportContext } from '#services/skripsi/v2/skripsiReportContextV2'

// The AI Chat tab's answer, in normal mode: the configured prompt and model, the
// recent turns of this tab, and — this is the part V1 never had — whatever the
// student attached from their own report.
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
      'skripsi_ai_researcher_model',
      'skripsi_ai_researcher_prompt',
      'skripsi_ai_researcher_context_messages',
    ])

    if (constants.skripsi_ai_researcher_enabled !== 'true') {
      throw new ValidationError('Mode chat sedang tidak aktif')
    }

    const basePrompt = constants.skripsi_ai_researcher_prompt
    if (!basePrompt) {
      throw new ValidationError('System prompt untuk AI Chat belum diatur')
    }

    const modelName = constants.skripsi_ai_researcher_model
    const ModelService = RouterUtils.call(modelName)
    if (!ModelService) {
      throw new ValidationError(`Model ${modelName} tidak didukung`)
    }

    const systemPrompt = await this.buildSystemPrompt({ basePrompt, setId, context })

    const contextMessages = parseInt(constants.skripsi_ai_researcher_context_messages || '20')
    const history = tab.messages.slice(-contextMessages)

    const stream = await ModelService.generateStreamWithHistory(
      modelName,
      systemPrompt,
      history,
      message,
    )

    return { stream }
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
