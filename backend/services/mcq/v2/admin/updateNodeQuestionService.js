import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateNodeQuestionService extends BaseService {
  static async call({ questionId, question, options, correctIndex, explanationShort, explanationLong, references, blobId }) {
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
        explanation_short: explanationShort?.trim() || null,
        explanation_long: explanationLong?.trim() || null,
        references: Array.isArray(references) ? references : [],
        updated_at: new Date(),
      },
    })

    if (blobId !== undefined) {
      const existingAttachment = await prisma.attachments.findFirst({
        where: { record_type: 'mcq_question', record_id: updated.id, name: 'image' },
      })
      const currentBlobId = existingAttachment?.blob_id ?? null
      const newBlobId = blobId ? parseInt(blobId) : null

      // Only touch the attachment when the blob actually changed — detachAll deletes the
      // underlying blob/file, so re-running it with the same blobId every save would delete
      // and then recreate an attachment pointing at a blob that no longer exists.
      if (newBlobId !== currentBlobId) {
        await attachmentService.detachAll({ recordType: 'mcq_question', recordId: updated.id })
        if (newBlobId) {
          await attachmentService.attach({ blobId: newBlobId, recordType: 'mcq_question', recordId: updated.id, name: 'image' })
        }
      }
    }

    const attachment = await attachmentService.getAttachmentWithUrl('mcq_question', updated.id, 'image')
    return { ...updated, imageUrl: attachment?.url ?? null, imageBlobId: attachment?.blob_id ?? null }
  }
}
