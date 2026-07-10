import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class AutoLinkFlashcardDecksService extends BaseService {
  static async call() {
    // Get all flashcard decks with their topic/department tags
    const decks = await prisma.flashcard_decks.findMany({
      where: { is_deleted: false },
      include: {
        flashcard_deck_tags: {
          include: {
            tags: { include: { tag_group: true } },
          },
        },
      },
    })

    // Get all feature_nodes for name matching
    const nodes = await prisma.feature_nodes.findMany()
    const nodesByName = new Map(nodes.map(n => [n.name.toLowerCase(), n]))

    let linked = 0
    let skipped = 0
    let notFound = 0

    for (const deck of decks) {
      const relevantTags = deck.flashcard_deck_tags.filter(dt =>
        ['topic', 'department'].includes(dt.tags?.tag_group?.name)
      )

      for (const dt of relevantTags) {
        const tagName = dt.tags.name.toLowerCase()
        const matchedNode = nodesByName.get(tagName)

        if (!matchedNode) { notFound++; continue }

        const alreadyLinked = await prisma.feature_node_records.findUnique({
          where: {
            node_id_record_type_record_id: {
              node_id: matchedNode.id,
              record_type: 'flashcard_deck',
              record_id: deck.id,
            },
          },
        })

        if (alreadyLinked) { skipped++; continue }

        await prisma.feature_node_records.create({
          data: {
            node_id: matchedNode.id,
            record_type: 'flashcard_deck',
            record_id: deck.id,
          },
        })
        linked++
      }
    }

    return { linked, skipped, notFound }
  }
}
