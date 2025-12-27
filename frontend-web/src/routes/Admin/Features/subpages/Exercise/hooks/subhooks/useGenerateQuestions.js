import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateQuestions } from '@store/exercise/adminAction'
import { postWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'

export const useGenerateQuestions = (mainForm, setPdfInfo, initialContentType = 'document', initialTextContent = '') => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.exercise)

  const [contentType, setContentType] = useState(initialContentType)
  const [textContent, setTextContent] = useState(initialTextContent)
  const [pdfFile, setPdfFile] = useState(null)
  const [questionCount, setQuestionCount] = useState(10)
  const [uploadedBlobId, setUploadedBlobId] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // Update state when initial values change (when topic detail is loaded)
  useEffect(() => {
    setContentType(initialContentType)
  }, [initialContentType])

  useEffect(() => {
    setTextContent(initialTextContent)
  }, [initialTextContent])

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type === 'application/pdf') {
        setPdfFile(file)

        // Immediately upload PDF to get blobId
        try {
          setIsUploading(true)
          const uploadFormData = new FormData()
          uploadFormData.append('file', file)
          uploadFormData.append('type', 'exercise')

          const uploadResponse = await postWithToken(Endpoints.api.uploadImage, uploadFormData)
          const blobId = uploadResponse.data.data.blobId
          setUploadedBlobId(blobId)

          // Store blob ID immediately
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
      } else {
        alert('Please select a PDF file')
      }
    }
  }

  const handleGenerate = async () => {
    try {
      if (contentType === 'document' && uploadedBlobId && pdfFile) {
        // Generate from PDF using blobId
        const formData = new FormData()
        formData.append('file', pdfFile) // Backend still needs the file to process
        formData.append('blobId', uploadedBlobId)
        formData.append('questionCount', questionCount)

        const response = await postWithToken(Endpoints.exercises.admin.generateFromPDF, formData)
        const data = response.data.data || {}
        const questions = data.questions || []

        // Update main form with generated questions
        const questionsWithIds = questions.map((question, index) => ({
          ...question,
          id: Date.now() + index,
          order: index
        }))
        mainForm.setFieldValue('questions', questionsWithIds)

        // Keep the file for potential re-generation
      } else if (contentType === 'text' && textContent.trim()) {
        // Generate from text
        const questions = await dispatch(generateQuestions(textContent, 'text', questionCount))

        // Update main form with generated questions
        const questionsWithIds = questions.map((question, index) => ({
          ...question,
          id: Date.now() + index,
          order: index
        }))
        mainForm.setFieldValue('questions', questionsWithIds)

        // Keep the text for potential re-generation
      }
    } catch (error) {
      console.error('Failed to generate questions:', error)
    }
  }

  const canGenerate = contentType === 'document'
    ? uploadedBlobId !== null && !isUploading
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
    isGenerating: loading.isGeneratingQuestions || isUploading
  }
}
