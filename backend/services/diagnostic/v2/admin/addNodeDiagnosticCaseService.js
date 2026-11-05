import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'
import { bumpNodeStat } from '#utils/nodeStatisticsHelper'
import { bumpContentStat, CONTENT_STAT_KEYS } from '#utils/contentStatsHelper'
import { normalizeCaseQuestions } from '#services/diagnostic/v2/admin/diagnosticCaseQuestions'

const RECORD_TYPE = 'diagnostic_case'

export class AddNodeDiagnosticCaseService extends BaseService {
  static async call({ nodeId, vignette, imageBlobId, imageCaption, explanation, references, questions, createdBy }) {
    const questionRows = normalizeCaseQuestions(questions)

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Node tidak ditemukan')

    const newCase = await prisma.$transaction(async (tx) => {
      // A case is a `diagnostic_quizzes` row at version 2: no title and no tags, and the
      // vignette lives in `description` (see the model comment in schema.prisma). It is
      // born published because visibility is the node's job, not the row's.
      const created = await tx.diagnostic_quizzes.create({
        data: {
          title: null,
          description: vignette?.trim() || null,
          image_caption: imageCaption?.trim() || null,
          explanation: explanation?.trim() || null,
          references: Array.isArray(references) ? references : [],
          status: 'published',
          version: 2,
          question_count: questionRows.length,
          created_by: createdBy,
          diagnostic_questions: { create: questionRows },
        },
      })

      await tx.feature_node_records.create({
        data: { node_id: parseInt(nodeId), record_type: RECORD_TYPE, record_id: created.id },
      })

      // The node counter counts cases (one case = one card in a session) and is only
      // kept on the subtopic — topic totals are summed from their subtopics on read.
      // The landing-page counter counts real questions.
      await bumpNodeStat(tx, parseInt(nodeId), RECORD_TYPE, 1)
      await bumpContentStat(tx, CONTENT_STAT_KEYS.diagnosticQuestion, questionRows.length)

      return created
    })

    if (imageBlobId) {
      await attachmentService.attach({
        blobId: parseInt(imageBlobId),
        recordType: RECORD_TYPE,
        recordId: newCase.id,
        name: 'image',
      })
    }

    // The API speaks `vignette`; the column is `description`.
    return { ...newCase, vignette: newCase.description }
  }
}
