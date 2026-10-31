import { CreateAnatomyQuizV2Service } from '#services/anatomy/v2/admin/createAnatomyQuizService'
import { GetAnatomyQuizDetailService } from '#services/anatomy/admin/getAnatomyQuizDetailService'
import { UpdateAnatomyQuizV2Service } from '#services/anatomy/v2/admin/updateAnatomyQuizService'
import { DeleteAnatomyQuizV2Service } from '#services/anatomy/v2/admin/deleteAnatomyQuizService'
import { AnatomyQuizSerializer } from '#serializers/admin/v1/anatomyQuizSerializer'

class QuizzesController {
  async create(req, res) {
    const { title, description, embedUrl, questionCount, tags, status, nodeId } = req.body

    const quiz = await CreateAnatomyQuizV2Service.call({
      nodeId,
      title,
      description,
      embedUrl,
      questionCount,
      tags,
      status,
      createdBy: req.user.id,
    })

    return res.status(201).json({ data: AnatomyQuizSerializer.serialize(quiz) })
  }

  async show(req, res) {
    const { uniqueId } = req.params
    const quiz = await GetAnatomyQuizDetailService.call(uniqueId)
    return res.status(200).json({ data: AnatomyQuizSerializer.serialize(quiz) })
  }

  async update(req, res) {
    const { uniqueId } = req.params
    const { title, description, embedUrl, questionCount, tags, status } = req.body

    const updatedQuiz = await UpdateAnatomyQuizV2Service.call({
      quizId: uniqueId,
      title,
      description,
      embedUrl: embedUrl || null,
      questionCount: questionCount !== undefined ? parseInt(questionCount) : undefined,
      tags,
      status,
    })

    return res.status(200).json({ data: AnatomyQuizSerializer.serialize(updatedQuiz) })
  }

  async destroy(req, res) {
    const { uniqueId } = req.params
    await DeleteAnatomyQuizV2Service.call(uniqueId)
    return res.status(200).json({ data: { success: true } })
  }
}

export default new QuizzesController()
