import { GetFlashcardSubtopicsService } from '#services/flashcard/v2-1/getFlashcardSubtopicsService'

class SubtopicsController {
  async index(req, res) {
    const { topicId } = req.params
    const subtopics = await GetFlashcardSubtopicsService.call({ topicId })
    return res.status(200).json({
      data: subtopics.map(s => ({
        id: s.id,
        name: s.name,
        cardCount: s.cardCount,
      })),
    })
  }
}

export default new SubtopicsController()
