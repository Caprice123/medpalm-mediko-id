import { CreateSummaryNoteV2Service } from '#services/summaryNotes/v2/admin/createSummaryNoteV2Service'
import { UpdateSummaryNoteV2Service } from '#services/summaryNotes/v2/admin/updateSummaryNoteV2Service'
import { DeleteSummaryNoteV2Service } from '#services/summaryNotes/v2/admin/deleteSummaryNoteV2Service'
import { GetSummaryNotesListService } from '#services/summaryNotes/admin/getSummaryNotesListService'
import { GetSummaryNoteDetailV2AdminService } from '#services/summaryNotes/v2/getSummaryNoteDetailV2AdminService'
import { GenerateSummaryFromDocumentService } from '#services/summaryNotes/admin/generateSummaryFromDocumentService'
import { GetEmbeddingsService } from '#services/embedding/getEmbeddingsService'
import { SummaryNoteV2Serializer } from '#serializers/admin/v2/summaryNoteSerializer'
import { SummaryNoteListV2Serializer } from '#serializers/admin/v2/summaryNoteListSerializer'
import { ValidationError } from '#errors/validationError'

class SummaryNotesV2AdminController {
  async index(req, res) {
    const { page, perPage, status, search, university, semester, department, nodeId, unassigned } = req.query

    const result = await GetSummaryNotesListService.call({
      page: page ? parseInt(page) : 1,
      perPage: perPage ? parseInt(perPage) : 30,
      status,
      search,
      university,
      semester,
      department,
      nodeId,
      unassigned,
    })

    return res.status(200).json({
      data: SummaryNoteListV2Serializer.serialize(result.data),
      pagination: result.pagination,
    })
  }

  async show(req, res) {
    const { uniqueId } = req.params
    const summaryNote = await GetSummaryNoteDetailV2AdminService.call({ id: uniqueId })
    return res.status(200).json({ data: SummaryNoteV2Serializer.serialize(summaryNote) })
  }

  async create(req, res) {
    const { title, description, content, markdownContent, blobId, status, tagIds, nodeId } = req.body

    const summaryNote = await CreateSummaryNoteV2Service.call({
      title,
      description,
      content,
      markdownContent,
      blobId,
      status,
      tagIds,
      createdBy: req.user.id,
      nodeId,
    })

    const detail = await GetSummaryNoteDetailV2AdminService.call({ id: summaryNote.unique_id })
    return res.status(201).json({ data: SummaryNoteV2Serializer.serialize(detail) })
  }

  async update(req, res) {
    const { uniqueId } = req.params
    const { title, description, content, markdownContent, blobId, status, tagIds } = req.body

    await UpdateSummaryNoteV2Service.call({
      id: uniqueId,
      title,
      description,
      content,
      markdownContent,
      blobId,
      status,
      tagIds,
    })

    return res.status(200).json({ data: { success: 'ok' } })
  }

  async destroy(req, res) {
    const { uniqueId } = req.params
    await DeleteSummaryNoteV2Service.call({ id: uniqueId })
    return res.status(200).json({ data: { success: true } })
  }

  async generateFromDocument(req, res) {
    const { blobId } = req.body
    if (!blobId) throw new ValidationError('Blob ID wajib diisi')
    const result = await GenerateSummaryFromDocumentService.call({ blobId })
    return res.status(200).json({ data: result })
  }

  async getEmbeddings(req, res) {
    const { page, perPage } = req.query
    const result = await GetEmbeddingsService.call({
      page: page ? parseInt(page) : 1,
      perPage: perPage ? parseInt(perPage) : 20,
    })
    return res.status(200).json({ data: result.data, pagination: result.pagination })
  }

  async getEmbeddingDetail(req, res) {
    const { id } = req.params
    const embedding = await GetEmbeddingsService.getById(id)
    return res.status(200).json({ data: embedding })
  }
}

export default new SummaryNotesV2AdminController()
