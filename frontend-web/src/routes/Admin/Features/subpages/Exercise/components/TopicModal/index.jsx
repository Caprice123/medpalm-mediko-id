import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateQuestions, generateQuestionsFromPDF, createExerciseTopic } from '@store/exercise/action'
import TagSelector from '../TagSelector'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import styled from 'styled-components'

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 16px 16px 0 0;
`

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`

const Section = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: ${props => props.showBorder ? '2px solid #e5e7eb' : 'none'};

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }
`

const TypeSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`

const TypeOption = styled.button`
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#8b5cf6' : '#e5e7eb'};
  background: ${props => props.selected ? 'rgba(139, 92, 246, 0.1)' : 'white'};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: ${props => props.selected ? '#8b5cf6' : '#6b7280'};

  &:hover {
    border-color: #8b5cf6;
    background: rgba(139, 92, 246, 0.05);
  }

  span:first-child {
    font-size: 2rem;
  }
`

const FileUpload = styled.div`
  input[type="file"] {
    display: none;
  }

  label {
    display: block;
    padding: 2rem;
    border: 2px dashed #e5e7eb;
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #8b5cf6;
      background: rgba(139, 92, 246, 0.05);
    }

    div:first-child {
      font-size: 3rem;
    }
  }
`

const FileName = styled.span`
  color: #8b5cf6;
  font-weight: 600;
`

const PDFLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(139, 92, 246, 0.1);
  border: 2px solid #8b5cf6;
  border-radius: 8px;
  color: #8b5cf6;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(139, 92, 246, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  }
`

const QuestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const QuestionCard = styled.div`
  background: #f9fafb;
  border: 2px solid ${props => props.isDragging ? '#8b5cf6' : '#e5e7eb'};
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  transform: ${props => props.transform};
  opacity: ${props => props.isDragging ? 0.5 : 1};
  cursor: ${props => props.isDragging ? 'grabbing' : 'default'};

  &:hover {
    border-color: #8b5cf6;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
  }
`

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`

const QuestionHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const DragHandle = styled.div`
  cursor: grab;
  color: #9ca3af;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: color 0.2s;

  &:hover {
    color: #8b5cf6;
  }

  &:active {
    cursor: grabbing;
  }
`

const QuestionNumber = styled.div`
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
`

const QuestionActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ActionButton = styled.button`
  background: transparent;
  color: ${props => props.danger ? '#ef4444' : '#8b5cf6'};
  border: 2px solid ${props => props.danger ? '#ef4444' : '#8b5cf6'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.danger ? '#ef4444' : '#8b5cf6'};
    color: white;
  }
`

const QuestionText = styled.div`
  font-size: 1rem;
  color: #0f172a;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  font-weight: 500;

  .blank {
    display: inline-block;
    min-width: 100px;
    border-bottom: 2px solid #8b5cf6;
    margin: 0 0.25rem;
    padding: 0 0.5rem;
    font-weight: 700;
    color: #8b5cf6;
  }
`

const AnswerSection = styled.div`
  background: rgba(139, 92, 246, 0.1);
  border-left: 3px solid #8b5cf6;
  padding: 0.75rem 1rem;
  border-radius: 0 8px 8px 0;
  margin-bottom: 0.75rem;
`

const AnswerLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #8b5cf6;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  letter-spacing: 0.5px;
`

const AnswerText = styled.div`
  font-size: 0.875rem;
  color: #0f172a;
  font-weight: 600;
`

const ExplanationSection = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border-left: 3px solid #10b981;
  padding: 0.75rem 1rem;
  border-radius: 0 8px 8px 0;
`

const ExplanationLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #10b981;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  letter-spacing: 0.5px;
`

const ExplanationText = styled.div`
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.6;
`

const EditInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
  }
`

const EditTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.6;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
  }
`

const EditButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.75rem;
`

const AddQuestionButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: rgba(139, 92, 246, 0.1);
  border: 2px dashed #8b5cf6;
  border-radius: 12px;
  color: #8b5cf6;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: #7c3aed;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  padding: 1.5rem;
  border-top: 2px solid #e5e7eb;
  background: white;
  border-radius: 0 0 16px 16px;
`

const ButtonGroupLeft = styled.div`
  display: flex;
  gap: 0.75rem;
