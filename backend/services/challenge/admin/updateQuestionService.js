import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateQuestionService {
  static async call({ uniqueId, question, options, correctOptionIndex, explanation, order, isSpecial, questionImageBlobId, optionImageBlobIds }) {
    const q = await prisma.challenge_questions.findUnique({ where: { unique_id: uniqueId } })
    if (!q) throw new ValidationError('Question not found')

    const newOptions = options !== undefined ? options : q.options
    const newCorrect = correctOptionIndex != null ? parseInt(correctOptionIndex) : q.correct_option_index

    if (options !== undefined && (!Array.isArray(options) || options.length < 2)) {
      throw new ValidationError('At least 2 options are required')
    }
    if (newCorrect < 0 || newCorrect >= newOptions.length) {
      throw new ValidationError('Invalid correct option index')
    }

    const updated = await prisma.challenge_questions.update({
      where: { unique_id: uniqueId },
      data: {
        question: question !== undefined ? (question || null) : q.question,
        options: newOptions,
        correct_option_index: newCorrect,
        explanation: explanation !== undefined ? explanation : q.explanation,
        order: order != null ? parseInt(order) : q.order,
        is_special: isSpecial !== undefined ? Boolean(isSpecial) : q.is_special,
        updated_at: new Date(),
      },
    })

    if (questionImageBlobId) {
      const existing = await attachmentService.getAttachments('challenge_question', q.id, 'question_image')
      for (const att of existing) await attachmentService.deleteAttachment(att.id)
      await attachmentService.attach({
        blobId: parseInt(questionImageBlobId),
        recordType: 'challenge_question',
        recordId: q.id,
        name: 'question_image',
      })
    }

    if (Array.isArray(optionImageBlobIds)) {
      for (let i = 0; i < optionImageBlobIds.length; i++) {
        if (optionImageBlobIds[i]) {
          const existing = await attachmentService.getAttachments('challenge_question', q.id, `option_image_${i}`)
          for (const att of existing) await attachmentService.deleteAttachment(att.id)
          await attachmentService.attach({
            blobId: parseInt(optionImageBlobIds[i]),
            recordType: 'challenge_question',
            recordId: q.id,
            name: `option_image_${i}`,
          })
        }
      }
    }

    return updated
  }
}
