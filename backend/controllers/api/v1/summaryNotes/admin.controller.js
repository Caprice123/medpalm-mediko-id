import { CreateSummaryNoteService } from '../../../../services/summaryNotes/admin/createSummaryNoteService.js'
import { UpdateSummaryNoteService } from '../../../../services/summaryNotes/admin/updateSummaryNoteService.js'
import { GetSummaryNotesListService } from '../../../../services/summaryNotes/admin/getSummaryNotesListService.js'
import { GetSummaryNoteDetailService } from '../../../../services/summaryNotes/admin/getSummaryNoteDetailService.js'
import { DeleteSummaryNoteService } from '../../../../services/summaryNotes/admin/deleteSummaryNoteService.js'
import { GenerateSummaryFromDocumentService } from '../../../../services/summaryNotes/admin/generateSummaryFromDocumentService.js'

class SummaryNotesAdminController {
  // List all summary notes (with pagination)
  async index(req, res) {
    const { page, perPage, status, search, university, semester } = req.query

    const result = await GetSummaryNotesListService.call({
      page: page ? parseInt(page) : 1,
      perPage: perPage ? parseInt(perPage) : 30,
      status,
      search,
      university,
      semester
    })

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })
  }

  // Get single summary note detail
  async show(req, res) {
    const { id } = req.params

    const summaryNote = await GetSummaryNoteDetailService.call({ id })

    return res.status(200).json({
      success: true,
      data: summaryNote
    })
  }

  // Create new summary note
  async create(req, res) {
    const { title, description, content, sourceType, sourceUrl, sourceKey, sourceFilename, status, tagIds } = req.body
    const createdBy = req.user.id

    const summaryNote = await CreateSummaryNoteService.call({
      title,
      description,
      content,
      sourceType,
      sourceUrl,
      sourceKey,
      sourceFilename,
      status,
      tagIds,
      createdBy
    })

    return res.status(201).json({
      success: true,
      data: summaryNote,
      message: 'Summary note created successfully'
    })
  }

  // Update summary note
  async update(req, res) {
    const { id } = req.params
    const { title, description, content, sourceType, sourceUrl, sourceKey, sourceFilename, status, isActive, tagIds } = req.body

    const summaryNote = await UpdateSummaryNoteService.call({
      id,
      title,
      description,
      content,
      sourceType,
      sourceUrl,
      sourceKey,
      sourceFilename,
      status,
      isActive,
      tagIds
    })

    return res.status(200).json({
      success: true,
      data: summaryNote,
      message: 'Summary note updated successfully'
    })
  }

  // Delete summary note
  async destroy(req, res) {
    const { id } = req.params

    await DeleteSummaryNoteService.call({ id })

    return res.status(200).json({
      success: true,
      message: 'Summary note deleted successfully'
    })
  }

  // Generate summary from uploaded document
  async generateFromDocument(req, res) {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    const result = await GenerateSummaryFromDocumentService.call({
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      filename: req.file.originalname
    })

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Summary generated successfully'
    })
  }
}

export default new SummaryNotesAdminController()
