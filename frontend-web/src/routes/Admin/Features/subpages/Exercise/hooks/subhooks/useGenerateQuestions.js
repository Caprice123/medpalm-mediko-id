import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateQuestions, generateQuestionsFromPDF } from '@store/exercise/adminAction'
import { upload } from '@store/common/action'

export const useGenerateQuestions = (mainForm, setPdfInfo, initialContentType = 'document', initialTextContent = '') => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.exercise)
  const { loading: commonLoading } = useSelector(state => state.common)

  const [contentType, setContentType] = useState(initialContentType)
  const [textContent, setTextContent] = useState(initialTextContent)
  const [pdfFile, setPdfFile] = useState(null)
  const [questionCount, setQuestionCount] = useState(10)
  const [uploadedBlobId, setUploadedBlobId] = useState(null)

  // Update state when initial values change (when topic detail is loaded)
  useEffect(() => {
    setContentType(initialContentType)
  }, [initialContentType])

  useEffect(() => {
    setTextContent(initialTextContent)
  }, [initialTextContent])

  const handleFileSelect = async (file) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file)

      // Immediately upload PDF to get blobId using common action
      try {
        const uploadResult = await dispatch(upload(file, 'exercise'))

        if (uploadResult?.blobId) {
          setUploadedBlobId(uploadResult.blobId)

          // Store blob ID immediately
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
    }
  }

  const handleGenerate = async () => {
    try {
      if (contentType === 'document' && uploadedBlobId) {
        // Generate from PDF using blobId (file already uploaded)
        const result = await dispatch(generateQuestionsFromPDF(uploadedBlobId, questionCount))

        if (!result || !result.questions) {
          alert('Gagal generate soal dari PDF')
          return
        }

        const questions = result.questions

        // Update main form with generated questions
        const questionsWithIds = questions.map((question, index) => ({
          ...question,
          id: Date.now() + index,
          order: index
        }))
        mainForm.setFieldValue('questions', questionsWithIds)

        // Store PDF info (blobId)
        if (setPdfInfo) {
          setPdfInfo({
            blobId: uploadedBlobId,
            contentType: 'pdf'
          })
        }
      } else if (contentType === 'text' && textContent.trim()) {
        // Generate from text
        const questions = await dispatch(generateQuestions(textContent, 'text', questionCount))

        if (!questions || questions.length === 0) {
          return
        }

        // Update main form with generated questions
        const questionsWithIds = questions.map((question, index) => ({
          ...question,
          id: Date.now() + index,
          order: index
        }))
        mainForm.setFieldValue('questions', questionsWithIds)

        // Store text content info
        if (setPdfInfo) {
          setPdfInfo({
            textContent: textContent.trim(),
            contentType: 'text'
          })
        }
      } else {
        // Validation
        if (contentType === 'document' && !uploadedBlobId) {
          alert('Silakan upload file PDF terlebih dahulu.')
        } else if (contentType === 'text' && !textContent.trim()) {
          alert('Silakan masukkan teks terlebih dahulu.')
        }
      }
    } catch (error) {
      console.error('Failed to generate questions:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat generate soal'
      alert(`Gagal generate soal: ${errorMessage}`)
    }
  }

  const canGenerate = contentType === 'document'
    ? uploadedBlobId !== null && !commonLoading.isUploading
    : textContent.trim().length > 0

  return {
    contentType,
    setContentType,
    textContent,
    setTextContent,
    pdfFile,
    setPdfFile,
    questionCount,
    setQuestionCount,
    handleFileSelect,
    handleGenerate,
    canGenerate,
    isGenerating: loading.isGeneratingQuestions || commonLoading.isUploading
  }
}
