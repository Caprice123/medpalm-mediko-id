import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { GeminiService } from '#services/ai/gemini.service'
import { GetConstantsService } from '#services/constant/getConstantsService'
import { checkAccessAndDeductCredit } from '#services/shared/checkAccessAndDeductCreditService'
import { findOwnedSection } from '#services/skripsi/v2/skripsiSetOwnership'

const MAX_SELECTION_CHARS = 6000
const MAX_INSTRUCTION_CHARS = 500
const DEFAULT_MODEL = 'gemini-2.5-flash'

// The model is told what it is editing and, just as importantly, what it must
// not touch: a revision that drops a citation marker would quietly detach a
// sentence from the source the student found for it.
const SYSTEM_PROMPT = [
  'Anda adalah asisten penyunting untuk laporan PBL (Problem-Based Learning) mahasiswa kedokteran berbahasa Indonesia.',
  'Tugas Anda hanya menyunting potongan teks yang diberikan sesuai instruksi penyunting.',
  '',
  'Aturan wajib:',
  '- Jawab HANYA dengan teks hasil suntingan. Tanpa pembuka, tanpa penutup, tanpa penjelasan, tanpa tanda kutip pembungkus, tanpa blok kode markdown.',
  '- Gunakan Bahasa Indonesia ilmiah yang baku dan sesuai gaya penulisan laporan akademik.',
  '- Pertahankan semua penanda sitasi seperti [1], [2] persis di posisi yang sama relatif terhadap kalimatnya.',
  '- Pertahankan istilah medis, nama obat, dosis, satuan dan angka apa adanya.',
  '- Jangan menambah fakta, diagnosis, atau klaim baru yang tidak ada pada teks asli.',
  '- Jika teks asli sudah memenuhi instruksi, kembalikan teks tersebut dengan perbaikan seperlunya saja.',
].join('\n')

// Rewrites a selection from one section's editor. Nothing is written to the
// database: the revision goes back to the browser, and it is the student who
// decides whether it replaces what they had.
export class EditSectionTextV2Service extends BaseService {
  static async call({ userId, sectionId, selectedText, instruction = '' }) {
    const text = typeof selectedText === 'string' ? selectedText.trim() : ''
    const customInstruction = typeof instruction === 'string' ? instruction.trim() : ''

    if (!text) {
      throw new ValidationError('Teks yang mau diedit wajib dipilih')
    }

    if (text.length > MAX_SELECTION_CHARS) {
      throw new ValidationError(`Teks terpilih terlalu panjang (maksimal ${MAX_SELECTION_CHARS} karakter)`)
    }

    // The quick-action chips write their wording into the same box the student
    // types in, so there is one instruction to validate rather than a preset
    // and a free-text prompt that could contradict each other.
    if (!customInstruction) {
      throw new ValidationError('Perintah untuk AI wajib diisi')
    }

    if (customInstruction.length > MAX_INSTRUCTION_CHARS) {
      throw new ValidationError(`Perintah terlalu panjang (maksimal ${MAX_INSTRUCTION_CHARS} karakter)`)
    }

    // Ownership first: the section is also what gives the model its context.
    const section = await findOwnedSection(sectionId, userId)

    const constants = await GetConstantsService.call([
      'skripsi_access_type',
      'pbl_ai_edit_enabled',
      'pbl_ai_edit_cost',
      'pbl_ai_edit_model',
      'pbl_ai_edit_rewrite_prompt',
    ])

    if (constants.pbl_ai_edit_enabled !== 'true') {
      throw new ValidationError('Fitur Edit dengan AI sedang tidak aktif')
    }

    await checkAccessAndDeductCredit(prisma, {
      userId,
      userRole: 'user',
      accessTypeKey: 'skripsi_access_type',
      creditCostKey: 'pbl_ai_edit_cost',
      // Matching the chat and searcher paths, which check access but do not
      // charge; turning billing on for the whole feature is one decision.
      deductCredit: false,
      description: '',
      featureKey: 'skripsi_builder',
    })

    const set = await prisma.skripsi_sets.findUnique({
      where: { id: section.set_id },
      select: { title: true, case_text: true },
    })

    const userPrompt = [
      `Judul laporan: ${set?.title || '-'}`,
      `Bagian laporan: ${section.title}`,
      set?.case_text ? `\nKasus PBL (konteks, jangan ikut disunting):\n${set.case_text}` : '',
      '\nInstruksi penyunting:',
      `- ${customInstruction}`,
      '\nTeks yang harus disunting:\n"""',
      text,
      '"""',
    ].filter(Boolean).join('\n')

    const model = constants.pbl_ai_edit_model || DEFAULT_MODEL

    // Shares the rewrite prompt with SectionAssistantV2Service: both edit a
    // selection, so two settings an admin had to keep in step would be one
    // setting too many. SYSTEM_PROMPT is the unseeded fallback.
    const systemPrompt = constants.pbl_ai_edit_rewrite_prompt || SYSTEM_PROMPT

    const revised = await GeminiService.generateFromText(model, systemPrompt, [
      { role: 'user', parts: [{ text: userPrompt }] },
    ])

    const cleaned = stripCodeFence(typeof revised === 'string' ? revised.trim() : '')

    if (!cleaned) {
      throw new ValidationError('AI tidak mengembalikan hasil, coba lagi')
    }

    return {
      sectionId: section.id,
      original: text,
      revised: cleaned,
    }
  }
}

// Models wrap prose in a fence often enough to be worth undoing here rather
// than leaving ``` in the middle of a report.
function stripCodeFence(value) {
  const fenced = value.match(/^```[a-z]*\n([\s\S]*?)\n```$/i)
  return fenced ? fenced[1].trim() : value
}
