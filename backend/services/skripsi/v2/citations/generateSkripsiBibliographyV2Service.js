import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { findOwnedSet } from '#services/skripsi/v2/skripsiSetOwnership'
import { SkripsiCitationV2Serializer } from '#serializers/api/v2/skripsiCitationSerializer'
import {
  CITATION_STYLES,
  DEFAULT_CITATION_STYLE,
  formatBibliographyHtml,
} from '#services/skripsi/v2/citations/citationFormats'

// "Generate daftar pustaka": every kept source, formatted in the chosen style,
// written into the report's reference section.
//
// The style is stored on the set, so the next generate keeps it and the panel
// reopens on the same one. The content is replaced rather than appended — a
// daftar pustaka is a complete list, and generating twice must not leave two of
// them — so the caller is the one that warns first; `append` is there for a
// student who keeps their own entries below the generated ones.
export class GenerateSkripsiBibliographyV2Service extends BaseService {
  static async call({ setId, userId, style = null, append = false }) {
    const set = await findOwnedSet(setId, userId)

    const chosen = style ?? set.citation_style ?? DEFAULT_CITATION_STYLE

    if (!CITATION_STYLES.includes(chosen)) {
      throw new ValidationError('Gaya sitasi tidak valid')
    }

    const citations = await prisma.skripsi_citations.findMany({
      where: { set_id: set.id },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    })

    if (citations.length === 0) {
      throw new ValidationError('Belum ada referensi yang disimpan untuk laporan ini')
    }

    const section = await this.findReferenceSection(set.id)

    if (!section) {
      throw new ValidationError('Bagian Referensi tidak ditemukan. Tambahkan satu bagian dulu.')
    }

    const html = formatBibliographyHtml(
      citations.map(citation => SkripsiCitationV2Serializer.toCitation(citation)),
      chosen,
    )

    const content = append ? `${section.content || ''}${html}` : html

    const [updated] = await prisma.$transaction([
      prisma.skripsi_sections.update({
        where: { id: section.id },
        data: { content, updated_at: new Date() },
      }),
      prisma.skripsi_sets.update({
        where: { id: set.id },
        data: { citation_style: chosen, updated_at: new Date() },
      }),
    ])

    return { section: updated, style: chosen, count: citations.length }
  }

  // The section flagged on creation, or — for a report whose flag was lost with
  // a deleted section — the last one, which is where the daftar pustaka goes
  // either way.
  static async findReferenceSection(setId) {
    const flagged = await prisma.skripsi_sections.findFirst({
      where: { set_id: setId, is_reference_slot: true },
    })

    if (flagged) return flagged

    return prisma.skripsi_sections.findFirst({
      where: { set_id: setId },
      orderBy: [{ position: 'desc' }, { id: 'desc' }],
    })
  }
}
