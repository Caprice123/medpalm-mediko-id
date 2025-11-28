import { GetFlashcardDecksService } from '../../../services/flashcard/getFlashcardDecksService.js'
import { StartFlashcardDeckService } from '../../../services/flashcard/startFlashcardDeckService.js'
import { SubmitFlashcardProgressService } from '../../../services/flashcard/submitFlashcardProgressService.js'

class FlashcardController {
  async getDecks(req, res) {
    const { university, semester } = req.query

    const decks = await GetFlashcardDecksService.call({ university, semester })

    return res.status(200).json({
      success: true,
      data: decks
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
      success: true,
      data: result,
      message: 'Flashcard deck started successfully'
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
      success: true,
      data: result,
      message: 'Flashcard progress submitted successfully'
    })
  }
}

export default new FlashcardController()
