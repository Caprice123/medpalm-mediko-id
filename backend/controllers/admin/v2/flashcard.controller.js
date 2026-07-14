import { CreateFlashcardDeckV2Service } from '#services/flashcard/v2/createFlashcardDeckV2Service'
import { UpdateFlashcardDeckV2Service } from '#services/flashcard/v2/updateFlashcardDeckV2Service'
import { GetFlashcardDecksV2Service } from '#services/flashcard/v2/getFlashcardDecksV2Service'
import { GetFlashcardDeckDetailV2Service } from '#services/flashcard/v2/getFlashcardDeckDetailV2Service'
import { DeleteFlashcardDeckService } from '#services/flashcard/admin/deleteFlashcardDeckService'
import { AttachSourcePdfService } from '#services/flashcard/v2/attachSourcePdfService'
import { FlashcardDeckV2Serializer } from '#serializers/admin/v2/flashcardDeckSerializer'
import { FlashcardDeckListV2Serializer } from '#serializers/admin/v2/flashcardDeckListSerializer'

class FlashcardV2Controller {
  async index(req, res) {
    const { search, topic, department, page, perPage } = req.query
    const result = await GetFlashcardDecksV2Service.call({ search, topic, department, page, perPage })
    return res.status(200).json({
      data: FlashcardDeckListV2Serializer.serialize(result.decks),
      pagination: result.pagination,
    })
  }

  async create(req, res) {
    const { title, description, status, cards } = req.body
    const deck = await CreateFlashcardDeckV2Service.call({
      title,
      description,
      status,
      cards: cards || [],
      created_by: req.user.id,
    })
    return res.status(201).json({ data: FlashcardDeckV2Serializer.serialize(deck) })
  }

  async show(req, res) {
    const { uniqueId } = req.params
    const deck = await GetFlashcardDeckDetailV2Service.call(uniqueId)
    return res.status(200).json({ data: FlashcardDeckV2Serializer.serialize(deck) })
  }

  async update(req, res) {
    const { uniqueId } = req.params
    const { title, description, status, cards } = req.body
    const deck = await UpdateFlashcardDeckV2Service.call(uniqueId, {
      title,
      description,
      status,
      ...(cards !== undefined && { cards }),
    })
    return res.status(200).json({ data: FlashcardDeckV2Serializer.serialize(deck) })
  }

  async attachSourcePdf(req, res) {
    const { uniqueId } = req.params
    const { blobId } = req.body
    await AttachSourcePdfService.call(uniqueId, blobId)
    return res.status(200).json({ data: { message: 'PDF sumber berhasil dilampirkan' } })
  }

  async destroy(req, res) {
    const { uniqueId } = req.params
    await DeleteFlashcardDeckService.call(uniqueId)
    return res.status(200).json({ data: { message: 'Deck berhasil dihapus' } })
  }
}

export default new FlashcardV2Controller()
