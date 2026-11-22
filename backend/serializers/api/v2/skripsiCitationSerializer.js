import { toJakartaISO } from '#utils/dateUtils'
import { authorsToText } from '#services/skripsi/v2/citations/citationAuthors'
import { formatEntryText, formatMarker, sortForStyle } from '#services/skripsi/v2/citations/citationFormats'

// One kept source. The row's own fields are sent so the edit form can show
// them, plus two things only the server can work out: how the entry reads in
// the chosen style, and the marker to paste into a paragraph. Formatting stays
// on this side so the list, the generated section and the clipboard can never
// drift apart.
//
// `sourceType` is what tells the UI whether this entry is a journal article
// (filled in by Crossref/PubMed) or a web source the student may need to
// complete by hand.
export class SkripsiCitationV2Serializer {
  // The citation as the formatters read it.
  static toCitation(record) {
    return {
      id: record.id,
      position: record.position,
      sourceType: record.source_type,
      title: record.title,
      url: record.url,
      authors: Array.isArray(record.authors) ? record.authors : [],
      containerTitle: record.container_title ?? null,
      publisher: record.publisher ?? null,
      volume: record.volume ?? null,
      issue: record.issue ?? null,
      pages: record.pages ?? null,
      doi: record.doi ?? null,
      pmid: record.pmid ?? null,
      publishedYear: record.published_year ?? null,
      publishedDate: record.published_date ?? null,
      accessedAt: record.accessed_at,
    }
  }

  static serializeOne(record, { style, number } = {}) {
    const citation = this.toCitation(record)

    return {
      ...citation,
      authorsText: authorsToText(citation.authors),
      accessedAt: toJakartaISO(record.accessed_at),
      createdAt: toJakartaISO(record.created_at),
      updatedAt: toJakartaISO(record.updated_at),
      // Absent when no style was asked for — a write that returns one row has
      // no list to number it against.
      number: number ?? null,
      preview: style ? formatEntryText(citation, style) : null,
      marker: style && number ? formatMarker(citation, number, style) : null,
    }
  }

  /**
   * The whole list, numbered the way the chosen style orders it — so the "3"
   * in the panel is the same "3" the generated daftar pustaka prints.
   */
  static serialize(records, style) {
    const citations = (records || []).map(record => this.toCitation(record))
    const order = sortForStyle(citations, style).map(citation => citation.id)

    return (records || []).map(record => this.serializeOne(record, {
      style,
      number: order.indexOf(record.id) + 1,
    }))
  }
}
