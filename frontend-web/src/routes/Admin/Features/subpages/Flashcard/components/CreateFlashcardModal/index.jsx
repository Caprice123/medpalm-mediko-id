import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import TagSelector from '@components/common/TagSelector'
import FileUpload from '@components/common/FileUpload'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useCreateFlashcard } from '../../hooks/subhooks/useCreateFlashcard'
import { useGenerateFlashcard } from '../../hooks/subhooks/useGenerateFlashcard'
import { formatFileSize } from '@utils/fileUtils'
import {
  FormSection,
  FormRow,
  Label,
  Input,
  Textarea,
  ContentTypeButtons,
  ContentTypeButton,
  RemoveFileButton,
  CardsSection,
  CardsSectionHeader,
  CardsSectionTitle,
  AddCardButton,
  FlashcardCard,
  CardHeader,
  CardNumber,
  DragHandle,
  RemoveCardButton,
  ErrorText,
  StatusToggle,
  StatusOption,
  Button,
  HelpText
} from './CreateFlashcardModal.styles'

const SortableCard = ({ card, index, form, handleRemoveCard, handleImageUpload }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card.tempId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        handleImageUpload(index, file)
      } else {
        alert('Please select an image file')
      }
    }
  }

  return (
    <FlashcardCard ref={setNodeRef} style={style} isDragging={isDragging}>
      <CardHeader>
        <CardNumber>
          <DragHandle {...attributes} {...listeners}>⋮⋮</DragHandle>
          Card {index + 1}
        </CardNumber>
        <RemoveCardButton type="button" onClick={() => handleRemoveCard(index)}>
          Remove
        </RemoveCardButton>
      </CardHeader>

      <FormSection>
        <Label>Front (Question) *</Label>
        <Textarea
          value={card.front || ''}
          onChange={(e) => form.setFieldValue(`cards.${index}.front`, e.target.value)}
          placeholder="Enter the question or term..."
          style={{ minHeight: '80px' }}
        />
        {form.errors.cards?.[index]?.front && (
          <ErrorText>{form.errors.cards[index].front}</ErrorText>
        )}
      </FormSection>

      {/* Image Upload */}
      <FormSection>
        <Label>Image (Optional)</Label>
        <FileUpload
          file={card.image?.key ? {
            name: card.image?.filename || 'Image',
            type: 'image/*',
            size: card.image?.byteSize
          } : null}
          onFileSelect={(e) => {
            const file = e.target?.files?.[0] || e
            if (file) {
              if (file.type.startsWith('image/')) {
                handleImageUpload(index, file)
              } else {
                alert('Please select an image file')
              }
            }
          }}
          onRemove={() => form.setFieldValue(`cards.${index}.image`, null)}
          acceptedTypes={['image/*']}
          acceptedTypesLabel="PNG, JPG, GIF"
          maxSizeMB={5}
          uploadText="Klik untuk upload gambar"
          actions={<></>}
        />
      </FormSection>

      <FormSection>
        <Label>Back (Answer) *</Label>
        <Textarea
          value={card.back || ''}
          onChange={(e) => form.setFieldValue(`cards.${index}.back`, e.target.value)}
          placeholder="Enter the answer or definition..."
          style={{ minHeight: '80px' }}
        />
        {form.errors.cards?.[index]?.back && (
          <ErrorText>{form.errors.cards[index].back}</ErrorText>
        )}
      </FormSection>
    </FlashcardCard>
  )
}

