import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { findOwnedSet } from '#services/skripsi/v2/skripsiSetOwnership'
import { resolveCitationMetadata } from '#services/skripsi/v2/citations/citationMetadata'

const MAX_CITATIONS = 200

// "Simpan ke referensi" on a Searcher result. The metadata lookup happens here,
// once, rather than when the daftar pustaka is generated: a student saves a
// source and walks away, and waiting on Crossref at generate time would make
// the one click that must feel instant the slowest in the feature.
//
// The same URL saved twice is the same source: the row is refreshed rather than
// duplicated, so a re-save is also how a student retries a lookup that found
// nothing the first time.
export class CreateSkripsiCitationV2Service extends BaseService {
  static async call({ setId, userId, title, url, date = null }) {
    const cleanUrl = url?.trim()
    const cleanTitle = title?.trim()

    if (!cleanUrl) {
      throw new ValidationError('URL sumber wajib diisi')
    }

    if (!cleanTitle) {
      throw new ValidationError('Judul sumber wajib diisi')
    }

    const set = await findOwnedSet(setId, userId)

    const existing = await prisma.skripsi_citations.findFirst({
      where: { set_id: set.id, url: cleanUrl },
    })

    if (!existing) {
      const kept = await prisma.skripsi_citations.count({ where: { set_id: set.id } })
      if (kept >= MAX_CITATIONS) {
        throw new ValidationError(`Referensi tersimpan maksimal ${MAX_CITATIONS}. Hapus salah satu dulu.`)
      }
    }

    const metadata = await resolveCitationMetadata({ title: cleanTitle, url: cleanUrl, date })

    const data = {
      title: metadata.title || cleanTitle,
      source_type: metadata.sourceType,
      authors: metadata.authors ?? [],
      container_title: metadata.containerTitle,
      publisher: metadata.publisher,
      volume: metadata.volume,
      issue: metadata.issue,
      pages: metadata.pages,
      doi: metadata.doi,
      pmid: metadata.pmid,
      published_year: metadata.publishedYear,
      published_date: metadata.publishedDate,
      updated_at: new Date(),
    }

    if (existing) {
      return prisma.skripsi_citations.update({ where: { id: existing.id }, data })
    }

    // Saved order is the Vancouver/IEEE numbering, so a new source goes last.
    const last = await prisma.skripsi_citations.findFirst({
      where: { set_id: set.id },
      orderBy: { position: 'desc' },
      select: { position: true },
    })

    return prisma.skripsi_citations.create({
      data: {
        ...data,
        set_id: set.id,
        url: cleanUrl,
        position: (last?.position ?? -1) + 1,
        accessed_at: new Date(),
      },
    })
  }
}
