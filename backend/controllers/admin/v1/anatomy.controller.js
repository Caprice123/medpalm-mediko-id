import { GenerateAnatomyQuestionsService } from '#services/anatomy/admin/generateAnatomyQuestionsService'
import { CreateAnatomyQuizService } from '#services/anatomy/admin/createAnatomyQuizService'
import { GetAnatomyQuizzesService } from '#services/anatomy/admin/getAnatomyQuizzesService'
import { GetAnatomyQuizDetailService } from '#services/anatomy/admin/getAnatomyQuizDetailService'
import { UpdateAnatomyQuizService } from '#services/anatomy/admin/updateAnatomyQuizService'
import { DeleteAnatomyQuizService } from '#services/anatomy/admin/deleteAnatomyQuizService'
import { AnatomyQuizSerializer } from '#serializers/admin/v1/anatomyQuizSerializer'
import { AnatomyQuestionSerializer } from '#serializers/admin/v1/anatomyQuestionSerializer'
import idriveService from '#services/idrive.service'

class AnatomyController {
  async index(req, res) {
    const { university, semester, status, is_active, page, perPage, search } = req.query

    const result = await GetAnatomyQuizzesService.call({
      university,
      semester,
      status,
      is_active,
      page,
      perPage,
      search
    })

    return res.status(200).json({
      data: result.data,
      pagination: result.pagination
    })
  }

  async create(req, res) {
    const {
      title,
      description,
      blobId,
      tags,
      questions,
      status
    } = req.body

    const quiz = await CreateAnatomyQuizService.call({
      title,
      description,
      blobId: blobId ? parseInt(blobId) : null,
      tags,
      questions,
      status: status || 'draft',
      created_by: req.user.id
    })

    return res.status(201).json({
      data: AnatomyQuizSerializer.serialize(quiz),
      message: 'Anatomy quiz created successfully'
    })
  }

  async show(req, res) {
    const { id } = req.params

    const quiz = await GetAnatomyQuizDetailService.call(id)

    return res.status(200).json({
      data: AnatomyQuizSerializer.serialize(quiz)
    })
  }

  async update(req, res) {
    const { id } = req.params
    const {
      title,
      description,
      blobId,
      tags,
      questions,
      status
    } = req.body

    const updatedQuiz = await UpdateAnatomyQuizService.call({
      quizId: id,
      title,
      description,
      blobId: blobId ? parseInt(blobId) : null,
      tags,
      questions,
      status
    })

    return res.status(200).json({
      data: AnatomyQuizSerializer.serialize(updatedQuiz),
    })
  }

  async delete(req, res) {
    const { id } = req.params
    const { hardDelete = false } = req.query

    await DeleteAnatomyQuizService.call(id, hardDelete === 'true')

    return res.status(200).json({
        data: {
            success: true,
        }
    })
  }
  async generateQuestionsFromImage(req, res) {
    const { questionCount = 5 } = req.body

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      })
    }

    // Upload image and create blob using attachmentService
    const attachmentService = (await import('#services/attachment/attachmentService')).default
    const blobService = (await import('#services/attachment/blobService')).default

    // Upload to iDrive
    const uploadResult = await idriveService.uploadAnatomyImage(
      req.file.path,
      req.file.originalname.replace(/\.(jpg|jpeg|png)$/i, '')
    )

    // Create blob record
    const contentType = req.file.mimetype
    const byteSize = blobService.getFileSize(req.file.path)
    const checksum = blobService.calculateChecksum(req.file.path)

    const blob = await blobService.createBlob({
      key: uploadResult.key,
      filename: uploadResult.fileName,
      contentType,
      byteSize,
      checksum,
      metadata: {
        originalName: req.file.originalname,
        uploadedFrom: 'anatomy_quiz_generation'
      }
    })

    // Generate anatomy questions from the uploaded image
    const questions = await GenerateAnatomyQuestionsService.call({
      imageFilePath: req.file.path,
      questionCount: parseInt(questionCount) || 5
    })

    return res.status(200).json({
      data: {
        questions: AnatomyQuestionSerializer.serialize(questions),
        blobId: blob.id
      }
    })
  }

}

export default new AnatomyController()
