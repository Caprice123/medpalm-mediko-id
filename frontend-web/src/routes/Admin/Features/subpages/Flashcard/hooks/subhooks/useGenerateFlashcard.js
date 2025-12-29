import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateFlashcards, generateFlashcardsFromPDF } from '@store/flashcard/adminAction'
import { upload } from '@store/common/action'

export const useGenerateFlashcard = (mainForm, setPdfInfo, initialContentType = 'document', initialTextContent = '') => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.flashcard)
  const { loading: commonLoading } = useSelector(state => state.common)

  const [contentType, setContentType] = useState(initialContentType)
  const [textContent, setTextContent] = useState(initialTextContent)
  const [pdfFile, setPdfFile] = useState(null)
  const [cardCount, setCardCount] = useState(10)
  const [uploadedBlobId, setUploadedBlobId] = useState(null)

  // Update state when initial values change (when deck detail is loaded)
  useEffect(() => {
    setContentType(initialContentType)
  }, [initialContentType])

  useEffect(() => {
    setTextContent(initialTextContent)
  }, [initialTextContent])

  const handleFileSelect = async (e) => {
    const file = e.target?.files?.[0] || e
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)

      // Immediately upload to get blobId using common action
      try {
        const uploadResult = await dispatch(upload(file, 'flashcard'))

        if (uploadResult?.blobId) {
          setUploadedBlobId(uploadResult.blobId)
          if (setPdfInfo) {
            setPdfInfo({ blobId: uploadResult.blobId })
          }
        } else {
          throw new Error('Upload failed - no blobId returned')
        }
      } catch (error) {
        console.error('Failed to upload PDF:', error)
        alert('Gagal upload PDF. Silakan coba lagi.')
        setPdfFile(null)
      }
    } else if (file) {
      alert('Silakan pilih file PDF')
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
    ? (pdfFile !== null && uploadedBlobId !== null && !commonLoading.isUploading)
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
    isGenerating: loading.isGeneratingCards || commonLoading.isUploading
  }
}