`

const ButtonGroupRight = styled.div`
  display: flex;
  gap: 0.75rem;
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(139, 92, 246, 0.5);
    }
  ` : `
    background: transparent;
    color: #6b7280;
    border: 2px solid #e5e7eb;

    &:hover:not(:disabled) {
      background: #f3f4f6;
      border-color: #d1d5db;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
  font-size: 0.875rem;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
`

// Sortable Question Item Component
function SortableQuestionItem({ question, index, isEditing, onEdit, onSave, onCancel, onDelete, onChange }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const renderQuestionText = (text, answer) => {
    const parts = text.split('____')
    return (
      <>
        {parts.map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <span className="blank">{answer}</span>
            )}
          </span>
        ))}
      </>
    )
  }

  return (
    <QuestionCard
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
    >
      <QuestionHeader>
        <QuestionHeaderLeft>
          <DragHandle {...attributes} {...listeners}>
            ⋮⋮
          </DragHandle>
          <QuestionNumber>{index + 1}</QuestionNumber>
        </QuestionHeaderLeft>
        {!isEditing && (
          <QuestionActions>
            <ActionButton onClick={() => onEdit(question)}>
              ✏️ Edit
            </ActionButton>
            <ActionButton danger onClick={() => onDelete(question.id)}>
              🗑️ Hapus
            </ActionButton>
          </QuestionActions>
        )}
      </QuestionHeader>

      {isEditing ? (
        <>
          <Label>Pertanyaan (gunakan ____ untuk blank)</Label>
          <EditTextarea
            value={question.question}
            onChange={(e) => onChange('question', e.target.value)}
            placeholder="Contoh: Jantung memiliki ____ ruang utama"
          />

          <Label>Jawaban</Label>
          <EditInput
            value={question.answer}
            onChange={(e) => onChange('answer', e.target.value)}
            placeholder="Contoh: empat"
          />

          <Label>Penjelasan</Label>
          <EditTextarea
            value={question.explanation}
            onChange={(e) => onChange('explanation', e.target.value)}
            placeholder="Jelaskan mengapa ini jawaban yang benar..."
          />

          <EditButtonGroup>
            <ActionButton onClick={onCancel}>
              Batal
            </ActionButton>
            <ActionButton onClick={onSave} style={{ background: '#8b5cf6', color: 'white' }}>
              ✓ Simpan
            </ActionButton>
          </EditButtonGroup>
        </>
      ) : (
        <>
          <QuestionText>
            {renderQuestionText(question.question, question.answer)}
          </QuestionText>

          <AnswerSection>
            <AnswerLabel>Jawaban</AnswerLabel>
            <AnswerText>{question.answer}</AnswerText>
          </AnswerSection>

          <ExplanationSection>
            <ExplanationLabel>Penjelasan</ExplanationLabel>
            <ExplanationText>{question.explanation}</ExplanationText>
          </ExplanationSection>
        </>
      )}
    </QuestionCard>
  )
}

function TopicModal({ isOpen, onClose, onSuccess, topicToEdit = null }) {
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    type: 'text',
    content: '',
    file: null,
    numberOfQuestions: 10,
    pdf_url: '',
    pdf_key: '',
    pdf_filename: ''
  })
  const [questions, setQuestions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingQuestionId, setEditingQuestionId] = useState(null)
  const [editingQuestionData, setEditingQuestionData] = useState(null)
  const { tags } = useSelector(state => state.tags)

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Prefill form when editing
  useEffect(() => {
    if (topicToEdit && isOpen) {
      setFormData({
        title: topicToEdit.title || '',
        description: topicToEdit.description || '',
        tags: topicToEdit.tags || [],
        type: topicToEdit.type || topicToEdit.contentType || 'text',
        content: topicToEdit.content || '',
        file: null,
        numberOfQuestions: 10
      })
      setQuestions(topicToEdit.questions || [])
    } else if (!topicToEdit && isOpen) {
      // Reset form when creating new
      setFormData({
        title: '',
        description: '',
        tags: [],
        type: 'text',
        content: '',
        file: null,
        numberOfQuestions: 10,
        pdf_url: '',
        pdf_key: '',
        pdf_filename: ''
      })
      setQuestions([])
    }
  }, [topicToEdit, isOpen])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      handleChange('file', file)
    } else {
      alert('Hanya file PDF yang diperbolehkan')
    }
  }

  const handleGenerateQuestions = async () => {
    // Validation
    if (formData.type === 'text' && !formData.content) {
      alert('Konten teks harus diisi untuk generate soal')
      return
    }

    if (formData.type === 'pdf' && !formData.file) {
      alert('File PDF harus diupload untuk generate soal')
      return
    }

    try {
      setIsGenerating(true)

      let generatedQuestions
      let pdfInfo = {}

      if (formData.type === 'pdf') {
        // Generate questions from PDF
        const result = await dispatch(
          generateQuestionsFromPDF(formData.file, formData.numberOfQuestions)
        )
        generatedQuestions = result.questions
        pdfInfo = {
          pdf_url: result.pdfUrl,
          pdf_key: result.pdfKey,
          pdf_filename: result.pdfFilename
        }

        // Store PDF info in form data
        setFormData(prev => ({
          ...prev,
          ...pdfInfo
        }))
      } else {
        // Generate questions from text
        generatedQuestions = await dispatch(
          generateQuestions(formData.content, formData.type, formData.numberOfQuestions)
        )
      }

      setQuestions(generatedQuestions)
    } catch (error) {
      alert('Gagal generate soal: ' + (error.message || 'Terjadi kesalahan'))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveAll = async () => {
    // Full validation before saving
    if (!formData.title) {
      alert('Judul topik harus diisi')
      return
    }

    const universityTagGroup = tags.find(tag => tag.name == "university").id
    const semesterTagGroup = tags.find(tag => tag.name == "semester").id

    const hasUniversity = formData.tags.some(tag => tag.tagGroupId === universityTagGroup)
    const hasSemester = formData.tags.some(tag => tag.tagGroupId === semesterTagGroup)

    if (!hasUniversity) {
      alert('Minimal satu universitas harus dipilih')
      return
    }

    if (!hasSemester) {
      alert('Minimal satu semester harus dipilih')
      return
    }

    // Questions must exist for both text and PDF
    if (questions.length === 0) {
      alert('Minimal satu soal harus ada. Klik "Generate Soal" terlebih dahulu.')
      return
    }

    try {
      setIsSaving(true)

      // Both text and PDF now send questions in JSON format
      const topicData = {
        title: formData.title,
        description: formData.description || '',
        contentType: formData.type,
        content: formData.type === 'text' ? formData.content : '',
        pdf_url: formData.pdfUrl || '',
        pdf_key: formData.pdfKey || '',
        pdf_filename: formData.pdfFilename || '',
        tags: formData.tags,
        questions: questions.map((q, index) => ({
          question: q.question,
          answer: q.answer,
          explanation: q.explanation,
          order: index
        }))
      }

      await dispatch(createExerciseTopic(topicData))

      alert('Topik berhasil disimpan!')

      if (onSuccess) {
        onSuccess()
      } else {
        handleCloseModal()
      }
    } catch (error) {
      alert('Gagal menyimpan topik: ' + (error.message || 'Terjadi kesalahan'))
    } finally {
      setIsSaving(false)
    }
  }

  // Drag and drop handler
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Edit handlers
  const handleEditQuestion = (question) => {
    setEditingQuestionId(question.id)
    setEditingQuestionData({ ...question })
  }

  const handleQuestionChange = (field, value) => {
    setEditingQuestionData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveEdit = () => {
    if (!editingQuestionData.question || !editingQuestionData.answer) {
      alert('Pertanyaan dan jawaban harus diisi')
      return
    }

    setQuestions(questions.map(q =>
      q.id === editingQuestionId ? editingQuestionData : q
    ))
    setEditingQuestionId(null)
    setEditingQuestionData(null)
  }

  const handleCancelEdit = () => {
    setEditingQuestionId(null)
    setEditingQuestionData(null)
  }

  const handleAddNewQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      answer: '',
      explanation: '',
      order: questions.length
    }
    setQuestions([...questions, newQuestion])
    setEditingQuestionId(newQuestion.id)
    setEditingQuestionData(newQuestion)
  }

  const handleDeleteQuestion = (questionId) => {
    if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
      setQuestions(questions.filter(q => q.id !== questionId))
    }
  }

  const handleCloseModal = () => {
    if (questions.length > 0 || formData.title || formData.content) {
      if (!confirm('Ada perubahan yang belum disimpan. Apakah Anda yakin ingin menutup?')) {
        return
      }
    }

    setFormData({
      title: '',
      description: '',
      tags: [],
      type: 'text',
      content: '',
      file: null,
      numberOfQuestions: 10,
      pdf_url: '',
      pdf_key: '',
      pdf_filename: ''
    })
    setQuestions([])
    onClose()
  }

  const renderQuestionText = (text, answer) => {
    const parts = text.split('____')
    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="blank">{answer}</span>
            )}
          </span>
        ))}
      </>
    )
  }

  return (
    <>
      <Overlay isOpen={isOpen} onClick={handleCloseModal}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              {topicToEdit ? 'Edit Topik' : 'Buat Topik Baru'}
            </ModalTitle>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
          </ModalHeader>

          <ModalBody>
            {/* FORM SECTION - Always visible */}
            <Section showBorder={true}>
              <SectionTitle>📝 Informasi Topik</SectionTitle>

              <FormGroup>
                <Label>Judul Topik *</Label>
                <Input
                  type="text"
                  placeholder="Contoh: Anatomi Jantung"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Deskripsi (Opsional)</Label>
                <Input
                  type="text"
                  placeholder="Deskripsi singkat tentang topik"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </FormGroup>

              <TagSelector
                selectedTags={formData.tags}
                onChange={(tags) => handleChange('tags', tags)}
                type="university"
                label="Universitas"
                required
              />

              <TagSelector
                selectedTags={formData.tags}
                onChange={(tags) => handleChange('tags', tags)}
                type="semester"
                label="Semester"
                required
              />

              <FormGroup>
                <Label>Tipe Input *</Label>
                <TypeSelector>
                  <TypeOption
                    type="button"
                    selected={formData.type === 'text'}
                    onClick={() => handleChange('type', 'text')}
                  >
                    <span>📝</span>
                    <span>Text</span>
                  </TypeOption>
                  <TypeOption
                    type="button"
                    selected={formData.type === 'pdf'}
                    onClick={() => handleChange('type', 'pdf')}
                  >
                    <span>📄</span>
                    <span>PDF</span>
                  </TypeOption>
                </TypeSelector>
              </FormGroup>

              {formData.type === 'text' && (
                <FormGroup>
                  <Label>Konten Materi *</Label>
                  <Textarea
                    placeholder="Masukkan materi yang akan digunakan untuk menghasilkan soal fill-in-the-blank..."
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    required
                  />
                </FormGroup>
              )}

              {formData.type === 'pdf' && (
                <FormGroup>
                  <Label>Upload PDF *</Label>
                  <FileUpload>
                    <input
                      type="file"
                      id="pdf-upload"
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="pdf-upload">
                      <div>📄</div>
                      <div style={{ marginTop: '0.5rem', color: '#6b7280' }}>
                        {formData.file ? (
                          <FileName>{formData.file.name}</FileName>
                        ) : (
                          'Klik untuk upload file PDF'
                        )}
                      </div>
                    </label>
                  </FileUpload>
                  {formData.pdfUrl && (
                    <PDFLink
                      href={formData.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>📎</span>
                      <span>Lihat PDF yang telah diupload: {formData.pdfFilename}</span>
                    </PDFLink>
                  )}
                </FormGroup>
              )}

              <FormGroup>
                <Label>Jumlah Soal yang Akan Digenerate *</Label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  placeholder="10"
                  value={formData.numberOfQuestions}
                  onChange={(e) => handleChange('numberOfQuestions', parseInt(e.target.value) || 10)}
                  required
                />
              </FormGroup>
            </Section>

            {/* QUESTIONS SECTION - Always visible */}
            <Section>
              <SectionTitle>
                ❓ Soal Generated ({questions.length} soal)
              </SectionTitle>

              {questions.length > 0 ? (
                <>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={questions.map(q => q.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <QuestionsList>
                        {questions.map((question, index) => (
                          <SortableQuestionItem
                            key={question.id}
                            question={editingQuestionId === question.id ? editingQuestionData : question}
                            index={index}
                            isEditing={editingQuestionId === question.id}
                            onEdit={handleEditQuestion}
                            onSave={handleSaveEdit}
                            onCancel={handleCancelEdit}
                            onDelete={handleDeleteQuestion}
                            onChange={handleQuestionChange}
                            renderQuestionText={renderQuestionText}
                          />
                        ))}
                      </QuestionsList>
                    </SortableContext>
                  </DndContext>

                  <div style={{ marginTop: '1rem' }}>
                    <AddQuestionButton onClick={handleAddNewQuestion}>
                      <span>➕</span>
                      Tambah Soal Manual
                    </AddQuestionButton>
                  </div>
                </>
              ) : (
                <EmptyState>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                  <div>Belum ada soal. Klik "Generate Soal" untuk membuat soal otomatis.</div>
                </EmptyState>
              )}
            </Section>
          </ModalBody>

          {/* FOOTER WITH BUTTONS */}
          <ButtonGroup>
            <ButtonGroupLeft>
              <Button
                type="button"
                onClick={handleGenerateQuestions}
                disabled={isGenerating || isSaving}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                }}
              >
                {isGenerating ? <LoadingSpinner /> : '✨ Generate Soal'}
              </Button>
            </ButtonGroupLeft>

            <ButtonGroupRight>
              <Button type="button" onClick={handleCloseModal} disabled={isGenerating || isSaving}>
                Batal
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSaveAll}
                disabled={isGenerating || isSaving || questions.length === 0}
              >
                {isSaving ? <LoadingSpinner /> : '💾 Simpan Topik'}
              </Button>
            </ButtonGroupRight>
          </ButtonGroup>
        </Modal>
      </Overlay>
    </>
  )
}

export default TopicModal
