import { GetNodeDiagnosticCasesService } from '#services/diagnostic/v2/admin/getNodeDiagnosticCasesService'
import { GetNodeDiagnosticCaseDetailService } from '#services/diagnostic/v2/admin/getNodeDiagnosticCaseDetailService'
import { AddNodeDiagnosticCaseService } from '#services/diagnostic/v2/admin/addNodeDiagnosticCaseService'
import { UpdateNodeDiagnosticCaseService } from '#services/diagnostic/v2/admin/updateNodeDiagnosticCaseService'
import { DeleteNodeDiagnosticCaseService } from '#services/diagnostic/v2/admin/deleteNodeDiagnosticCaseService'
import { DiagnosticCaseSerializer } from '#serializers/admin/v2/diagnosticCaseSerializer'

class CasesController {
  async index(req, res) {
    const { nodeId } = req.params
    const { page, perPage, search } = req.query
    const { cases, pagination } = await GetNodeDiagnosticCasesService.call({ nodeId, page, perPage, search })
    res.json({ success: true, cases: DiagnosticCaseSerializer.serializeList(cases), pagination })
  }

  async show(req, res) {
    const { caseId } = req.params
    const diagnosticCase = await GetNodeDiagnosticCaseDetailService.call({ caseId })
    res.json({ success: true, data: DiagnosticCaseSerializer.serialize(diagnosticCase) })
  }

  async create(req, res) {
    const { nodeId } = req.params
    const { vignette, imageBlobId, imageCaption, explanation, references, questions } = req.body
    const newCase = await AddNodeDiagnosticCaseService.call({
      nodeId, vignette, imageBlobId, imageCaption, explanation, references, questions,
      createdBy: req.user.id,
    })
    res.status(201).json({ success: true, data: DiagnosticCaseSerializer.serialize(newCase) })
  }

  async update(req, res) {
    const { caseId } = req.params
    const { vignette, imageBlobId, imageCaption, explanation, references, questions } = req.body
    const updated = await UpdateNodeDiagnosticCaseService.call({
      caseId, vignette, imageBlobId, imageCaption, explanation, references, questions,
    })
    res.json({ success: true, data: DiagnosticCaseSerializer.serialize(updated) })
  }

  async destroy(req, res) {
    const { caseId } = req.params
    await DeleteNodeDiagnosticCaseService.call({ caseId })
    res.json({ success: true })
  }
}

export default new CasesController()
