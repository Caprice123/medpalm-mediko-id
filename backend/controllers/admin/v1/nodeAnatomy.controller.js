import { GetNodeAnatomyQuizzesService } from '#services/featureNodes/admin/getNodeAnatomyQuizzesService'
import { UnlinkNodeAnatomyQuizService } from '#services/featureNodes/admin/unlinkNodeAnatomyQuizService'
import { MoveNodeAnatomyQuizService } from '#services/featureNodes/admin/moveNodeAnatomyQuizService'
import { AnatomyQuizListSerializer } from '#serializers/admin/v1/anatomyQuizListSerializer'

class NodeAnatomyController {
  async index(req, res) {
    const { nodeId } = req.params
    const { page, perPage } = req.query
    const result = await GetNodeAnatomyQuizzesService.call({ nodeId, page, perPage })
    return res.status(200).json({
      data: AnatomyQuizListSerializer.serialize(result.data, result.attachmentMap),
      pagination: result.pagination,
    })
  }

  async destroy(req, res) {
    const { nodeId, quizId } = req.params
    await UnlinkNodeAnatomyQuizService.call({ nodeId, quizId })
    return res.status(200).json({ data: { success: true } })
  }

  async move(req, res) {
    const { nodeId, quizId } = req.params
    const { targetNodeId } = req.body
    await MoveNodeAnatomyQuizService.call({ nodeId, quizId, targetNodeId })
    return res.status(200).json({ data: { success: true } })
  }
}

export default new NodeAnatomyController()
