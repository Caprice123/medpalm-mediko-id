import { GenerateFlashcardService } from '#services/flashcard/admin/generateFlashcardService'
import { CreateFlashcardDeckService } from '#services/flashcard/admin/createFlashcardDeckService'
import { GetFlashcardDecksService } from '#services/flashcard/getFlashcardDecksService'
import { GetFlashcardDeckDetailService } from '#services/flashcard/admin/getFlashcardDeckDetailService'
import { UpdateFlashcardCardsService } from '#services/flashcard/admin/updateFlashcardCardsService'
import { UpdateFlashcardDeckService } from '#services/flashcard/admin/updateFlashcardDeckService'
import { FlashcardDeckSerializer } from '#serializers/admin/v1/flashcardDeckSerializer'
import idriveService from '#services/idrive.service'
import blobService from '#services/attachment/blobService'
import path from 'path'

class FlashcardController {
    
  async index(req, res) {
    const { university, semester, page, perPage } = req.query

    const result = await GetFlashcardDecksService.call({ university, semester, page, perPage })

    return res.status(200).json({
      data: result
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
      cards
    } = req.body

    const deck = await CreateFlashcardDeckService.call({
      title,
      description,
      content_type,
      content,
      blobId,
      tags,
      cards, // Cards already include image_key from centralized upload
      created_by: req.user.id
    })

    return res.status(201).json({
      success: true,
      data: FlashcardDeckSerializer.serialize(deck),
      message: 'Deck created successfully'
    })
  }
  
  async show(req, res) {
    const { id } = req.params

    const deck = await GetFlashcardDeckDetailService.call(id)

    return res.status(200).json({
      success: true,
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
        success: true,
        data: FlashcardDeckSerializer.serialize(updatedDeck),
        message: 'Deck updated successfully'
      })
    } else {
      // Simple cards update (backward compatibility)
      const updatedDeck = await UpdateFlashcardCardsService.call(id, cards)

      return res.status(200).json({
        success: true,
        data: FlashcardDeckSerializer.serialize(updatedDeck),
        message: 'Cards updated successfully'
      })
    }
  }

  async generateCards(req, res) {
    const { content, type, cardCount = 10 } = req.body

    const cards = await GenerateFlashcardService.call({ content, type, cardCount })

    return res.status(200).json({
      data: cards
    })
  }

  /**
   * Generate flashcards from uploaded PDF (preview mode)
   * POST /admin/v1/flashcards/generate-from-pdf
   *
   * Note: This now uses the centralized upload endpoint
   * Frontend should call /api/v1/upload/image with type=flashcard to get blobId
   * Then pass that blobId along with the PDF file for card generation
   */
  async generateCardsFromPDF(req, res) {
    const { cardCount = 10, blobId } = req.body

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      })
    }

    // Generate flashcards from the uploaded PDF
    const cards = await GenerateFlashcardService.call({
      pdfFilePath: req.file.path,
      type: 'pdf',
      cardCount: parseInt(cardCount) || 10
    })

    // If blobId was provided from centralized upload, return it
    // Otherwise, return just the cards for backward compatibility
    let responseData = {
      cards: cards
    }

    if (blobId) {
      responseData.blobId = blobId
    }

    return res.status(200).json({
      success: true,
      data: responseData
    })
  }

  async uploadImage(req, res) {
    // File is already uploaded by multer middleware
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      })
    }

    // Upload to iDrive
    const uploadResult = await idriveService.uploadFile(
      req.file.path,
      'flashcard-images',
      req.file.originalname,
    )

    // Create blob record only (no attachment yet - will be linked when card is created)
    const blob = await blobService.createBlob({
      key: uploadResult.key,
      filename: uploadResult.fileName,
      contentType: idriveService.getContentType(path.extname(req.file.path)),
      byteSize: blobService.getFileSize(req.file.path),
      checksum: blobService.calculateChecksum(req.file.path),
      metadata: {
        originalName: path.basename(req.file.path),
        uploadedFrom: 'flashcard_card'
      }
    })

    // Generate presigned URL for immediate preview (1 hour)
    const presignedUrl = await idriveService.getSignedUrl(blob.key, 3600)

    return res.status(200).json({
      success: true,
      data: {
        url: presignedUrl, // Temporary presigned URL for preview
        key: blob.key, // Frontend will send this key when creating/updating cards
        filename: blob.filename,
        contentType: idriveService.getContentType(path.extname(req.file.path)),
        byteSize: blobService.getFileSize(req.file.path),
      }
    })
  }
}

export default new FlashcardController()
