import { GetUnlinkedDiagnosticQuestionsService } from '#services/diagnostic/v2/admin/getUnlinkedDiagnosticQuestionsService'
import { UpdateNodeDiagnosticQuestionService } from '#services/diagnostic/v2/admin/updateNodeDiagnosticQuestionService'
import { DeleteNodeDiagnosticQuestionService } from '#services/diagnostic/v2/admin/deleteNodeDiagnosticQuestionService'
import { MoveUnlinkedDiagnosticQuestionService } from '#services/diagnostic/v2/admin/moveUnlinkedDiagnosticQuestionService'
import { MoveLinkedDiagnosticQuestionService } from '#services/diagnostic/v2/admin/moveLinkedDiagnosticQuestionService'
import { DiagnosticQuestionsSerializer } from '#serializers/admin/v1/diagnosticQuestionsSerializer'

class DiagnosticQuizController {
  async getUnlinked(req, res) {
    const { page = 1, perPage = 20, search = '' } = req.query
    const { questions, pagination } = await GetUnlinkedDiagnosticQuestionsService.call({ page, perPage, search })
    res.json({ success: true, data: DiagnosticQuestionsSerializer.serializeList(questions), pagination })
  }

  async updateUnlinked(req, res) {
    const { questionId } = req.params
    const { question, vignette, imageBlobId, imageCaption, answer, answerType, choices, explanation } = req.body
    const updated = await UpdateNodeDiagnosticQuestionService.call({
      questionId, question, vignette, imageBlobId, imageCaption, answer, answerType, choices, explanation,
    })
    res.json({ success: true, data: DiagnosticQuestionsSerializer.serialize(updated) })
  }

  async deleteUnlinked(req, res) {
    const { questionId } = req.params
    await DeleteNodeDiagnosticQuestionService.call({ questionId })
    res.json({ success: true })
  }

  async assignToNode(req, res) {
    const { questionId } = req.params
    const { nodeId } = req.body
    await MoveUnlinkedDiagnosticQuestionService.call({ questionId, nodeId })
    res.json({ success: true })
  }

  async moveQuestion(req, res) {
    const { questionId } = req.params
    const { nodeId } = req.body
    await MoveLinkedDiagnosticQuestionService.call({ questionId, nodeId })
    res.json({ success: true })
  }
}

export default new DiagnosticQuizController()
