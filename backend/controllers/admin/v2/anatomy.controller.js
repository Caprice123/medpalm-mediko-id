import prisma from '#prisma/client'
import { ValidationError } from '#errors/validationError'
import { CreateAnatomyQuizService } from '#services/anatomy/admin/createAnatomyQuizService'
import { GetAnatomyQuizzesService } from '#services/anatomy/admin/getAnatomyQuizzesService'
import { GetAnatomyQuizDetailService } from '#services/anatomy/admin/getAnatomyQuizDetailService'
import { UpdateAnatomyQuizV2Service } from '#services/anatomy/v2/admin/updateAnatomyQuizService'
import { DeleteAnatomyQuizV2Service } from '#services/anatomy/v2/admin/deleteAnatomyQuizService'
import { AnatomyQuizSerializer } from '#serializers/admin/v1/anatomyQuizSerializer'
import { AnatomyQuizListSerializer } from '#serializers/admin/v1/anatomyQuizListSerializer'

const RECORD_TYPE = 'anatomy_quiz'

class AnatomyV2Controller {
  async index(req, res) {
    const { university, semester, status, mediaType, page, perPage, search } = req.query

    const result = await GetAnatomyQuizzesService.call({
      university,
      semester,
      status,
      mediaType,
      page,
      perPage,
      search,
    })

    return res.status(200).json({
      data: AnatomyQuizListSerializer.serialize(result.data, result.attachmentMap),
      pagination: result.pagination,
    })
  }

  async create(req, res) {
    const { title, description, blobId, embedUrl, questionCount, tags, questions, status, nodeId } = req.body

    if (!nodeId) throw new ValidationError('Node ID wajib diisi')

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Node tidak ditemukan')

    const quiz = await CreateAnatomyQuizService.call({
      title,
      description,
      embedUrl: embedUrl || null,
      questionCount: questionCount !== undefined ? parseInt(questionCount) : undefined,
      mediaType: '3d',
      tags,
      status: status || 'published',
      version: 2,
      createdBy: req.user.id,
    })

    await prisma.feature_node_records.create({
      data: { node_id: parseInt(nodeId), record_type: RECORD_TYPE, record_id: quiz.id },
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

  async delete(req, res) {
    const { uniqueId } = req.params
    const { hardDelete = false } = req.query
    await DeleteAnatomyQuizV2Service.call(uniqueId)
    return res.status(200).json({ data: { success: true } })
  }
}

export default new AnatomyV2Controller()
