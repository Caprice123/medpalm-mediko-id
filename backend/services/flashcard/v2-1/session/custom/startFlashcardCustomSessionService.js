import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import idriveService from '#services/idrive.service'

export class StartFlashcardCustomSessionService extends BaseService {
  static async call({ userId, nodeIds, count }) {
    if (!nodeIds?.length) throw new ValidationError('Pilih minimal satu sub-topik')

    const parsedIds = nodeIds.map(id => parseInt(id))

    const allRefs = await prisma.feature_node_records.findMany({
      where: { node_id: { in: parsedIds }, record_type: 'flashcard_card' },
      select: { record_id: true, node_id: true },
    })

    if (allRefs.length === 0) return []

    const cardToNodeMap = new Map(allRefs.map(r => [r.record_id, r.node_id]))
    const cardIds = allRefs.map(r => r.record_id)

    const seenLogs = await prisma.user_learned_items.findMany({
      where: { user_id: userId, item_type: 'flashcard_card', item_id: { in: cardIds } },
      select: { item_id: true },
    })
    const seenIdSet = new Set(seenLogs.map(l => l.item_id))

    const newIds  = cardIds.filter(id => !seenIdSet.has(id))
    const seenIds = cardIds.filter(id =>  seenIdSet.has(id))

    const limit = Math.min(parseInt(count) || cardIds.length, cardIds.length)
    const selected = [
      ...newIds.sort(() => Math.random() - 0.5),
      ...seenIds.sort(() => Math.random() - 0.5),
    ].slice(0, limit)

    const newIdSet = new Set(newIds)

    const [cards, nodes] = await Promise.all([
      prisma.flashcard_cards.findMany({ where: { id: { in: selected } } }),
      prisma.feature_nodes.findMany({
        where: { id: { in: parsedIds } },
        select: { id: true, name: true, parent: { select: { id: true, name: true } } },
      }),
    ])

    const cardMap = new Map(cards.map(c => [c.id, c]))
    const nodeMap = new Map(nodes.map(n => [n.id, n]))
    const orderedCards = selected.map(id => cardMap.get(id)).filter(Boolean)

    const attachments = await prisma.attachments.findMany({
      where: { record_type: 'flashcard_card', record_id: { in: selected }, name: 'image' },
    })

    const blobIds = attachments.map(a => a.blob_id)
    const blobs = blobIds.length > 0
      ? await prisma.blobs.findMany({ where: { id: { in: blobIds } } })
      : []

    const attachmentMap = new Map(attachments.map(a => [a.record_id, a]))
    const blobMap       = new Map(blobs.map(b => [b.id, b]))

    const blobKeys = []
    const cardBlobKeyMap = new Map()
    orderedCards.forEach(card => {
      const att = attachmentMap.get(card.id)
      if (att) {
        const blob = blobMap.get(att.blob_id)
        if (blob) { blobKeys.push(blob.key); cardBlobKeyMap.set(card.id, blob.key) }
      }
    })

    const presignedUrls = blobKeys.length > 0
      ? await idriveService.getBulkSignedUrls(blobKeys, 3600)
      : []

    const urlMap = new Map()
    let idx = 0
    orderedCards.forEach(card => { if (cardBlobKeyMap.has(card.id)) urlMap.set(card.id, presignedUrls[idx++]) })

    return orderedCards.map(card => {
      const nId = cardToNodeMap.get(card.id)
      const node = nId ? nodeMap.get(nId) : null
      return {
        id: card.id,
        front: card.front,
        back: card.back,
        type: card.type ?? 'basic',
        clozeAnswers: card.cloze_answers ?? [],
        occlusionRegions: card.occlusion_regions ?? [],
        references: card.references ?? [],
        imageUrl: urlMap.get(card.id) || null,
        isNew: newIdSet.has(card.id),
        subtopic: node ? { id: node.id, name: node.name } : null,
        topic: node?.parent ? { id: node.parent.id, name: node.parent.name } : null,
      }
    })
  }
}
