import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { bumpNodeStat } from '#utils/nodeStatisticsHelper'
import { bumpContentStat, CONTENT_STAT_KEYS } from '#utils/contentStatsHelper'

const RECORD_TYPE = 'diagnostic_case'

export class MoveUnlinkedDiagnosticCaseService extends BaseService {
  static async call({ caseId, nodeId }) {
    const parsedCaseId = parseInt(caseId)
    const parsedNodeId = parseInt(nodeId)

    const diagnosticCase = await prisma.diagnostic_quizzes.findUnique({ where: { id: parsedCaseId } })
    if (!diagnosticCase || diagnosticCase.is_deleted) throw new ValidationError('Kasus tidak ditemukan')

    const existing = await prisma.feature_node_records.findFirst({
      where: { record_type: RECORD_TYPE, record_id: parsedCaseId },
    })
    if (existing) throw new ValidationError('Kasus sudah tertaut ke sub-topik lain')

    const node = await prisma.feature_nodes.findUnique({ where: { id: parsedNodeId } })
    if (!node) throw new ValidationError('Sub-topik tidak ditemukan')
    if (node.layer !== 2) throw new ValidationError('Kasus hanya dapat dipindah ke sub-topik (layer 2)')

    // A version-1 row reaching here is a legacy V1 quiz being pulled into the node tree
    // for the first time, and V1 never counted its questions towards the landing-page
    // total — so linking it is what adds them. A version-2 case was already counted when
    // it was created, which is why the bump below is scoped to version 1.
    const questionCount = diagnosticCase.version === 1
      ? await prisma.diagnostic_questions.count({ where: { quiz_id: parsedCaseId, is_deleted: false } })
      : 0

    await prisma.$transaction(async (tx) => {
      await tx.feature_node_records.create({
        data: {
          node_id: parsedNodeId,
          record_type: RECORD_TYPE,
          record_id: parsedCaseId,
        },
      })

      await bumpNodeStat(tx, parsedNodeId, RECORD_TYPE, 1)

      if (questionCount > 0) {
        await bumpContentStat(tx, CONTENT_STAT_KEYS.diagnosticQuestion, questionCount)
      }
    })
  }
}
