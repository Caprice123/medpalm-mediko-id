import { GetSummaryNotesByNodeService } from '#services/summaryNotes/v2/getSummaryNotesByNodeService'
import { GetSummaryNoteDetailV2Service } from '#services/summaryNotes/v2/getSummaryNoteDetailV2Service'
import { SummaryNoteListV2Serializer } from '#serializers/api/v2/summaryNoteListV2Serializer'
import { SummaryNoteV2Serializer } from '#serializers/api/v2/summaryNoteV2Serializer'

class SummaryNotesV2Controller {
  async index(req, res) {
    const { nodeId, search, page, perPage } = req.query
    const result = await GetSummaryNotesByNodeService.call({
      nodeId, search, page, perPage, userRole: req.user.role
    })
    return res.json({
      data: SummaryNoteListV2Serializer.serialize(result.data),
      pagination: result.pagination
    })
  }

  async show(req, res) {
    const { id } = req.params
    const note = await GetSummaryNoteDetailV2Service.call({
      noteId: id,
      userId: req.user.id,
      userRole: req.user.role
    })
    return res.json({ data: SummaryNoteV2Serializer.serialize(note) })
  }
}

export default new SummaryNotesV2Controller()
