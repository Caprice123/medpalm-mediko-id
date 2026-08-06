import { GetFlashcardSubtopicsService } from '#services/flashcard/v2-1/getFlashcardSubtopicsService'

class SubtopicsController {
  async index(req, res) {
    const { topicId } = req.params
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null
    const limit  = req.query.limit  ? parseInt(req.query.limit)  : 50
    const { subtopics, nextCursor } = await GetFlashcardSubtopicsService.call({ topicId, cursor, limit })
    return res.status(200).json({
      data: {
        subtopics: subtopics.map(s => ({
          id: s.id,
          name: s.name,
          cardCount: s.cardCount,
        })),
        nextCursor,
      },
    })
  }
}

export default new SubtopicsController()
