import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import idriveService from '#services/idrive.service'
import attachmentService from '#services/attachment/attachmentService'

export class GetFlashcardDeckDetailV2Service extends BaseService {
  static async call(uniqueId) {
    if (!uniqueId) throw new ValidationError('Deck unique ID wajib diisi')

    const deck = await prisma.flashcard_decks.findUnique({
      where: { unique_id: uniqueId },
      include: {
        flashcard_cards: { orderBy: { order: 'asc' } },
      },
    })

    if (!deck || deck.is_deleted) throw new ValidationError('Deck tidak ditemukan')

    const nodeRecords = await prisma.feature_node_records.findMany({
      where: { record_type: 'flashcard_deck', record_id: deck.id },
      include: { node: { include: { parent: true } } },
    })

    const cardIds = deck.flashcard_cards.map(c => c.id)
    const attachments = cardIds.length > 0
      ? await prisma.attachments.findMany({
          where: { record_type: 'flashcard_card', record_id: { in: cardIds }, name: 'image' },
        })
      : []

    const blobIds = attachments.map(a => a.blob_id)
    const blobs = blobIds.length > 0
      ? await prisma.blobs.findMany({ where: { id: { in: blobIds } } })
      : []

    const attachmentMap = new Map(attachments.map(a => [a.record_id, a]))
    const blobMap = new Map(blobs.map(b => [b.id, b]))

    const blobKeys = []
    const cardBlobKeyMap = new Map()
    deck.flashcard_cards.forEach(card => {
      const att = attachmentMap.get(card.id)
      if (att) {
        const blob = blobMap.get(att.blob_id)
        if (blob) {
          blobKeys.push(blob.key)
          cardBlobKeyMap.set(card.id, blob.key)
        }
      }
    })

    const presignedUrls = blobKeys.length > 0
      ? await idriveService.getBulkSignedUrls(blobKeys, 3600)
      : []

    const urlMap = new Map()
    let urlIndex = 0
    deck.flashcard_cards.forEach(card => {
      if (cardBlobKeyMap.has(card.id)) urlMap.set(card.id, presignedUrls[urlIndex++])
    })

    const cards = deck.flashcard_cards.map(card => {
      const att = attachmentMap.get(card.id)
      const blob = att ? blobMap.get(att.blob_id) : null
      return {
        ...card,
        image_url: urlMap.get(card.id) || null,
        image: blob ? { id: blob.id, key: blob.key, filename: blob.filename, attachmentId: att.id } : null,
      }
    })

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]]
    }

    const rawRelations = await prisma.content_relations.findMany({
      where: { source_type: 'flashcard_deck', source_id: deck.id },
      orderBy: { order: 'asc' },
    })

    const mcqIds = rawRelations.filter(r => r.target_type === 'mcq_topic').map(r => r.target_id)
    const snIds = rawRelations.filter(r => r.target_type === 'summary_note').map(r => r.target_id)

    const [mcqTopics, summaryNotes] = await Promise.all([
      mcqIds.length
        ? prisma.mcq_topics.findMany({
            where: { id: { in: mcqIds }, status: 'published', is_deleted: false },
            select: { id: true, unique_id: true, title: true },
          })
        : Promise.resolve([]),
      snIds.length
        ? prisma.summary_notes.findMany({
            where: { id: { in: snIds }, status: 'published', is_deleted: false },
            select: { id: true, unique_id: true, title: true },
          })
        : Promise.resolve([]),
    ])

    const relatedContent = [
      ...mcqTopics.map(t => ({ type: 'mcq_topic', id: t.id, uniqueId: t.unique_id, title: t.title })),
      ...summaryNotes.map(n => ({ type: 'summary_note', id: n.id, uniqueId: n.unique_id, title: n.title })),
    ]

    const sourcePdf = await attachmentService.getAttachmentWithUrl('flashcard_deck', deck.id, 'source_pdf')

    return { ...deck, flashcard_cards: cards, nodeRecords, relatedContent, sourcePdf }
  }
}
