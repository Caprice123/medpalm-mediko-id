import { GetFlashcardDecksService } from '#services/flashcard/getFlashcardDecksService'
import { StartFlashcardDeckService } from '#services/flashcard/startFlashcardDeckService'
import { SubmitFlashcardProgressService } from '#services/flashcard/submitFlashcardProgressService'
import { FlashcardDeckListSerializer } from '#serializers/admin/v1/flashcardDeckListSerializer'

class FlashcardController {
  async getDecks(req, res) {
    const { university, semester, page, perPage } = req.query

    const result = await GetFlashcardDecksService.call({ university, semester, status: "published", page, perPage })

    return res.status(200).json({
      data: FlashcardDeckListSerializer.serialize(result.decks),
      pagination: result.pagination
    })
  }

  async startDeck(req, res) {
    const { deckId } = req.body
    const userId = req.user.id

    const result = await StartFlashcardDeckService.call({
      flashcardDeckId: deckId,
      userId
    })

    return res.status(200).json({
      data: result,
    })
  }

  async submitProgress(req, res) {
    const { deckId, answers } = req.body
    const userId = req.user.id

    const result = await SubmitFlashcardProgressService.call({
      deckId,
      userId,
      answers
    })

    return res.status(200).json({
      data: result,
    })
  }
}

export default new FlashcardController()
