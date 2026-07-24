import { RateFlashcardCardService } from '#services/flashcard/v2-1/rate/rateFlashcardCardService'

class RateController {
  async create(req, res) {
    const { recordId, rating } = req.body
    await RateFlashcardCardService.call({
      userId: req.user.id,
      recordId: parseInt(recordId),
      rating,
    })
    return res.status(200).json({ data: { message: 'Rating tersimpan' } })
  }
}

export default new RateController()
