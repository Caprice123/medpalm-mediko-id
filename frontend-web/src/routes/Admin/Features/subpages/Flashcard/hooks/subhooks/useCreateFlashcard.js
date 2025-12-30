import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import {
  createFlashcardDeck,
  fetchAdminFlashcardDecks,
  generateFlashcards,
  generateFlashcardsFromPDF
} from '@store/flashcard/adminAction'
import { upload } from '@store/common/action'
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { createFlashcardSchema } from '../../validationSchema/createFlashcardSchema'

export const useCreateFlashcard = (onClose) => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.flashcard)
  const { loading: commonLoading } = useSelector(state => state.common)

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
      uploadedBlobId: null
    },
    validationSchema: createFlashcardSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Combine university and semester tags
        const allTags = [...values.universityTags, ...values.semesterTags]

        // Build payload based on content type
        const payload = {
          title: values.title.trim(),
          description: values.description.trim(),
          contentType: values.contentType === 'document' ? 'pdf' : 'text',
          status: values.status,
          cards: values.cards.map((card, index) => ({
            front: card.front,
            back: card.back,
            blobId: card.image?.id || null, // Send blob ID in camelCase
            order: index
          })),
          tags: allTags.map(t => t.id)
        }

        // Add content or blobId based on contentType
        if (values.contentType === 'document') {
          // Document type: send blobId, no content
          payload.blobId = values.uploadedBlobId
        } else {
          // Text type: send content, no blobId
          payload.content = values.textContent.trim()
        }

        console.log('Create flashcard payload:', payload)

        await dispatch(createFlashcardDeck(payload))

        // Refresh the list
        await dispatch(fetchAdminFlashcardDecks())

        // Reset form (includes all generation fields)
        resetForm()

        // Close modal
        if (onClose) {
          onClose()
        }
      } catch (err) {
        console.error('Failed to create flashcard deck:', err)
      }
    }
  })

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
        url: result.url, // Temporary presigned URL for preview
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
    isGenerating
  }
}
