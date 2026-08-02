import { GetUnlinkedQuestionsService } from '#services/mcq/v2/admin/getUnlinkedQuestionsService'
import { UpdateNodeQuestionService } from '#services/mcq/v2/admin/updateNodeQuestionService'
import { DeleteUnlinkedQuestionService } from '#services/mcq/v2/admin/deleteUnlinkedQuestionService'
import { AssignQuestionToNodeService } from '#services/mcq/v2/admin/assignQuestionToNodeService'
import { NodeQuestionsSerializer } from '#serializers/admin/v1/nodeQuestionsSerializer'

class UnlinkedQuestionsController {
  async getUnlinked(req, res) {
    const { page = 1, perPage = 20, search = '' } = req.query
    const { questions, pagination } = await GetUnlinkedQuestionsService.call({ page, perPage, search })
    return res.status(200).json({ data: NodeQuestionsSerializer.serializeList(questions), pagination })
  }

  async updateUnlinked(req, res) {
    const { questionId } = req.params
    const { question, options, correctIndex, explanation, blobId } = req.body
    const updated = await UpdateNodeQuestionService.call({ questionId, question, options, correctIndex, explanation, blobId })
    return res.status(200).json({ data: NodeQuestionsSerializer.serialize(updated) })
  }

  async deleteUnlinked(req, res) {
    const { questionId } = req.params
    await DeleteUnlinkedQuestionService.call({ questionId })
    return res.status(200).json({ data: { success: true } })
  }

  async assignToNode(req, res) {
    const { questionId } = req.params
    const { nodeId } = req.body
    await AssignQuestionToNodeService.call({ questionId, nodeId })
    return res.status(200).json({ data: { success: true } })
  }
}

export default new UnlinkedQuestionsController()
