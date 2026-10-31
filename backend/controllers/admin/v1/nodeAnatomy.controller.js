import { GetNodeAnatomyQuizzesService } from '#services/anatomy/v2/admin/getNodeAnatomyQuizzesService'
import { UnlinkNodeAnatomyQuizService } from '#services/anatomy/v2/admin/unlinkNodeAnatomyQuizService'
import { MoveNodeAnatomyQuizService } from '#services/anatomy/v2/admin/moveNodeAnatomyQuizService'
import { SwapNodeAnatomyQuizOrderService } from '#services/anatomy/v2/admin/swapNodeAnatomyQuizOrderService'
// v2 serializer — see the note in nodeAtlas.controller.js. Carries `version` and
// `embedUrl`, which the V2 module detail page reads and the v1 serializer omits.
import { AnatomyQuizListSerializer } from '#serializers/admin/v2/anatomyQuizListSerializer'

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

  async swapOrder(req, res) {
    const { nodeId, quizId } = req.params
    const { withQuizId } = req.body
    await SwapNodeAnatomyQuizOrderService.call({ nodeId, quizId, withQuizId })
    return res.status(200).json({ data: { success: true } })
  }
}

export default new NodeAnatomyController()
