import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateFlashcards, generateFlashcardsFromPDF } from '@store/flashcard/adminAction'

export const useGenerateFlashcard = (mainForm, setPdfInfo, initialContentType = 'document', initialTextContent = '') => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.flashcard)

  const [contentType, setContentType] = useState(initialContentType)
  const [textContent, setTextContent] = useState(initialTextContent)
  const [pdfFile, setPdfFile] = useState(null)
  const [cardCount, setCardCount] = useState(10)

  // Update state when initial values change (when deck detail is loaded)
  useEffect(() => {
    setContentType(initialContentType)
  }, [initialContentType])

  useEffect(() => {
    setTextContent(initialTextContent)
  }, [initialTextContent])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type === 'application/pdf') {
        setPdfFile(file)
      } else {
        alert('Please select a PDF file')
      }
    }
  }

  const handleGenerate = async () => {
    try {
      if (contentType === 'document' && pdfFile) {
        // Generate from PDF
        const result = await dispatch(generateFlashcardsFromPDF(pdfFile, cardCount))

        // Update main form with generated cards
        const cardsWithTempIds = result.cards.map((card, index) => ({
          ...card,
          tempId: Date.now() + index,
          order: index
        }))
        mainForm.setFieldValue('cards', cardsWithTempIds)

        // Store blob ID
        if (setPdfInfo) {
          setPdfInfo({
            blobId: result.blobId
          })
        }

        // Keep the file for potential re-generation
      } else if (contentType === 'text' && textContent.trim()) {
        // Generate from text
        const cards = await dispatch(generateFlashcards(textContent, 'text', cardCount))

        // Update main form with generated cards
        const cardsWithTempIds = cards.map((card, index) => ({
          ...card,
          tempId: Date.now() + index,
          order: index
        }))
        mainForm.setFieldValue('cards', cardsWithTempIds)

        // Keep the text for potential re-generation
      }
    } catch (error) {
      console.error('Failed to generate flashcards:', error)
    }
  }

  const canGenerate = contentType === 'document'
    ? pdfFile !== null
    : textContent.trim().length > 0

  return {
    contentType,
    setContentType,
    textContent,
    setTextContent,
    pdfFile,
    setPdfFile,
    cardCount,
    setCardCount,
    handleFileSelect,
    handleGenerate,
    canGenerate,
    isGenerating: loading.isGeneratingCards
  }
}
