import { GetUnlinkedDiagnosticCasesService } from '#services/diagnostic/v2/admin/getUnlinkedDiagnosticCasesService'
import { UpdateNodeDiagnosticCaseService } from '#services/diagnostic/v2/admin/updateNodeDiagnosticCaseService'
import { DeleteNodeDiagnosticCaseService } from '#services/diagnostic/v2/admin/deleteNodeDiagnosticCaseService'
import { MoveUnlinkedDiagnosticCaseService } from '#services/diagnostic/v2/admin/moveUnlinkedDiagnosticCaseService'
import { MoveLinkedDiagnosticCaseService } from '#services/diagnostic/v2/admin/moveLinkedDiagnosticCaseService'
import { DiagnosticCaseSerializer } from '#serializers/admin/v2/diagnosticCaseSerializer'

class UnlinkedCasesController {
  async getUnlinked(req, res) {
    const { page = 1, perPage = 20, search = '' } = req.query
    const { cases, pagination } = await GetUnlinkedDiagnosticCasesService.call({ page, perPage, search })
    res.json({ success: true, data: DiagnosticCaseSerializer.serializeList(cases), pagination })
  }

  async updateUnlinked(req, res) {
    const { caseId } = req.params
    const { vignette, imageBlobId, imageCaption, explanation, references, questions } = req.body
    const updated = await UpdateNodeDiagnosticCaseService.call({
      caseId, vignette, imageBlobId, imageCaption, explanation, references, questions,
    })
    res.json({ success: true, data: DiagnosticCaseSerializer.serialize(updated) })
  }

  async deleteUnlinked(req, res) {
    const { caseId } = req.params
    await DeleteNodeDiagnosticCaseService.call({ caseId })
    res.json({ success: true })
  }

  async assignToNode(req, res) {
    const { caseId } = req.params
    const { nodeId } = req.body
    await MoveUnlinkedDiagnosticCaseService.call({ caseId, nodeId })
    res.json({ success: true })
  }

  async moveCase(req, res) {
    const { caseId } = req.params
    const { nodeId } = req.body
    await MoveLinkedDiagnosticCaseService.call({ caseId, nodeId })
    res.json({ success: true })
  }
}

export default new UnlinkedCasesController()
