import { GetFlashcardTopicsService } from '#services/flashcard/v2-1/getFlashcardTopicsService'

class TopicsController {
  async index(req, res) {
    const topics = await GetFlashcardTopicsService.call()
    return res.status(200).json({
      data: topics.map(t => ({
        id: t.id,
        name: t.name,
        classification: t.classification,
        cardCount: t.cardCount,
      })),
    })
  }
}

export default new TopicsController()
