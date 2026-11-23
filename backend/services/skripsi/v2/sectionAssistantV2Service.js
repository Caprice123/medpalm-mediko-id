import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { GeminiService } from '#services/ai/gemini.service'
import { GetConstantsService } from '#services/constant/getConstantsService'
import { checkAccessAndDeductCredit } from '#services/shared/checkAccessAndDeductCreditService'
import { findOwnedSection } from '#services/skripsi/v2/skripsiSetOwnership'
import { buildReportContext, normalizeContextSelection } from '#services/skripsi/v2/skripsiReportContextV2'

const MAX_SELECTION_CHARS = 6000
const MAX_INSTRUCTION_CHARS = 500
const DEFAULT_MODEL = 'gemini-2.5-flash'

export const ASSISTANT_MODES = ['rewrite', 'draft']

// Shared by both modes: the rules that protect what a student already has.
const COMMON_RULES = [
  '- Gunakan Bahasa Indonesia ilmiah yang baku dan sesuai gaya penulisan laporan akademik.',
  '- Pertahankan istilah medis, nama obat, dosis, satuan dan angka apa adanya.',
  '- Jangan mengarang data, diagnosis, angka, atau sumber yang tidak ada pada konteks yang diberikan.',
  '- Jika konteks menyertakan daftar referensi, pakai penanda [n] yang sama persis; jangan membuat nomor baru.',
]

// Rewriting what the student highlighted. Identical in spirit to the prompt
// EditSectionTextV2Service uses — that service still serves the selection
// bubble untouched — with the citation rule kept word for word.
const REWRITE_PROMPT = [
  'Anda adalah asisten penyunting untuk laporan PBL (Problem-Based Learning) mahasiswa kedokteran berbahasa Indonesia.',
  'Tugas Anda hanya menyunting potongan teks yang diberikan sesuai instruksi penyunting.',
  '',
  'Aturan wajib:',
  '- Jawab HANYA dengan teks hasil suntingan. Tanpa pembuka, tanpa penutup, tanpa penjelasan, tanpa tanda kutip pembungkus, tanpa blok kode markdown.',
  ...COMMON_RULES,
  '- Pertahankan semua penanda sitasi seperti [1], [2] persis di posisi yang sama relatif terhadap kalimatnya.',
  '- Jangan menambah fakta, diagnosis, atau klaim baru yang tidak ada pada teks asli.',
  '- Jika teks asli sudah memenuhi instruksi, kembalikan teks tersebut dengan perbaikan seperlunya saja.',
].join('\n')

// Writing a section that does not exist yet. The output lands in a rich text
// editor, so a handful of HTML tags are allowed — and only that handful,
// because anything else arrives in the document as literal markup.
const DRAFT_PROMPT = [
  'Anda adalah asisten penulis untuk laporan PBL (Problem-Based Learning) mahasiswa kedokteran berbahasa Indonesia.',
  'Tugas Anda menulis draf untuk satu bagian laporan sesuai instruksi mahasiswa dan konteks laporan yang diberikan.',
  '',
  'Aturan wajib:',
  '- Jawab HANYA dengan isi bagian tersebut. Tanpa pembuka, tanpa penutup, tanpa komentar, tanpa blok kode markdown.',
  '- Jangan menulis ulang judul bagian; mahasiswa sudah punya judulnya.',
  '- Format dengan HTML sederhana saja: <p>, <ul>, <ol>, <li>, <strong>, <em>. Tanpa atribut, tanpa tag lain.',
  ...COMMON_RULES,
  '- Tulis draf yang masih wajar untuk disunting mahasiswa, bukan teks final yang mengaku lengkap.',
].join('\n')

