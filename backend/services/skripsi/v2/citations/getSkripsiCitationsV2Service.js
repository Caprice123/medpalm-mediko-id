import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { findOwnedSet } from '#services/skripsi/v2/skripsiSetOwnership'
import { CITATION_STYLES, DEFAULT_CITATION_STYLE } from '#services/skripsi/v2/citations/citationFormats'

// Every source kept for one report, in saved order, plus the style the report
// last generated in — the list is numbered against that style, so the caller
// needs both in one read.
export class GetSkripsiCitationsV2Service extends BaseService {
  static async call({ setId, userId }) {
    const set = await findOwnedSet(setId, userId)

    const citations = await prisma.skripsi_citations.findMany({
      where: { set_id: set.id },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
    })

    const style = CITATION_STYLES.includes(set.citation_style)
      ? set.citation_style
      : DEFAULT_CITATION_STYLE

    return { citations, style }
  }
}
