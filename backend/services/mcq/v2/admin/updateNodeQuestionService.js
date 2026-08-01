import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateNodeQuestionService extends BaseService {
  static async call({ questionId, question, options, correctIndex, explanation, references, blobId }) {
    if (!question?.trim()) throw new ValidationError('Teks pertanyaan wajib diisi')
    if (!Array.isArray(options) || options.length < 2) throw new ValidationError('Minimal 2 pilihan jawaban')
    if (options.some(o => !o?.trim())) throw new ValidationError('Semua pilihan jawaban wajib diisi')

    const existing = await prisma.mcq_questions.findUnique({ where: { id: parseInt(questionId) } })
    if (!existing) throw new ValidationError('Pertanyaan tidak ditemukan')

    const updated = await prisma.mcq_questions.update({
      where: { id: parseInt(questionId) },
      data: {
        question: question.trim(),
        options,
        correct_answer: parseInt(correctIndex) ?? 0,
        explanation: explanation?.trim() || null,
        references: Array.isArray(references) ? references : [],
        updated_at: new Date(),
      },
    })

    if (blobId !== undefined) {
      await attachmentService.detachAll({ recordType: 'mcq_question', recordId: updated.id })
      if (blobId) {
        await attachmentService.attach({ blobId, recordType: 'mcq_question', recordId: updated.id, name: 'image' })
      }
    }

    return updated
  }
}
