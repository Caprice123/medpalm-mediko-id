import { GetFlashcardDecksV2Service } from '#services/flashcard/v2/getFlashcardDecksV2Service'
import { GetFlashcardDeckDetailV2Service } from '#services/flashcard/v2/getFlashcardDeckDetailV2Service'
import { FlashcardDeckListV2Serializer } from '#serializers/admin/v2/flashcardDeckListSerializer'
import { FlashcardDeckV2Serializer } from '#serializers/admin/v2/flashcardDeckSerializer'

class FlashcardV2UserController {
  async getDecks(req, res) {
    const { search, topic, department, page, perPage } = req.query
    const result = await GetFlashcardDecksV2Service.call({
      search, topic, department, page, perPage,
      userRole: req.user.role,
    }, req.user.id)
    return res.status(200).json({
      data: FlashcardDeckListV2Serializer.serialize(result.decks),
      pagination: result.pagination,
    })
  }

  async getDeck(req, res) {
    const { uniqueId } = req.params
    const deck = await GetFlashcardDeckDetailV2Service.call(uniqueId)
    return res.status(200).json({ data: FlashcardDeckV2Serializer.serialize(deck) })
  }
}

export default new FlashcardV2UserController()
