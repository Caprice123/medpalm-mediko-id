import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

const RECORD_TYPE = 'diagnostic_question'

export class UpdateNodeDiagnosticQuestionService extends BaseService {
  static async call({ questionId, question, vignette, imageBlobId, imageCaption, answer, answerType, choices, explanationShort, explanationLong, references }) {
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
        explanation_short: explanationShort?.trim() || null,
        explanation_long: explanationLong?.trim() || null,
        references: Array.isArray(references) ? references : [],
        answer: answer.trim(),
        answer_type: answerType ?? existing.answer_type,
        choices: (answerType ?? existing.answer_type) === 'multiple_choice' ? choices : null,
        updated_at: new Date(),
      },
    })

    if (imageBlobId !== undefined) {
      const existingAttachment = await prisma.attachments.findFirst({
        where: { record_type: RECORD_TYPE, record_id: updated.id, name: 'image' },
      })
      const currentBlobId = existingAttachment?.blob_id ?? null
      const newBlobId = imageBlobId ? parseInt(imageBlobId) : null

      // Only touch the attachment when the blob actually changed — detachAll deletes the
      // underlying blob/file, so re-running it with the same blobId every save would delete
      // and then recreate an attachment pointing at a blob that no longer exists.
      if (newBlobId !== currentBlobId) {
        await attachmentService.detachAll({ recordType: RECORD_TYPE, recordId: updated.id })
        if (newBlobId) {
          await attachmentService.attach({ blobId: newBlobId, recordType: RECORD_TYPE, recordId: updated.id, name: 'image' })
        }
      }
    }

    const attachment = await attachmentService.getAttachmentWithUrl(RECORD_TYPE, updated.id, 'image')
    return { ...updated, imageUrl: attachment?.url ?? null, imageBlobId: attachment?.blob_id ?? null }
  }
}
