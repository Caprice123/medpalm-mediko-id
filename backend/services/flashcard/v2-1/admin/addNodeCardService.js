import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'
import { bumpNodeStat } from '#utils/nodeStatisticsHelper'
import { validateCardTypeFields } from '#utils/flashcardCardTypeValidator'

export class AddNodeCardService extends BaseService {
  static async call({ nodeId, type, front, back, blobId, references, clozeAnswers, occlusionRegions }) {
    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Node tidak ditemukan')

    const cardType = type || 'basic'
    const fields = validateCardTypeFields({ type: cardType, front, back, blobId, clozeAnswers, occlusionRegions })

    const card = await prisma.flashcard_cards.create({
      data: {
        type: cardType,
        front: fields.front,
        back: fields.back,
        cloze_answers: fields.clozeAnswers,
        occlusion_regions: fields.occlusionRegions,
        references: Array.isArray(references) ? references : [],
        version: 2,
      },
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
