import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { NotFoundError } from '#errors/notFoundError'
import { parseAuthorsInput } from '#services/skripsi/v2/citations/citationAuthors'

// The edit form behind each kept source. Crossref and PubMed answer for journal
// articles; a guideline or a faculty PDF has no registry to ask, and its author
// is an institution no URL reveals — so the fields a style needs are editable
// by hand. Without this the non-journal half of every daftar pustaka would come
// out without an author.
//
// The URL is not editable: it identifies the source, and changing it would mean
// the stored metadata no longer describes what the row points at.
export class UpdateSkripsiCitationV2Service extends BaseService {
  static async call({ citationId, userId, ...fields }) {
    const citation = await prisma.skripsi_citations.findFirst({
      where: {
        id: parseInt(citationId),
        skripsi_set: { user_id: userId, is_deleted: false },
      },
    })

    if (!citation) {
      throw new NotFoundError('Referensi tidak ditemukan')
    }

    const data = { updated_at: new Date() }

    if (fields.title !== undefined) {
      if (!fields.title?.trim()) {
        throw new ValidationError('Judul sumber wajib diisi')
      }
      data.title = fields.title.trim()
    }

    // One text field in the form, [{ family, given }] in the column.
    if (fields.authorsText !== undefined) {
      data.authors = parseAuthorsInput(fields.authorsText)
    }

    if (fields.publishedYear !== undefined) {
      const year = String(fields.publishedYear ?? '').trim()

      if (year && !/^\d{4}$/.test(year)) {
        throw new ValidationError('Tahun harus 4 angka')
      }
      data.published_year = year || null
    }

    if (fields.sourceType !== undefined) {
      if (!['journal', 'web'].includes(fields.sourceType)) {
        throw new ValidationError('Tipe sumber tidak valid')
      }
      data.source_type = fields.sourceType
    }

    // The rest are free text: a journal name, a volume or a page range is
    // whatever the source prints on it.
    const optional = {
      containerTitle: 'container_title',
      publisher: 'publisher',
      volume: 'volume',
      issue: 'issue',
      pages: 'pages',
      doi: 'doi',
    }

    for (const [field, column] of Object.entries(optional)) {
      if (fields[field] !== undefined) data[column] = fields[field]?.trim() || null
    }

    return prisma.skripsi_citations.update({ where: { id: citation.id }, data })
  }
}
