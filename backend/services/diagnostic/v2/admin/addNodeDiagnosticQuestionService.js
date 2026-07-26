import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

const RECORD_TYPE = 'diagnostic_question'

export class AddNodeDiagnosticQuestionService extends BaseService {
  static async call({ nodeId, question, vignette, imageBlobId, imageCaption, answer, answerType = 'multiple_choice', choices, explanation }) {
    if (!question?.trim()) throw new ValidationError('Pertanyaan wajib diisi')
    if (!answer?.trim()) throw new ValidationError('Jawaban wajib diisi')
    if (answerType === 'multiple_choice' && (!choices || !Array.isArray(choices) || choices.length < 2)) {
      throw new ValidationError('Pilihan jawaban minimal 2 opsi')
    }

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Node tidak ditemukan')

    const newQuestion = await prisma.diagnostic_questions.create({
      data: {
        question: question.trim(),
        vignette: vignette?.trim() || null,
        image_caption: imageCaption?.trim() || null,
        explanation: explanation?.trim() || null,
        answer: answer.trim(),
        answer_type: answerType,
        choices: answerType === 'multiple_choice' ? choices : null,
        quiz_id: null,
      },
    })

    if (imageBlobId) {
      await attachmentService.attach({
        blobId: imageBlobId,
        recordType: RECORD_TYPE,
        recordId: newQuestion.id,
        name: 'image',
      })
    }

    await prisma.feature_node_records.create({
      data: { node_id: parseInt(nodeId), record_type: RECORD_TYPE, record_id: newQuestion.id },
    })

    await prisma.node_statistics.upsert({
      where: { node_id_record_type: { node_id: parseInt(nodeId), record_type: RECORD_TYPE } },
      create: { node_id: parseInt(nodeId), record_type: RECORD_TYPE, total_count: 1 },
      update: { total_count: { increment: 1 } },
    })

    return newQuestion
  }
}
