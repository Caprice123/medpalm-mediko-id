import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

const RECORD_TYPE = 'diagnostic_case'

export class GetNodeDiagnosticCaseDetailService extends BaseService {
  static async call({ caseId }) {
    const diagnosticCase = await prisma.diagnostic_cases.findUnique({
      where: { id: parseInt(caseId) },
      include: {
        diagnostic_questions: {
          where: { is_deleted: false },
          orderBy: { order: 'asc' },
        },
      },
    })
    if (!diagnosticCase || diagnosticCase.is_deleted) throw new ValidationError('Kasus tidak ditemukan')

    const attachment = await attachmentService.getAttachmentWithUrl(RECORD_TYPE, diagnosticCase.id, 'image')

    const questionIds = diagnosticCase.diagnostic_questions.map(q => q.id)
    const noteRelations = questionIds.length > 0
      ? await prisma.content_relations.findMany({
          where: { source_type: 'diagnostic_question', source_id: { in: questionIds }, target_type: 'summary_note' },
        })
      : []
    const noteIds = [...new Set(noteRelations.map(r => r.target_id))]
    const notes = noteIds.length > 0
      ? await prisma.summary_notes.findMany({ where: { id: { in: noteIds } }, select: { id: true, unique_id: true, title: true } })
      : []
    const noteMap = new Map(notes.map(n => [n.id, n]))
    const notesByQuestion = new Map()
    for (const relation of noteRelations) {
      const note = noteMap.get(relation.target_id)
      if (!note) continue
      if (!notesByQuestion.has(relation.source_id)) notesByQuestion.set(relation.source_id, [])
      notesByQuestion.get(relation.source_id).push({ uniqueId: note.unique_id, title: relation.label || note.title })
    }

    return {
      id: diagnosticCase.id,
      vignette: diagnosticCase.vignette,
      imageCaption: diagnosticCase.image_caption,
      explanation: diagnosticCase.explanation ?? '',
      references: diagnosticCase.references ?? [],
      imageUrl: attachment?.url ?? null,
      imageBlobId: attachment?.blob_id ?? null,
      questions: diagnosticCase.diagnostic_questions.map(q => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        answerType: q.answer_type,
        choices: q.choices,
        explanationShort: q.explanation_short ?? '',
        explanationLong: q.explanation_long ?? '',
        references: q.references ?? [],
        linkedSummaryNotes: notesByQuestion.get(q.id) || [],
      })),
    }
  }
}
