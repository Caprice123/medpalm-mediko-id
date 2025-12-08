import { GenerateAnatomyQuestionsService } from '../../../services/anatomy/admin/generateAnatomyQuestionsService.js'
import { CreateAnatomyQuizService } from '../../../services/anatomy/admin/createAnatomyQuizService.js'
import { GetAnatomyQuizzesService } from '../../../services/anatomy/admin/getAnatomyQuizzesService.js'
import { GetAnatomyQuizDetailService } from '../../../services/anatomy/admin/getAnatomyQuizDetailService.js'
import { UpdateAnatomyQuizService } from '../../../services/anatomy/admin/updateAnatomyQuizService.js'
import { DeleteAnatomyQuizService } from '../../../services/anatomy/admin/deleteAnatomyQuizService.js'
import { AnatomyQuizSerializer } from '../../../serializers/admin/v1/anatomyQuizSerializer.js'
import { AnatomyQuestionSerializer } from '../../../serializers/admin/v1/anatomyQuestionSerializer.js'
import idriveService from '../../../services/idrive.service.js'

class AnatomyController {
  /**
   * Upload anatomy image only (without generating questions)
   * POST /admin/v1/anatomy/upload-image
   */
  async uploadImage(req, res) {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      })
    }

    // Upload image to iDrive E2 cloud storage
    const uploadResult = await idriveService.uploadAnatomyImage(
      req.file.path,
      req.file.originalname.replace(/\.(jpg|jpeg|png)$/i, '')
    )

    return res.status(200).json({
      success: true,
      data: {
        image_url: await idriveService.getSignedUrl(uploadResult.key),
        image_key: uploadResult.key,
        image_filename: uploadResult.fileName
      }
    })
  }

  /**
   * Generate anatomy questions from uploaded image (preview mode)
   * POST /admin/v1/anatomy/generate-from-image
   */
  async generateQuestionsFromImage(req, res) {
    const { questionCount = 5 } = req.body

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      })
    }

    // Upload image to iDrive E2 cloud storage
    const uploadResult = await idriveService.uploadAnatomyImage(
      req.file.path,
      req.file.originalname.replace(/\.(jpg|jpeg|png)$/i, '')
    )

    // Generate anatomy questions from the uploaded image
    const questions = await GenerateAnatomyQuestionsService.call({
      imageFilePath: req.file.path,
      questionCount: parseInt(questionCount) || 5
    })

    return res.status(200).json({
      success: true,
      data: {
        questions: AnatomyQuestionSerializer.serialize(questions),
        image_url: uploadResult.url,
        image_key: uploadResult.key,
        image_filename: uploadResult.fileName
      }
    })
  }

  /**
   * Create anatomy quiz
   * POST /admin/v1/anatomy/quizzes
   */
  async create(req, res) {
    const {
      title,
      description,
      image_url,
      image_key,
      image_filename,
      tags,
      questions,
      status
    } = req.body

    const quiz = await CreateAnatomyQuizService.call({
      title,
      description,
      image_url,
      image_key,
      image_filename,
      tags,
      questions,
      status: status || 'draft',
      created_by: req.user.id
    })

    return res.status(201).json({
      success: true,
      data: AnatomyQuizSerializer.serialize(quiz),
      message: 'Anatomy quiz created successfully'
    })
  }

  /**
   * Get all anatomy quizzes with optional filters and pagination
   * GET /admin/v1/anatomy/quizzes
   */
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
      success: true,
      data: result.data,
      pagination: result.pagination
    })
  }

  /**
   * Get single anatomy quiz detail with questions
   * GET /admin/v1/anatomy/quizzes/:id
   */
  async show(req, res) {
    const { id } = req.params

    const quiz = await GetAnatomyQuizDetailService.call(id)

    return res.status(200).json({
      success: true,
      data: AnatomyQuizSerializer.serialize(quiz)
    })
  }

  /**
   * Update anatomy quiz
   * PUT /admin/v1/anatomy/quizzes/:id
   */
  async update(req, res) {
    const { id } = req.params
    const {
      title,
      description,
      image_url,
      image_key,
      image_filename,
      tags,
      questions,
      status
    } = req.body

    const updatedQuiz = await UpdateAnatomyQuizService.call({
      quizId: id,
      title,
      description,
      image_url,
      image_key,
      image_filename,
      tags,
      questions,
      status
    })

    return res.status(200).json({
      success: true,
      data: AnatomyQuizSerializer.serialize(updatedQuiz),
      message: 'Anatomy quiz updated successfully'
    })
  }

  /**
   * Delete anatomy quiz (soft delete by default)
   * DELETE /admin/v1/anatomy/quizzes/:id
   */
  async delete(req, res) {
    const { id } = req.params
    const { hardDelete = false } = req.query

    const result = await DeleteAnatomyQuizService.call(id, hardDelete === 'true')

    return res.status(200).json({
      success: true,
      message: `Anatomy quiz ${result.deleted === 'permanently' ? 'permanently deleted' : 'deactivated'} successfully`
    })
  }
}

export default new AnatomyController()
