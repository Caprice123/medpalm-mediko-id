import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import {
  updateFlashcardDeck,
  fetchAdminFlashcardDecks,
  generateFlashcards,
  generateFlashcardsFromPDF
} from '@store/flashcard/adminAction'
import { upload } from '@store/common/action'
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { updateFlashcardSchema } from '../../validationSchema/createFlashcardSchema'

export const useUpdateFlashcard = (onClose) => {
  const dispatch = useDispatch()
  const { detail, loading } = useSelector(state => state.flashcard)
  const { loading: commonLoading } = useSelector(state => state.common)
  const [pdfInfo, setPdfInfo] = useState(null)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      cards: [],
      universityTags: [],
      semesterTags: [],
      status: 'draft',
      // Generation fields merged into Formik
      contentType: 'document',
      textContent: '',
      pdfFile: null,
      cardCount: 10,
      uploadedBlobId: null,
      blobId: null
    },
    validationSchema: updateFlashcardSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!detail?.uniqueId) {
          console.error('No deck selected for update')
          return
        }

        // Combine university and semester tags
        const universityTagIds = values.universityTags?.map(tag => tag.id) || []
        const semesterTagIds = values.semesterTags?.map(tag => tag.id) || []
        const allTagIds = [...universityTagIds, ...semesterTagIds]

        // Prepare cards data
        const cardsData = values.cards.map((card, index) => ({
          id: card.id, // Preserve existing card IDs for updates
          front: card.front,
          back: card.back,
          blobId: card.image?.id || null, // Send blob ID in camelCase
          order: index
        }))

        // Build payload based on content type
        const payload = {
          title: values.title,
          description: values.description || '',
          contentType: values.contentType === 'document' ? 'pdf' : 'text',
          status: values.status,
          tags: allTagIds,
          cards: cardsData
        }

        // Add content or blobId based on contentType
        if (values.contentType === 'document') {
          // Document type: send blobId
          if (values.uploadedBlobId) {
            payload.blobId = values.uploadedBlobId
          } else if (values.blobId) {
            payload.blobId = values.blobId
          }
        } else {
          // Text type: send content, remove blobId
          payload.content = values.textContent.trim()
          payload.blobId = null
        }

        console.log('Update flashcard payload:', payload)
        await dispatch(updateFlashcardDeck(detail.uniqueId, payload))

        // Refresh the list
        await dispatch(fetchAdminFlashcardDecks())

        // Reset form and clear selected deck
        resetForm()

        // Close modal
        if (onClose) {
          onClose()
        }
      } catch (err) {
        console.error('Failed to update flashcard deck:', err)
      }
    },
    enableReinitialize: true
  })

  // Populate form when detail changes
  useEffect(() => {
    if (detail) {
      // Map tags to the format expected by TagSelector
      const universityTags = detail.tags?.filter(tag =>
        tag.tagGroup?.name === 'university'
      ) || []

      const semesterTags = detail.tags?.filter(tag =>
        tag.tagGroup?.name === 'semester'
      ) || []

      // Add tempId to cards for drag-and-drop
      const deckCards = detail.cards || detail.flashcard_cards || []

      const cardsWithTempIds = deckCards.map((card, index) => ({
        ...card,
        image: card.image ? {
            id: card.image.id, // Blob ID for backend
            url: card.image.url,
            key: card.image.key,
            filename: card.image.filename,
            contentType: card.image.contentType,
            byteSize: card.image.byteSize,
        } : null,
        tempId: card.id || Date.now() + index
      }))

      const value = {
        title: detail.title || '',
        description: detail.description || '',
        cards: cardsWithTempIds,
        universityTags: universityTags,
        semesterTags: semesterTags,
        status: detail.status || 'draft',
        blobId: detail.blob?.id || null
      }

      // Set initial content based on content_type
      if (detail.contentType === 'pdf' || detail.type === 'pdf') {
        value.contentType = 'document'
        if (detail.blob) {
          setPdfInfo({
            pdfUrl: detail.blob.url,
            pdfKey: detail.blob.key,
            pdfFilename: detail.blob.filename,
            pdfSize: detail.blob.size
          })
        }
      } else if (detail.content) {
        value.contentType = 'text'
        value.textContent = detail.content
      }

      form.setValues(value)
    }
  }, [detail])

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleAddCard = () => {
    const newCard = {
      tempId: Date.now(),
      front: '',
      back: '',
      order: form.values.cards.length,
      image: null,
      image_url: null
    }
    form.setFieldValue("cards", [...form.values.cards, newCard])
  }

  const handleRemoveCard = (index) => {
    const updatedCards = form.values.cards.filter((_, i) => i !== index)
    // Update order for remaining cards
    const reorderedCards = updatedCards.map((card, idx) => ({
      ...card,
      order: idx
    }))
    form.setFieldValue("cards", reorderedCards)
  }

  const handleImageUpload = async (cardIndex, file) => {
    try {
      // Upload image to centralized endpoint
      const result = await dispatch(upload(file, 'flashcard'))
      form.setFieldValue(`cards.${cardIndex}.image`, {
        id: result.blobId, // Blob ID for backend
        url: result.url,
        key: result.key,
        filename: result.filename,
        contentType: result.contentType,
        byteSize: result.byteSize,
      })
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image. Please try again.')
    }
  }

  // Drag and drop handler
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const cards = form.values.cards
      const oldIndex = cards.findIndex((card) => card.tempId === active.id)
      const newIndex = cards.findIndex((card) => card.tempId === over.id)

      const reorderedCards = arrayMove(cards, oldIndex, newIndex).map((card, idx) => ({
        ...card,
        order: idx
      }))

      form.setFieldValue("cards", reorderedCards)
    }
  }

  // Handle file selection and upload
  const handleFileSelect = async (file) => {
    if (file.type === 'application/pdf') {
      form.setFieldValue('pdfFile', file)

      // Immediately upload PDF to get blobId
      try {
        const uploadResult = await dispatch(upload(file, 'flashcard'))

        if (uploadResult?.blobId) {
          form.setFieldValue('uploadedBlobId', uploadResult.blobId)
        } else {
          throw new Error('Upload failed - no blobId returned')
        }
      } catch (error) {
        console.error('Failed to upload PDF:', error)
        alert('Gagal upload PDF. Silakan coba lagi.')
        form.setFieldValue('pdfFile', null)
      }
    }
  }

  // Handle flashcard generation
  const handleGenerate = async () => {
    try {
      const { contentType, uploadedBlobId, pdfFile, textContent, cardCount } = form.values

      if (contentType === 'document' && uploadedBlobId && pdfFile) {
        // Generate from newly uploaded PDF
        const result = await dispatch(generateFlashcardsFromPDF(pdfFile, cardCount, uploadedBlobId))

        if (!result || !result.cards) {
          alert('Gagal generate flashcards dari PDF')
          return
        }

        // Update form with generated cards
        const cardsWithTempIds = result.cards.map((card, index) => ({
          ...card,
          tempId: Date.now() + index,
          order: index
        }))
        form.setFieldValue('cards', cardsWithTempIds)
      } else if (contentType === 'text' && textContent.trim()) {
        // Generate from text
        const cards = await dispatch(generateFlashcards(textContent, 'text', cardCount))

        if (!cards || cards.length === 0) {
          return
        }

        // Update form with generated cards
        const cardsWithTempIds = cards.map((card, index) => ({
          ...card,
          tempId: Date.now() + index,
          order: index
        }))
        form.setFieldValue('cards', cardsWithTempIds)
      } else {
        // Validation
        if (contentType === 'document' && !uploadedBlobId) {
          alert('Silakan upload file PDF terlebih dahulu.')
        } else if (contentType === 'text' && !textContent.trim()) {
          alert('Silakan masukkan teks terlebih dahulu.')
        }
      }
    } catch (error) {
      console.error('Failed to generate flashcards:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat generate flashcards'
      alert(`Gagal generate flashcards: ${errorMessage}`)
    }
  }

  const canGenerate = form.values.contentType === 'document'
    ? form.values.uploadedBlobId !== null && !commonLoading.isUploading
    : !!form.values.textContent?.trim()

  const isGenerating = loading.isGeneratingCards || commonLoading.isUploading

  return {
    form,
    sensors,
    handleAddCard,
    handleRemoveCard,
    handleDragEnd,
    handleImageUpload,
    handleFileSelect,
    handleGenerate,
    canGenerate,
    isGenerating,
    pdfInfo
  }
}
