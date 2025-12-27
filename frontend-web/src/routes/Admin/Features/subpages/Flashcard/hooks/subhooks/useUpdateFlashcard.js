import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import {
  updateFlashcardDeck,
  fetchAdminFlashcardDecks,
  uploadCardImage
} from '@store/flashcard/adminAction'
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { updateFlashcardSchema } from '../../validationSchema/createFlashcardSchema'

export const useUpdateFlashcard = (onClose) => {
  const dispatch = useDispatch()
  const { detail } = useSelector(state => state.flashcard)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [initialContentType, setInitialContentType] = useState('document')
  const [initialTextContent, setInitialTextContent] = useState('')

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      cards: [],
      universityTags: [],
      semesterTags: [],
      status: 'draft'
    },
    validationSchema: updateFlashcardSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!detail?.id) {
          console.error('No deck selected for update')
          return
        }
        console.log(values)

        // Combine university and semester tags
        const universityTagIds = values.universityTags?.map(tag => tag.id) || []
        const semesterTagIds = values.semesterTags?.map(tag => tag.id) || []
        const allTagIds = [...universityTagIds, ...semesterTagIds]

        // Prepare cards data (image keys sent to backend for attachment linking)
        const cardsData = values.cards.map((card, index) => ({
          id: card.id, // Preserve existing card IDs for updates
          front: card.front,
          back: card.back,
          image_key: card.image?.key || null, // Backend will create attachment link
          order: index
        }))

        const payload = {
          title: values.title,
          description: values.description || '',
          status: values.status,
          tags: allTagIds,
          cards: cardsData,
          blobId: pdfInfo?.blobId || null
        }

        console.log(payload)
        await dispatch(updateFlashcardDeck(detail.id, payload))

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
        tag.tag_group?.name === 'university'
      ) || []

      const semesterTags = detail.tags?.filter(tag =>
        tag.tag_group?.name === 'semester'
      ) || []

      // Add tempId to cards for drag-and-drop
      const cardsWithTempIds = detail.flashcard_cards?.map((card, index) => ({
        ...card,
        image: card.image ? {
            url: card.image.url, // Temporary presigned URL for preview
            key: card.image.key, // Frontend will send this key when creating/updating cards
            filename: card.image.filename,
            contentType: card.image.contentType,
            byteSize: card.image.byteSize,
        } : null,
        tempId: card.id || Date.now() + index
      })) || []

      form.setValues({
        title: detail.title || '',
        description: detail.description || '',
        cards: cardsWithTempIds,
        universityTags: universityTags,
        semesterTags: semesterTags,
        status: detail.status || 'draft'
      })

      // Set initial content based on content_type
      if (detail.content_type === 'pdf' && detail.blob) {
        setInitialContentType('document')
        setPdfInfo({
          blobId: detail.blob.id
        })
      } else if (detail.content_type === 'text' && detail.content) {
        setInitialContentType('text')
        setInitialTextContent(detail.content)
      } else {
        // Default to document if no content_type
        setInitialContentType('document')
        setInitialTextContent('')
      }
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
      const result = await dispatch(uploadCardImage(file))
      console.log(file)
      form.setFieldValue(`cards.${cardIndex}.image`, {
        url: result.url, // Temporary presigned URL for preview
        key: result.key, // Frontend will send this key when creating/updating cards
        filename: result.filename,
        contentType: result.contentType,
        byteSize: result.byteSize,
      })
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image. Please try again.')
    }
  }

  console.log(form.values)

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

  return {
    form,
    sensors,
    handleAddCard,
    handleRemoveCard,
    handleDragEnd,
    handleImageUpload,
    setPdfInfo,
    pdfInfo,
    initialContentType,
    initialTextContent
  }
}
