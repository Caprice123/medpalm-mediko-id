import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

const RECORD_TYPE = 'diagnostic_question'

export class GetNodeDiagnosticQuestionDetailService extends BaseService {
  static async call({ questionId }) {
    const question = await prisma.diagnostic_questions.findUnique({ where: { id: parseInt(questionId) } })
    if (!question) throw new ValidationError('Pertanyaan tidak ditemukan')

    const attachment = await attachmentService.getAttachmentWithUrl(RECORD_TYPE, question.id, 'image')

    const noteRelations = await prisma.content_relations.findMany({
      where: { source_type: RECORD_TYPE, source_id: question.id, target_type: 'summary_note' },
    })
    const noteIds = noteRelations.map(r => r.target_id)
    const notes = noteIds.length > 0
      ? await prisma.summary_notes.findMany({ where: { id: { in: noteIds } }, select: { id: true, unique_id: true, title: true } })
      : []
    const noteMap = new Map(notes.map(n => [n.id, n]))
    const linkedSummaryNotes = noteRelations
      .map(r => {
        const note = noteMap.get(r.target_id)
        if (!note) return null
        return { uniqueId: note.unique_id, title: r.label || note.title }
      })
      .filter(Boolean)

    return {
      id: question.id,
      question: question.question,
      vignette: question.vignette,
      imageCaption: question.image_caption,
      answer: question.answer,
      answerType: question.answer_type,
      choices: question.choices,
      explanationShort: question.explanation_short ?? '',
      explanationLong: question.explanation_long ?? '',
      references: question.references ?? [],
      imageUrl: attachment?.url ?? null,
      imageBlobId: attachment?.blob_id ?? null,
      linkedSummaryNotes,
    }
  }
}
