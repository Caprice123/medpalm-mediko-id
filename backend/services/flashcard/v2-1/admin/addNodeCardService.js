import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

export class AddNodeCardService extends BaseService {
  static async call({ nodeId, front, back, blobId }) {
    if (!front?.trim()) throw new ValidationError('Front wajib diisi')
    if (!back?.trim()) throw new ValidationError('Back wajib diisi')

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Node tidak ditemukan')

    const card = await prisma.flashcard_cards.create({
      data: { node_id: parseInt(nodeId), front: front.trim(), back: back.trim() },
    })

    if (blobId) {
      await attachmentService.attach({ blobId, recordType: 'flashcard_card', recordId: card.id, name: 'image' })
    }

    await prisma.node_statistics.upsert({
      where: { node_id_record_type: { node_id: parseInt(nodeId), record_type: 'flashcard_card' } },
      create: { node_id: parseInt(nodeId), record_type: 'flashcard_card', total_count: 1 },
      update: { total_count: { increment: 1 } },
    })

    return card
  }
}
