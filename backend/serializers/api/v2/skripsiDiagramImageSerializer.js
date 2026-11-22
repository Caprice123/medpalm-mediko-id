import { toJakartaISO } from '#utils/dateUtils'

// A generated diagram picture. `imageUrl` is signed and expires within the
// hour, so it is for showing; `blobId` is what the document embeds, through
// /api/v1/blobs/:id, which never expires.
export class SkripsiDiagramImageV2Serializer {
  static serializeOne(diagram) {
    return {
      id: diagram.id,
      description: diagram.description ?? '',
      imageUrl: diagram.imageUrl ?? null,
      blobId: diagram.blobId ?? null,
      createdAt: toJakartaISO(diagram.created_at),
    }
  }

  static serialize(diagrams) {
    return (diagrams || []).map(diagram => this.serializeOne(diagram))
  }
}
