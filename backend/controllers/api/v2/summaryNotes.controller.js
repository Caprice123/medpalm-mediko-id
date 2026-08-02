import { GetSummaryNotesByNodeService } from '#services/summaryNotes/v2/getSummaryNotesByNodeService'
import { GetSummaryNoteDetailV2Service } from '#services/summaryNotes/v2/getSummaryNoteDetailV2Service'
import { GetSummaryNoteContentRelationsService } from '#services/summaryNotes/v2/getSummaryNoteContentRelationsService'
import { GetSummaryNoteTopicsService } from '#services/summaryNotes/v2/getSummaryNoteTopicsService'
import { GetSummaryNoteSubtopicsService } from '#services/summaryNotes/v2/getSummaryNoteSubtopicsService'
import { SummaryNoteListV2Serializer } from '#serializers/api/v2/summaryNoteListV2Serializer'
import { SummaryNoteV2Serializer } from '#serializers/api/v2/summaryNoteV2Serializer'
import { FlashcardDeckListSerializer } from '#serializers/api/v1/flashcardDeckListSerializer'
import { McqTopicListSerializer } from '#serializers/api/v1/mcqTopicListSerializer'

class SummaryNotesV2Controller {
  async getTopics(req, res) {
    const { classification } = req.query
    const topics = await GetSummaryNoteTopicsService.call({ classification })
    return res.json({ data: topics })
  }

  async getSubtopics(req, res) {
    const { topicId } = req.params
    const subtopics = await GetSummaryNoteSubtopicsService.call({ topicId })
    return res.json({ data: subtopics })
  }

  async index(req, res) {
    const { nodeId, search, page, perPage } = req.query
    const result = await GetSummaryNotesByNodeService.call({ nodeId, search, page, perPage })
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

  async contentRelations(req, res) {
    const { id } = req.params
    const { targetType, page = 1, perPage = 6 } = req.query
    const result = await GetSummaryNoteContentRelationsService.call({
      uniqueId: id,
      targetType,
      page: parseInt(page),
      perPage: parseInt(perPage)
    })
    const data = targetType === 'flashcard_deck'
      ? FlashcardDeckListSerializer.serialize(result.data)
      : McqTopicListSerializer.serialize(result.data)
    return res.json({ data, pagination: result.pagination })
  }
}

export default new SummaryNotesV2Controller()
