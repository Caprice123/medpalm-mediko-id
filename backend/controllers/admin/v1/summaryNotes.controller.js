import { CreateSummaryNoteService } from '#services/summaryNotes/admin/createSummaryNoteService'
import { UpdateSummaryNoteService } from '#services/summaryNotes/admin/updateSummaryNoteService'
import { GetSummaryNotesListService } from '#services/summaryNotes/admin/getSummaryNotesListService'
import { GetSummaryNoteDetailService } from '#services/summaryNotes/admin/getSummaryNoteDetailService'
import { DeleteSummaryNoteService } from '#services/summaryNotes/admin/deleteSummaryNoteService'
import { GenerateSummaryFromDocumentService } from '#services/summaryNotes/admin/generateSummaryFromDocumentService'
import { GetEmbeddingsService } from '#services/embedding/getEmbeddingsService'
import { SummaryNoteSerializer } from '#serializers/admin/v1/summaryNoteSerializer'
import { SummaryNoteListSerializer } from '#serializers/admin/v1/summaryNoteListSerializer'
import { ValidationError } from '#errors/validationError'

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
      data: SummaryNoteListSerializer.serialize(result.data),
      pagination: result.pagination
    })
  }

  // Get single summary note detail
  async show(req, res) {
    const { id } = req.params

    const summaryNote = await GetSummaryNoteDetailService.call({ id })

    return res.status(200).json({
      data: SummaryNoteSerializer.serialize(summaryNote)
    })
  }

  // Create new summary note
  async create(req, res) {
    const { title, description, content, markdownContent, blobId, status, tagIds, flashcardDeckIds, mcqTopicIds } = req.body
    const createdBy = req.user.id

    const summaryNote = await CreateSummaryNoteService.call({
      title,
      description,
      content,
      markdownContent,
      blobId,
      status,
      tagIds,
      flashcardDeckIds,
      mcqTopicIds,
      createdBy
    })

    return res.status(201).json({
      data: SummaryNoteSerializer.serialize(summaryNote),
    })
  }

  // Update summary note
  async update(req, res) {
    const { id } = req.params
    const { title, description, content, markdownContent, blobId, status, isActive, tagIds, flashcardDeckIds, mcqTopicIds } = req.body

    console.log(flashcardDeckIds)
    const summaryNote = await UpdateSummaryNoteService.call({
      id,
      title,
      description,
      content,
      markdownContent,
      blobId,
      status,
      isActive,
      tagIds,
      flashcardDeckIds,
      mcqTopicIds
    })

    return res.status(200).json({
      data: SummaryNoteSerializer.serialize(summaryNote),
    })
  }

  // Delete summary note
  async destroy(req, res) {
    const { id } = req.params

    await DeleteSummaryNoteService.call({ id })

    return res.status(200).json({
      data: {
        success: true
      }
    })
  }

  // Generate summary from uploaded document (using blobId)
  async generateFromDocument(req, res) {
    const { blobId } = req.body

    if (!blobId) {
        throw new ValidationError("Blob id dibutuhkan")
    }

    const result = await GenerateSummaryFromDocumentService.call({ blobId })

    return res.status(200).json({
      data: result,
    })
  }

  // Get ChromaDB embeddings
  async getEmbeddings(req, res) {
    const { page, perPage } = req.query

    const result = await GetEmbeddingsService.call({
      page: page ? parseInt(page) : 1,
      perPage: perPage ? parseInt(perPage) : 20
    })

    return res.status(200).json({
      data: result.data,
      pagination: result.pagination
    })
  }

  // Get specific embedding document
  async getEmbeddingDetail(req, res) {
    const { id } = req.params

    const embedding = await GetEmbeddingsService.getById(id)

    return res.status(200).json({
      data: embedding
    })
  }
}

export default new SummaryNotesAdminController()
