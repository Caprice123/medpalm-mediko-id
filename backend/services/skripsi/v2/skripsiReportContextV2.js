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

// Everything is capped. A long case plus two long sections would otherwise
// push the actual question out of the model's window, and the cost of a
// message would grow with the report without anyone choosing that.
const LIMITS = {
  case: 4000,
  // Per section, when its full text was asked for.
  section: 6000,
  // Per section, for the one-line gist in the outline.
  outlineExcerpt: 180,
  citations: 30,
  // How many sections may be sent in full at once.
  sectionCount: 3,
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
  includeOutline: raw.outline === true,
  includeCitations: raw.citations === true,
  sectionIds: Array.isArray(raw.sectionIds)
    ? [...new Set(raw.sectionIds.map(Number).filter(Number.isInteger))].slice(0, LIMITS.sectionCount)
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
    .slice(0, LIMITS.sectionCount)

  if (selection.includeOutline || wantedIds.length > 0) {
    const sections = await prisma.skripsi_sections.findMany({
      where: { set_id: set.id },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
      select: { id: true, title: true, content: true },
    })

    if (selection.includeOutline && sections.length > 0) {
      // Titles plus a first line each: enough for the model to know what
      // already exists and not repeat it, without sending the whole report.
      const outline = sections.map((section, index) => {
        const text = htmlToText(section.content)
        const gist = text ? ` — ${truncate(text.split('\n')[0], LIMITS.outlineExcerpt)}` : ' — (masih kosong)'
        return `${index + 1}. ${section.title}${gist}`
      })

      blocks.push(`Kerangka laporan:\n${outline.join('\n')}`)
    }

    for (const id of wantedIds) {
      const section = sections.find(row => row.id === id)
      if (!section) continue

      const text = htmlToText(section.content)
      blocks.push(`Isi bagian "${section.title}":\n${text ? truncate(text, LIMITS.section) : '(masih kosong)'}`)
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
