import prisma from '#prisma/client'
import { SkripsiCitationV2Serializer } from '#serializers/api/v2/skripsiCitationSerializer'
import {
  DEFAULT_CITATION_STYLE,
  formatEntryText,
  sortForStyle,
} from '#services/skripsi/v2/citations/citationFormats'

// What the report itself can tell the model, assembled from the pieces the
// student ticked.
//
// One module for both callers — the AI Chat panel and the per-section
// assistant — so "the case" means the same text, trimmed the same way, in both.
// Nothing here decides what to include; the caller passes a selection and gets
// back a block of plain text to drop above its own prompt.

// One cap across everything a student attaches, rather than a ceiling on each
// piece: any number of sections may go, any one of them may be as long as it
// is, and what bounds the prompt is what the whole of it would cost.
const LIMITS = {
  case: 4000,
  citations: 30,
  // Across every attached section. Only a genuinely long report reaches it
  // - ten full-length sections fit underneath - and when it is reached the
  // prompt says so rather than dropping the rest silently.
  sectionsTotal: 60000,
}

// Section content is editor HTML. The model reads prose, and the markup is
// both noise and tokens — but a list has to survive as a list, and a block
// boundary has to survive as a newline.
export const htmlToText = (html) => String(html ?? '')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, '\n')
  .replace(/<li[^>]*>/gi, '- ')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/[ \t]+/g, ' ')
  .replace(/\n{3,}/g, '\n\n')
  .trim()

const truncate = (text, limit) => {
  const value = String(text ?? '').trim()
  if (value.length <= limit) return value
  return `${value.slice(0, limit).trimEnd()}…`
}

/**
 * The selection a client may ask for, normalised. Anything missing is off:
 * context is opt-in on the wire so a caller that sends nothing gets the
 * behaviour it had before context existed.
 */
export const normalizeContextSelection = (raw = {}) => ({
  includeCase: raw.case === true,
  includeCitations: raw.citations === true,
  sectionIds: Array.isArray(raw.sectionIds)
    ? [...new Set(raw.sectionIds.map(Number).filter(Number.isInteger))]
    : [],
})

/**
 * Builds the context block for one report.
 * @param {Object} params
 * @param {Object} params.set - the skripsi_sets row (title + case_text are read)
 * @param {Object} params.selection - from normalizeContextSelection
 * @param {number[]} [params.alwaysSectionIds] - sections the caller includes on
 *   its own account, e.g. the section an assistant is working inside
 * @returns {Promise<string>} plain text, empty when nothing was selected
 */
export async function buildReportContext({ set, selection, alwaysSectionIds = [] }) {
  const blocks = [`Judul laporan: ${set.title || '-'}`]

  if (selection.includeCase && set.case_text) {
    blocks.push(`Kasus PBL (konteks, bukan bagian yang ditulis):\n${truncate(set.case_text, LIMITS.case)}`)
  }

  const wantedIds = [...new Set([...alwaysSectionIds, ...selection.sectionIds])]

  if (wantedIds.length > 0) {
    const sections = await prisma.skripsi_sections.findMany({
      where: { set_id: set.id },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
      select: { id: true, title: true, content: true },
    })

    // Added in the order the caller asked for, so the section an assistant
    // is working inside - which `alwaysSectionIds` puts first - is never the
    // one the budget drops.
    let remaining = LIMITS.sectionsTotal
    let skipped = 0

    for (const id of wantedIds) {
      const section = sections.find(row => row.id === id)
      if (!section) continue

      const text = htmlToText(section.content)

      // An empty section costs nothing to mention and is worth mentioning:
      // it tells the model that part of the report is still unwritten.
      if (!text) {
        blocks.push(`Isi bagian "${section.title}":\n(masih kosong)`)
        continue
      }

      if (remaining <= 0) {
        skipped += 1
        continue
      }

      // No per-section ceiling: a section attached on its own may use the
      // whole budget. Only the shared total bounds it, and a section the total
      // does cut off says so - a block that stops mid-sentence with nothing to
      // mark it reads to the model as a report that simply ends there.
      const body = truncate(text, remaining)
      remaining -= body.length

      const cut = body.length < text.length
        ? '\n(bagian ini dipotong karena konteks sudah penuh)'
        : ''

      blocks.push(`Isi bagian "${section.title}":\n${body}${cut}`)
    }

    // Said out loud: a model told the report continues will not treat what
    // it was given as the whole of it.
    if (skipped > 0) {
      blocks.push(`Catatan: ${skipped} bagian lain dilampirkan mahasiswa tetapi tidak muat dan tidak disertakan di sini.`)
    }
  }

  if (selection.includeCitations) {
    const rows = await prisma.skripsi_citations.findMany({
      where: { set_id: set.id },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
      take: LIMITS.citations,
    })

    if (rows.length > 0) {
      // Numbered exactly as the daftar pustaka will be, so a draft that writes
      // "[2]" points at the same source the generated list calls 2.
      const style = set.citation_style || DEFAULT_CITATION_STYLE
      const citations = rows.map(row => SkripsiCitationV2Serializer.toCitation(row))
      const entries = sortForStyle(citations, style)
        .map((citation, index) => `[${index + 1}] ${formatEntryText(citation, style)}`)

      blocks.push(`Referensi tersimpan (gunakan penanda [n] persis seperti di sini):\n${entries.join('\n')}`)
    }
  }

  return blocks.join('\n\n')
}