// "Asisten bagian": one request, one result, nothing saved.
//
// Two modes behind one call. `rewrite` is the selection flow the editor has
// always had; `draft` is the one it could not do — a section that is still
// empty has nothing to select, so the student could never ask for a first
// version. Both read the same attachable context, which is what makes the
// answer about this report rather than about PBL reports in general.
export class SectionAssistantV2Service extends BaseService {
  static async call({ userId, sectionId, mode = 'rewrite', selectedText = '', instruction = '', context = null }) {
    if (!ASSISTANT_MODES.includes(mode)) {
      throw new ValidationError('Mode asisten tidak valid')
    }

    const text = typeof selectedText === 'string' ? selectedText.trim() : ''
    const customInstruction = typeof instruction === 'string' ? instruction.trim() : ''

    if (!customInstruction) {
      throw new ValidationError('Perintah untuk AI wajib diisi')
    }

    if (customInstruction.length > MAX_INSTRUCTION_CHARS) {
      throw new ValidationError(`Perintah terlalu panjang (maksimal ${MAX_INSTRUCTION_CHARS} karakter)`)
    }

    if (mode === 'rewrite') {
      if (!text) {
        throw new ValidationError('Teks yang mau diedit wajib dipilih')
      }

      if (text.length > MAX_SELECTION_CHARS) {
        throw new ValidationError(`Teks terpilih terlalu panjang (maksimal ${MAX_SELECTION_CHARS} karakter)`)
      }
    }

    // Ownership first: the section is also what gives the model its context.
    const section = await findOwnedSection(sectionId, userId)

    const constants = await GetConstantsService.call([
      'skripsi_access_type',
      'pbl_ai_edit_enabled',
      'pbl_ai_edit_cost',
      'pbl_ai_edit_model',
      'pbl_ai_edit_rewrite_prompt',
      'pbl_ai_edit_draft_prompt',
    ])

    if (constants.pbl_ai_edit_enabled !== 'true') {
      throw new ValidationError('Fitur asisten AI sedang tidak aktif')
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
      select: { id: true, title: true, case_text: true, citation_style: true },
    })

    const selection = normalizeContextSelection(context || {})

    // "Isi bagian ini" is a tick in the panel like any other, but it resolves
    // to this section rather than to an id the client has to name. In rewrite
    // mode it is what the surrounding paragraphs are, so the revision matches
    // the voice around it.
    const includeOwnSection = context?.section === true

    const reportContext = await buildReportContext({
      set,
      selection,
      alwaysSectionIds: includeOwnSection ? [section.id] : [],
    })

    const userPrompt = [
      reportContext,
      '',
      `Bagian yang sedang dikerjakan: ${section.title}`,
      '',
      'Instruksi mahasiswa:',
      `- ${customInstruction}`,
      mode === 'rewrite' ? `\nTeks yang harus disunting:\n"""\n${text}\n"""` : '',
    ].filter(Boolean).join('\n')

    const model = constants.pbl_ai_edit_model || DEFAULT_MODEL
    // The constant is the prompt, used as the admin typed it. The in-file
    // prompts are only the unseeded fallback — note what they carry, because
    // an admin replacing them owns those rules too: rewrite must return the
    // edited text alone, draft may emit only the tags the editor renders.
    const systemPrompt = mode === 'rewrite'
      ? (constants.pbl_ai_edit_rewrite_prompt || REWRITE_PROMPT)
      : (constants.pbl_ai_edit_draft_prompt || DRAFT_PROMPT)

    const answer = await GeminiService.generateFromText(model, systemPrompt, [
      { role: 'user', parts: [{ text: userPrompt }] },
    ])

    const cleaned = stripCodeFence(typeof answer === 'string' ? answer.trim() : '')

    if (!cleaned) {
      throw new ValidationError('AI tidak mengembalikan hasil, coba lagi')
    }

    return {
      sectionId: section.id,
      mode,
      original: text,
      // A draft is HTML for the editor; a revision replaces a selection inside
      // a sentence, so it has to stay plain or it would paste tags mid-line.
      result: mode === 'draft' ? sanitizeDraftHtml(cleaned) : stripTags(cleaned),
    }
  }
}

// Models wrap prose in a fence often enough to be worth undoing here rather
// than leaving ``` in the middle of a report.
function stripCodeFence(value) {
  const fenced = value.match(/^```[a-z]*\n([\s\S]*?)\n```$/i)
  return fenced ? fenced[1].trim() : value
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, '').trim()
}

// The prompt asks for a short list of tags; this is what makes that a
// guarantee. A draft goes straight into the student's document, so anything
// outside the allowlist — and every attribute, including an `onerror` on a tag
// that was never asked for — is dropped before it is ever stored.
const DRAFT_ALLOWED_TAGS = ['p', 'br', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i']

function sanitizeDraftHtml(value) {
  const stripped = value
    .replace(/<\/?(script|style|iframe|object|embed)[^>]*>/gi, '')
    .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (tag, name) => {
      if (!DRAFT_ALLOWED_TAGS.includes(name.toLowerCase())) return ''
      return tag.startsWith('</') ? `</${name.toLowerCase()}>` : `<${name.toLowerCase()}>`
    })
    .trim()

  // A model that answered in plain prose despite the prompt still has to land
  // in the editor as paragraphs rather than as one run-on line.
  if (/<(p|ul|ol)>/i.test(stripped)) return stripped

  return stripped
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => `<p>${block.replace(/\n/g, '<br>')}</p>`)
    .join('')
}
