import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'
import { bumpNodeStat } from '#utils/nodeStatisticsHelper'

export class AddNodeCardService extends BaseService {
  static async call({ nodeId, front, back, blobId, references }) {
    if (!front?.trim()) throw new ValidationError('Front wajib diisi')
    if (!back?.trim()) throw new ValidationError('Back wajib diisi')

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Node tidak ditemukan')

    const card = await prisma.flashcard_cards.create({
      data: { front: front.trim(), back: back.trim(), references: Array.isArray(references) ? references : [], version: 2 },
    })

    if (blobId) {
      await attachmentService.attach({ blobId, recordType: 'flashcard_card', recordId: card.id, name: 'image' })
    }

    await prisma.feature_node_records.create({
      data: { node_id: parseInt(nodeId), record_type: 'flashcard_card', record_id: card.id },
    })

    await bumpNodeStat(prisma, parseInt(nodeId), 'flashcard_card', 1)
    if (node.parent_id) {
      await bumpNodeStat(prisma, node.parent_id, 'flashcard_card', 1)
    }

    return card
  }
}
