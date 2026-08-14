import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

export class GetNodeQuestionDetailService extends BaseService {
  static async call({ questionId }) {
    const question = await prisma.mcq_questions.findUnique({ where: { id: parseInt(questionId) } })
    if (!question) throw new ValidationError('Pertanyaan tidak ditemukan')

    const attachment = await attachmentService.getAttachmentWithUrl('mcq_question', question.id, 'image')

    const noteRelations = await prisma.content_relations.findMany({
      where: { source_type: 'mcq_question', source_id: question.id, target_type: 'summary_note' },
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
      ...question,
      imageUrl: attachment?.url ?? null,
      imageBlobId: attachment?.blob_id ?? null,
      linkedSummaryNotes,
    }
  }
}
