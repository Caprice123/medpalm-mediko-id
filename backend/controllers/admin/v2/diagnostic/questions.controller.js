import { GetNodeDiagnosticQuestionsService } from '#services/diagnostic/v2/admin/getNodeDiagnosticQuestionsService'
import { AddNodeDiagnosticQuestionService } from '#services/diagnostic/v2/admin/addNodeDiagnosticQuestionService'
import { UpdateNodeDiagnosticQuestionService } from '#services/diagnostic/v2/admin/updateNodeDiagnosticQuestionService'
import { DeleteNodeDiagnosticQuestionService } from '#services/diagnostic/v2/admin/deleteNodeDiagnosticQuestionService'

class QuestionsController {
  async index(req, res) {
    const { nodeId } = req.params
    const { page, perPage, search } = req.query
    const result = await GetNodeDiagnosticQuestionsService.call({ nodeId, page, perPage, search })
    res.json({ success: true, ...result })
  }

  async create(req, res) {
    const { nodeId } = req.params
    const { question, vignette, imageBlobId, imageCaption, answer, answerType, choices, explanation } = req.body
    const newQ = await AddNodeDiagnosticQuestionService.call({
      nodeId, question, vignette, imageBlobId, imageCaption, answer, answerType, choices, explanation,
    })
    res.status(201).json({ success: true, data: newQ })
  }

  async update(req, res) {
    const { questionId } = req.params
    const { question, vignette, imageBlobId, imageCaption, answer, answerType, choices, explanation } = req.body
    const updated = await UpdateNodeDiagnosticQuestionService.call({
      questionId, question, vignette, imageBlobId, imageCaption, answer, answerType, choices, explanation,
    })
    res.json({ success: true, data: updated })
  }

  async destroy(req, res) {
    const { questionId } = req.params
    await DeleteNodeDiagnosticQuestionService.call({ questionId })
    res.json({ success: true })
  }
}

export default new QuestionsController()
