import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

const RECORD_TYPE = 'diagnostic_question'

export class UpdateNodeDiagnosticQuestionService extends BaseService {
  static async call({ questionId, question, vignette, imageBlobId, imageCaption, answer, answerType, choices, explanation }) {
    if (!question?.trim()) throw new ValidationError('Pertanyaan wajib diisi')
    if (!answer?.trim()) throw new ValidationError('Jawaban wajib diisi')
    if (answerType === 'multiple_choice' && (!choices || !Array.isArray(choices) || choices.length < 2)) {
      throw new ValidationError('Pilihan jawaban minimal 2 opsi')
    }

    const existing = await prisma.diagnostic_questions.findUnique({ where: { id: parseInt(questionId) } })
    if (!existing) throw new ValidationError('Pertanyaan tidak ditemukan')

    const updated = await prisma.diagnostic_questions.update({
      where: { id: parseInt(questionId) },
      data: {
        question: question.trim(),
        vignette: vignette?.trim() || null,
        image_caption: imageCaption?.trim() || null,
        explanation: explanation?.trim() || null,
        answer: answer.trim(),
        answer_type: answerType ?? existing.answer_type,
        choices: (answerType ?? existing.answer_type) === 'multiple_choice' ? choices : null,
        updated_at: new Date(),
      },
    })

    if (imageBlobId !== undefined) {
      await attachmentService.detachAll({ recordType: RECORD_TYPE, recordId: parseInt(questionId) })
      if (imageBlobId) {
        await attachmentService.attach({
          blobId: imageBlobId,
          recordType: RECORD_TYPE,
          recordId: parseInt(questionId),
          name: 'image',
        })
      }
    }

    return updated
  }
}
