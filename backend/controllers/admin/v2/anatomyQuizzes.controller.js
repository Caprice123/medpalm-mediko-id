import { GetUnlinkedAnatomyQuizzesService } from '#services/anatomy/v2/admin/getUnlinkedAnatomyQuizzesService'
import { UpdateAnatomyQuizV2Service } from '#services/anatomy/v2/admin/updateAnatomyQuizService'
import { DeleteAnatomyQuizV2Service } from '#services/anatomy/v2/admin/deleteAnatomyQuizService'
import { AssignAnatomyToNodeService } from '#services/anatomy/v2/admin/assignAnatomyToNodeService'
import { AnatomyQuizListSerializer } from '#serializers/admin/v2/anatomyQuizListSerializer'

class AnatomyQuizzesController {
  async getUnlinked(req, res) {
    const { page = 1, perPage = 20, search = '' } = req.query
    const result = await GetUnlinkedAnatomyQuizzesService.call({ page, perPage, search })
    return res.status(200).json({
      data: AnatomyQuizListSerializer.serialize(result.data, result.attachmentMap),
      pagination: result.pagination,
    })
  }

  async updateUnlinked(req, res) {
    const { uniqueId } = req.params
    const { title, description, embedUrl, questionCount, tags, status } = req.body
    const quiz = await UpdateAnatomyQuizV2Service.call({
      quizId: uniqueId,
      title,
      description,
      embedUrl: embedUrl || null,
      questionCount: questionCount !== undefined ? parseInt(questionCount) : undefined,
      tags,
      status,
    })
    const [serialized] = AnatomyQuizListSerializer.serialize([quiz], new Map())
    return res.status(200).json({ data: serialized })
  }

  async deleteUnlinked(req, res) {
    const { uniqueId } = req.params
    await DeleteAnatomyQuizV2Service.call(uniqueId)
    return res.status(200).json({ data: { success: true } })
  }

  async assignToNode(req, res) {
    const { uniqueId } = req.params
    const { nodeId } = req.body
    await AssignAnatomyToNodeService.call({ uniqueId, nodeId })
    return res.status(200).json({ data: { success: true } })
  }
}

export default new AnatomyQuizzesController()
