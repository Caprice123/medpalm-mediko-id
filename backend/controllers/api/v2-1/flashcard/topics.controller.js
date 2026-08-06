import { GetFlashcardTopicsService } from '#services/flashcard/v2-1/getFlashcardTopicsService'

class TopicsController {
  async index(req, res) {
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null
    const limit  = req.query.limit  ? parseInt(req.query.limit)  : 50
    const { topics, nextCursor } = await GetFlashcardTopicsService.call({ cursor, limit })
    return res.status(200).json({
      data: {
        topics: topics.map(t => ({
          id: t.id,
          name: t.name,
          classification: t.classification,
          cardCount: t.cardCount,
        })),
        nextCursor,
      },
    })
  }
}

export default new TopicsController()
