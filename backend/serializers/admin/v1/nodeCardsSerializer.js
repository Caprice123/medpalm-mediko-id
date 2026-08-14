import { toJakartaISO } from '#utils/dateUtils'

export class NodeCardsSerializer {
  static serialize(card) {
    return {
      id: card.id,
      nodeId: card.node_id,
      front: card.front,
      back: card.back,
      type: card.type ?? 'basic',
      clozeAnswers: card.cloze_answers ?? [],
      occlusionRegions: card.occlusion_regions ?? [],
      explanationShort: card.explanation_short ?? '',
      explanationLong: card.explanation_long ?? '',
      references: card.references ?? [],
      version: card.version ?? 1,
      imageUrl: card.imageUrl ?? null,
      imageBlobId: card.imageBlobId ?? null,
      linkedSummaryNotes: card.linkedSummaryNotes ?? [],
      createdAt: toJakartaISO(card.created_at),
      updatedAt: toJakartaISO(card.updated_at),
    }
  }

  // Lightweight shape for the card list table — only what the columns actually render.
  static serializeListItem(card) {
    return {
      id: card.id,
      type: card.type ?? 'basic',
      front: card.front,
      back: card.back,
      occlusionRegions: card.occlusion_regions ?? [],
    }
  }

  static serializeList(cards) {
    return cards.map(this.serializeListItem.bind(this))
  }
}
