import { GenerateDiagnosticQuestionsService } from '#services/diagnostic/admin/generateDiagnosticQuestionsService'
import { CreateDiagnosticQuizService } from '#services/diagnostic/admin/createDiagnosticQuizService'
import { GetDiagnosticQuizzesService } from '#services/diagnostic/admin/getDiagnosticQuizzesService'
import { GetDiagnosticQuizDetailService } from '#services/diagnostic/admin/getDiagnosticQuizDetailService'
import { UpdateDiagnosticQuizService } from '#services/diagnostic/admin/updateDiagnosticQuizService'
import { DeleteDiagnosticQuizService } from '#services/diagnostic/admin/deleteDiagnosticQuizService'
import { DiagnosticQuizSerializer } from '#serializers/admin/v1/diagnosticQuizSerializer'
import { DiagnosticQuizListSerializer } from '#serializers/admin/v1/diagnosticQuizListSerializer'
import { DiagnosticQuestionSerializer } from '#serializers/admin/v1/diagnosticQuestionSerializer'
import idriveService from '#services/idrive.service'
import { ValidationError } from '#errors/validationError'

class DiagnosticController {
  async index(req, res) {
    const { university, semester, status, mediaType, page, perPage, search } = req.query

    const result = await GetDiagnosticQuizzesService.call({
      university,
      semester,
      status,
      mediaType,
      page,
      perPage,
      search
    })

    return res.status(200).json({
      data: DiagnosticQuizListSerializer.serialize(result.data, result.attachmentMap),
      pagination: result.pagination
    })
  }

  async create(req, res) {
    const {
      title,
      description,
      blobId,
      embedUrl,
      questionCount,
      tags,
      questions,
      status
    } = req.body

    const quiz = await CreateDiagnosticQuizService.call({
      title,
      description,
      blobId: blobId ? parseInt(blobId) : null,
      embedUrl: embedUrl || null,
      questionCount: questionCount !== undefined ? parseInt(questionCount) : undefined,
      mediaType: embedUrl ? '3d' : '2d',
      tags,
      questions,
      status: status || 'draft',
      createdBy: req.user.id
    })

    return res.status(201).json({
      data: DiagnosticQuizSerializer.serialize(quiz),
    })
  }

  async show(req, res) {
    const { uniqueId } = req.params

    const quiz = await GetDiagnosticQuizDetailService.call(uniqueId)

    return res.status(200).json({
      data: DiagnosticQuizSerializer.serialize(quiz)
    })
  }

  async update(req, res) {
    const { uniqueId } = req.params
    const {
      title,
      description,
      blobId,
      embedUrl,
      questionCount,
      tags,
      questions,
      status
    } = req.body

    const updatedQuiz = await UpdateDiagnosticQuizService.call({
      quizId: uniqueId,
      title,
      description,
      blobId: blobId ? parseInt(blobId) : null,
      embedUrl: embedUrl || null,
      questionCount: questionCount !== undefined ? parseInt(questionCount) : undefined,
      mediaType: embedUrl ? '3d' : '2d',
      tags,
      questions,
      status
    })

    return res.status(200).json({
      data: DiagnosticQuizSerializer.serialize(updatedQuiz),
    })
  }

  async delete(req, res) {
    const { uniqueId } = req.params
    const { hardDelete = false } = req.query

    await DeleteDiagnosticQuizService.call(uniqueId, hardDelete === 'true')

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
        throw new ValidationError("Image file is required")
    }

    // Upload image and create blob using attachmentService
    const attachmentService = (await import('#services/attachment/attachmentService')).default
    const blobService = (await import('#services/attachment/blobService')).default

    // Upload to iDrive
    const uploadResult = await idriveService.uploadDiagnosticImage(
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
        uploadedFrom: 'diagnostic_quiz_generation'
      }
    })

    // Generate diagnostic questions from the uploaded image
    const questions = await GenerateDiagnosticQuestionsService.call({
      imageFilePath: req.file.path,
      questionCount: parseInt(questionCount) || 5
    })

    return res.status(200).json({
      data: {
        questions: DiagnosticQuestionSerializer.serialize(questions),
        blobId: blob.id
      }
    })
  }

}

export default new DiagnosticController()
