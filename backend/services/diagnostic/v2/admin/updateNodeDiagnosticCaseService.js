import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'
import { bumpContentStat, CONTENT_STAT_KEYS } from '#utils/contentStatsHelper'
import { normalizeCaseQuestions } from '#services/diagnostic/v2/admin/diagnosticCaseQuestions'

const RECORD_TYPE = 'diagnostic_case'

export class UpdateNodeDiagnosticCaseService extends BaseService {
  static async call({ caseId, vignette, imageBlobId, imageCaption, explanation, references, questions }) {
    const questionRows = normalizeCaseQuestions(questions)

    const existing = await prisma.diagnostic_cases.findUnique({ where: { id: parseInt(caseId) } })
    if (!existing || existing.is_deleted) throw new ValidationError('Kasus tidak ditemukan')

    // Review state lives on the case, not on its questions, so the question set can be
    // replaced wholesale without touching anyone's SRS progress: rows the admin kept are
    // updated in place, rows they dropped are soft-deleted, new rows are created.
    const currentQuestions = await prisma.diagnostic_questions.findMany({
      where: { case_id: parseInt(caseId), is_deleted: false },
      select: { id: true },
    })
    const currentIds = new Set(currentQuestions.map(q => q.id))
    const keptIds = new Set(
      questions.map(q => parseInt(q.id)).filter(id => Number.isInteger(id) && currentIds.has(id))
    )
    const removedIds = [...currentIds].filter(id => !keptIds.has(id))

    await prisma.$transaction(async (tx) => {
      await tx.diagnostic_cases.update({
        where: { id: parseInt(caseId) },
        data: {
          vignette: vignette?.trim() || null,
          image_caption: imageCaption?.trim() || null,
          explanation: explanation?.trim() || null,
          references: Array.isArray(references) ? references : [],
          updated_at: new Date(),
        },
      })

      let created = 0
      for (const [i, row] of questionRows.entries()) {
        const rawId = parseInt(questions[i]?.id)
        if (Number.isInteger(rawId) && keptIds.has(rawId)) {
          await tx.diagnostic_questions.update({
            where: { id: rawId },
            data: { ...row, updated_at: new Date() },
          })
        } else {
          await tx.diagnostic_questions.create({ data: { ...row, case_id: parseInt(caseId) } })
          created++
        }
      }

      if (removedIds.length > 0) {
        await tx.diagnostic_questions.updateMany({
          where: { id: { in: removedIds } },
          data: { is_deleted: true, deleted_at: new Date() },
        })
        // Summary-note links are per question, so a dropped question takes its links with it
        await tx.content_relations.deleteMany({
          where: { source_type: 'diagnostic_question', source_id: { in: removedIds } },
        })
      }

      const delta = created - removedIds.length
      if (delta !== 0) await bumpContentStat(tx, CONTENT_STAT_KEYS.diagnosticQuestion, delta)
    })

    if (imageBlobId !== undefined) {
      const existingAttachment = await prisma.attachments.findFirst({
        where: { record_type: RECORD_TYPE, record_id: parseInt(caseId), name: 'image' },
      })
      const currentBlobId = existingAttachment?.blob_id ?? null
      const newBlobId = imageBlobId ? parseInt(imageBlobId) : null

      // Only touch the attachment when the blob actually changed — detachAll deletes the
      // underlying blob/file, so re-running it with the same blobId every save would delete
      // and then recreate an attachment pointing at a blob that no longer exists.
      if (newBlobId !== currentBlobId) {
        await attachmentService.detachAll({ recordType: RECORD_TYPE, recordId: parseInt(caseId) })
        if (newBlobId) {
          await attachmentService.attach({ blobId: newBlobId, recordType: RECORD_TYPE, recordId: parseInt(caseId), name: 'image' })
        }
      }
    }

    const updated = await prisma.diagnostic_cases.findUnique({ where: { id: parseInt(caseId) } })
    const attachment = await attachmentService.getAttachmentWithUrl(RECORD_TYPE, parseInt(caseId), 'image')
    return { ...updated, imageUrl: attachment?.url ?? null, imageBlobId: attachment?.blob_id ?? null }
  }
}
