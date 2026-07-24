import { toJakartaISO } from '#utils/dateUtils'

export class NodeCardsSerializer {
  static serialize(card) {
    return {
      id: card.id,
      nodeId: card.node_id,
      front: card.front,
      back: card.back,
      imageUrl: card.imageUrl ?? null,
      imageBlobId: card.imageBlobId ?? null,
      createdAt: toJakartaISO(card.created_at),
      updatedAt: toJakartaISO(card.updated_at),
    }
  }

  static serializeList(cards) {
    return cards.map(this.serialize.bind(this))
  }
}