const CreateFlashcardModal = ({ onClose }) => {
  const { loading } = useSelector(state => state.flashcard)
  const { tags } = useSelector(state => state.tags)

  const { form, sensors, handleAddCard, handleRemoveCard, handleDragEnd, handleImageUpload, setPdfInfo } = useCreateFlashcard(onClose)

  const {
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
    isGenerating
  } = useGenerateFlashcard(form, setPdfInfo)

  // Get tags from both university and semester groups - memoized
  const universityTags = useMemo(() =>
    tags.find(t => t.name === 'university')?.tags || [],
    [tags]
  )
  const semesterTags = useMemo(() =>
    tags.find(t => t.name === 'semester')?.tags || [],
    [tags]
  )

  // Handlers for tag changes
  const handleUniversityTagsChange = (newTags) => {
    form.setFieldValue('universityTags', newTags)
  }

  const handleSemesterTagsChange = (newTags) => {
    form.setFieldValue('semesterTags', newTags)
  }

  const handleModalClose = () => {
    if (onClose) onClose()
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleModalClose}
      title="Create Flashcard Deck"
      size="large"
      footer={
        <>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={form.handleSubmit}
            disabled={loading.isCreatingDeck}
          >
            {loading.isCreatingDeck ? 'Creating...' : 'Create Deck'}
          </Button>
        </>
      }
    >
      <FormSection>
        <Label>Title *</Label>
        <Input
          type="text"
          value={form.values.title}
          onChange={(e) => form.setFieldValue('title', e.target.value)}
          placeholder="e.g., Sistem Kardiovaskular"
        />
        {form.errors.title && <ErrorText>{form.errors.title}</ErrorText>}
      </FormSection>

      <FormSection>
        <Label>Description</Label>
        <Textarea
          value={form.values.description}
          onChange={(e) => form.setFieldValue('description', e.target.value)}
          placeholder="Brief description of this flashcard deck"
        />
      </FormSection>

      {/* University Tags */}
      <FormSection>
        <Label>Universitas</Label>
        <TagSelector
          allTags={universityTags}
          selectedTags={form.values.universityTags}
          onTagsChange={handleUniversityTagsChange}
          placeholder="-- Pilih Universitas --"
          helpText="Pilih universitas untuk membantu mengorganisir deck"
        />
      </FormSection>

      {/* Semester Tags */}
      <FormSection>
        <Label>Semester</Label>
        <TagSelector
          allTags={semesterTags}
          selectedTags={form.values.semesterTags || []}
          onTagsChange={handleSemesterTagsChange}
          placeholder="-- Pilih Semester --"
          helpText="Pilih semester untuk membantu mengorganisir deck"
        />
      </FormSection>

      {/* AI Generation Section */}
      <FormSection>
        <Label>Generate dari AI (Opsional)</Label>
        <ContentTypeButtons>
          <ContentTypeButton
            type="button"
            isActive={contentType === 'document'}
            onClick={() => setContentType('document')}
          >
            📄 Document (PDF)
          </ContentTypeButton>
          <ContentTypeButton
            type="button"
            isActive={contentType === 'text'}
            onClick={() => setContentType('text')}
          >
            📝 Text Content
          </ContentTypeButton>
        </ContentTypeButtons>

        {contentType === 'document' ? (
          <FileUpload
            file={pdfFile ? {
              name: pdfFile.name,
              type: pdfFile.type,
              size: pdfFile.size
            } : null}
            onFileSelect={handleFileSelect}
            onRemove={() => setPdfFile(null)}
            isUploading={isGenerating}
            acceptedTypes={['application/pdf']}
            acceptedTypesLabel="PDF file"
            maxSizeMB={20}
            uploadText="Klik untuk upload PDF"
            actions={
              <>
                {pdfFile && (
                  <RemoveFileButton
                    onClick={() => {
                      const url = URL.createObjectURL(pdfFile)
                      window.open(url, '_blank')
                    }}
                    style={{ backgroundColor: '#3b82f6', color: 'white' }}
                  >
                    Lihat
                  </RemoveFileButton>
                )}
              </>
            }
          />
        ) : (
          <FormSection>
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste your medical study material here..."
              style={{ minHeight: '150px' }}
            />
            <HelpText>Masukkan konten yang ingin di-generate menjadi flashcard</HelpText>
          </FormSection>
        )}
      </FormSection>

      <FormSection>
        <Label>Number of Cards</Label>
        <Input
          type="number"
          value={cardCount}
          onChange={(e) => setCardCount(parseInt(e.target.value) || 10)}
        />
        <HelpText>Pilih antara 1-50 kartu</HelpText>
      </FormSection>

      <FormSection>
        <Button
          type="button"
          variant="primary"
          onClick={handleGenerate}
          disabled={isGenerating || !canGenerate}
          style={{ width: '100%', padding: '0.875rem 1.5rem', fontSize: '0.9375rem' }}
        >
          {isGenerating ? 'Generating...' : '✨ Generate Cards'}
        </Button>
      </FormSection>

      <CardsSection>
        <CardsSectionHeader>
          <CardsSectionTitle>Cards</CardsSectionTitle>
          <AddCardButton type="button" onClick={handleAddCard}>
            + Add Card
          </AddCardButton>
        </CardsSectionHeader>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={(form.values.cards || []).map(card => card.tempId)}
            strategy={verticalListSortingStrategy}
          >
            {(form.values.cards || []).map((card, index) => (
              <SortableCard
                key={card.tempId}
                card={card}
                index={index}
                form={form}
                handleRemoveCard={handleRemoveCard}
                handleImageUpload={handleImageUpload}
              />
            ))}
          </SortableContext>
        </DndContext>
      </CardsSection>

      <StatusToggle>
        <StatusOption>
          <input
            type="radio"
            name="status"
            value="draft"
            checked={form.values.status === 'draft'}
            onChange={(e) => form.setFieldValue('status', e.target.value)}
          />
          Save as Draft
        </StatusOption>
        <StatusOption>
          <input
            type="radio"
            name="status"
            value="published"
            checked={form.values.status === 'published'}
            onChange={(e) => form.setFieldValue('status', e.target.value)}
          />
          Publish Now
        </StatusOption>
      </StatusToggle>
    </Modal>
  )
}

export default CreateFlashcardModal
