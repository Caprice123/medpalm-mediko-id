import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { generateMcqQuestions } from '@store/mcq/action'
import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FormGroup,
  Label,
  TypeSelector,
  TypeOption,
  TypeIcon,
  TypeContent,
  TypeLabel,
  TypeDescription,
  Textarea,
  FileUploadArea,
  FileUploadIcon,
  FileUploadText,
  FileUploadHint,
  FileName,
  Input,
  HintText,
  ModalFooter,
  Button,
  LoadingSpinner
} from './GenerateMcqModal.styles'

function GenerateMcqModal({ onClose, onGenerate }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.mcq)

  const [type, setType] = useState('pdf')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [questionCount, setQuestionCount] = useState(10)

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleGenerate = async () => {
    try {
      const questions = await dispatch(generateMcqQuestions({
        content,
        file,
        type,
        questionCount
      }))

      if (onGenerate) {
        onGenerate(questions)
      }

      onClose()
    } catch (error) {
      console.error('Failed to generate MCQ questions:', error)
    }
  }

  const canGenerate = type === 'pdf' ? file !== null : content.trim().length > 0

  return (
    <Overlay isOpen={true} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Generate MCQ Questions with AI</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label>Choose Input Type</Label>
            <TypeSelector>
              <TypeOption
                active={type === 'pdf'}
                onClick={() => setType('pdf')}
              >
                <TypeIcon>📄</TypeIcon>
                <TypeContent>
                  <TypeLabel>PDF Document</TypeLabel>
                  <TypeDescription active={type === 'pdf'}>
                    Upload a PDF file containing medical study materials
                  </TypeDescription>
                </TypeContent>
              </TypeOption>
              <TypeOption
                active={type === 'text'}
                onClick={() => setType('text')}
              >
                <TypeIcon>📝</TypeIcon>
                <TypeContent>
                  <TypeLabel>Text Content</TypeLabel>
                  <TypeDescription active={type === 'text'}>
                    Paste text directly from your study materials
                  </TypeDescription>
                </TypeContent>
              </TypeOption>
            </TypeSelector>
          </FormGroup>

          {type === 'pdf' && (
            <FormGroup>
              <Label>Upload PDF Document</Label>
              <FileUploadArea
                hasFile={file !== null}
                onClick={() => document.getElementById('pdf-upload').click()}
              >
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                {!file ? (
                  <>
                    <FileUploadIcon>📤</FileUploadIcon>
                    <FileUploadText>Click to upload PDF</FileUploadText>
                    <FileUploadHint>PDF file, max 20MB</FileUploadHint>
                  </>
                ) : (
                  <>
                    <FileUploadIcon>✅</FileUploadIcon>
                    <FileUploadText>File uploaded successfully</FileUploadText>
                    <FileName>{file.name}</FileName>
                    <FileUploadHint>Click to change file</FileUploadHint>
                  </>
                )}
              </FileUploadArea>
            </FormGroup>
          )}

          {type === 'text' && (
            <FormGroup>
              <Label>Paste Text Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your medical study material here..."
              />
              <HintText>Enter the content you want to generate MCQ questions from</HintText>
            </FormGroup>
          )}

          <FormGroup>
            <Label>Number of Questions</Label>
            <Input
              type="number"
              min="1"
              max="50"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 10)}
            />
            <HintText>Choose between 1 and 50 questions</HintText>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} disabled={loading.isGenerating}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={loading.isGenerating || !canGenerate}
          >
            {loading.isGenerating && <LoadingSpinner />}
            {loading.isGenerating ? 'Generating...' : 'Generate Questions'}
          </Button>
        </ModalFooter>
      </Modal>
    </Overlay>
  )
}

export default GenerateMcqModal
