import { GenerateFlashcardService } from '#services/flashcard/admin/generateFlashcardService'
import { CreateFlashcardDeckService } from '#services/flashcard/admin/createFlashcardDeckService'
import { GetFlashcardDecksService } from '#services/flashcard/getFlashcardDecksService'
import { GetFlashcardDeckDetailService } from '#services/flashcard/admin/getFlashcardDeckDetailService'
import { UpdateFlashcardCardsService } from '#services/flashcard/admin/updateFlashcardCardsService'
import { UpdateFlashcardDeckService } from '#services/flashcard/admin/updateFlashcardDeckService'
import { FlashcardDeckSerializer } from '#serializers/admin/v1/flashcardDeckSerializer'
import { FlashcardDeckListSerializer } from '#serializers/admin/v1/flashcardDeckListSerializer'
import { FlashcardGenerationSerializer } from '#serializers/admin/v1/flashcardGenerationSerializer'
import idriveService from '#services/idrive.service'
import blobService from '#services/attachment/blobService'
import { ValidationError } from '#errors/validationError'

class FlashcardController {
    
  async index(req, res) {
    const { university, semester, page, perPage } = req.query

    const result = await GetFlashcardDecksService.call({ university, semester, page, perPage })

    return res.status(200).json({
      data: FlashcardDeckListSerializer.serialize(result.decks),
      pagination: result.pagination
    })
  }

  async create(req, res) {
    const {
      title,
      description,
      content_type,
      content,
      blobId,
      tags,
      cards,
      status
    } = req.body

    const deck = await CreateFlashcardDeckService.call({
      title,
      description,
      content_type,
      content,
      blobId,
      tags,
      cards, // Cards already include image_key from centralized upload
      status,
      created_by: req.user.id
    })

    return res.status(201).json({
      data: FlashcardDeckSerializer.serialize(deck),
    })
  }
  
  async show(req, res) {
    const { id } = req.params

    const deck = await GetFlashcardDeckDetailService.call(id)

    return res.status(200).json({
      data: FlashcardDeckSerializer.serialize(deck)
    })
  }

  async update(req, res) {
    const { id } = req.params
    const { title, description, status, tags, cards, blobId } = req.body

    // Check if this is a full deck update or just cards
    if (title !== undefined || tags !== undefined) {
      // Full deck update
      const updatedDeck = await UpdateFlashcardDeckService.call(id, {
        title,
        description,
        status,
        tags,
        cards, // Cards already include image_key from centralized upload
        blobId
      })

      return res.status(200).json({
        data: FlashcardDeckSerializer.serialize(updatedDeck),
      })
    } else {
      // Simple cards update (backward compatibility)
      const updatedDeck = await UpdateFlashcardCardsService.call(id, cards)

      return res.status(200).json({
        data: FlashcardDeckSerializer.serialize(updatedDeck),
      })
    }
  }

  async generateCards(req, res) {
    const { content, type, cardCount = 10 } = req.body

    const cards = await GenerateFlashcardService.call({ content, type, cardCount })

    return res.status(200).json({
      data: FlashcardGenerationSerializer.serialize(cards)
    })
  }

  /**
   * Generate flashcards from uploaded PDF (preview mode)
   * POST /admin/v1/flashcards/generate-from-pdf
   *
   * Frontend uploads PDF to /api/v1/upload/image with type=flashcard to get blobId
   * Then passes only the blobId for card generation
   * PDF is kept in memory (no disk write) for optimal performance
   */
  async generateCardsFromPDF(req, res) {
    const { cardCount = 10, blobId } = req.body

    if (!blobId) {
      throw new ValidationError("blobId is required")
    }

    // Get blob from database
    const blob = await blobService.getBlobById(parseInt(blobId))
    if (!blob) {
      throw new ValidationError("Invalid blobId")
    }

    // Download PDF as buffer (in-memory, no disk write)
    const pdfBuffer = await idriveService.downloadFileAsBuffer(blob.key)

    // Generate flashcards from buffer
    const cards = await GenerateFlashcardService.call({
      pdfBuffer: pdfBuffer,
      type: 'pdf',
      cardCount: parseInt(cardCount) || 10
    })

    // Buffer is automatically garbage collected, no cleanup needed
    return res.status(200).json({
      data: FlashcardGenerationSerializer.serialize(cards, blobId)
    })
  }
}

export default new FlashcardController()
