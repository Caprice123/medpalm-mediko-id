import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateFlashcards, generateFlashcardsFromPDF } from '@store/flashcard/adminAction'
import { postWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'

export const useGenerateFlashcard = (mainForm, setPdfInfo, initialContentType = 'document', initialTextContent = '') => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.flashcard)

  const [contentType, setContentType] = useState(initialContentType)
  const [textContent, setTextContent] = useState(initialTextContent)
  const [pdfFile, setPdfFile] = useState(null)
  const [cardCount, setCardCount] = useState(10)
  const [uploadedBlobId, setUploadedBlobId] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // Update state when initial values change (when deck detail is loaded)
  useEffect(() => {
    setContentType(initialContentType)
  }, [initialContentType])

  useEffect(() => {
    setTextContent(initialTextContent)
  }, [initialTextContent])

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)

      // Immediately upload to get blobId
      try {
        setIsUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('type', 'flashcard')

        const uploadResponse = await postWithToken(Endpoints.api.uploadImage, uploadFormData)
        const blobId = uploadResponse.data.data.blobId

        setUploadedBlobId(blobId)
        if (setPdfInfo) {
          setPdfInfo({ blobId })
        }
      } catch (error) {
        console.error('Failed to upload PDF:', error)
        alert('Failed to upload PDF. Please try again.')
        setPdfFile(null)
      } finally {
        setIsUploading(false)
      }
    } else if (file) {
      alert('Please select a PDF file')
    }
  }

  const handleGenerate = async () => {
    try {
      if (contentType === 'document' && pdfFile && uploadedBlobId) {
        // Generate from PDF using blobId
        const result = await dispatch(generateFlashcardsFromPDF(pdfFile, cardCount, uploadedBlobId))

        // Update main form with generated cards
        const cardsWithTempIds = result.cards.map((card, index) => ({
          ...card,
          tempId: Date.now() + index,
          order: index
        }))
        mainForm.setFieldValue('cards', cardsWithTempIds)

        // blobId is already stored from upload
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
      }
    } catch (error) {
      console.error('Failed to generate flashcards:', error)
    }
  }

  const canGenerate = contentType === 'document'
    ? (pdfFile !== null && uploadedBlobId !== null && !isUploading)
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
    isGenerating: loading.isGeneratingCards || isUploading
  }
}
