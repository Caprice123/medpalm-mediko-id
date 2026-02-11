import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import TagSelector from '@components/common/TagSelector'
import FileUpload from '@components/common/FileUpload'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useCreateFlashcard } from '../../hooks/subhooks/useCreateFlashcard'
import {
  FormSection,
  Label,
  Input,
  Textarea,
  ContentTypeButtons,
  ContentTypeButton,
  CardsSection,
  CardsSectionHeader,
  CardsSectionTitle,
  FlashcardCard,
  CardHeader,
  CardNumber,
  DragHandle,
  ErrorText,
  StatusToggle,
  StatusOption,
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

  return (
    <FlashcardCard ref={setNodeRef} style={style} isDragging={isDragging}>
      <CardHeader>
        <CardNumber>
          <DragHandle {...attributes} {...listeners}>⋮⋮</DragHandle>
          Card {index + 1}
        </CardNumber>
        <Button variant="danger" size="small" onClick={() => handleRemoveCard(index)}>
          Remove
        </Button>
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

  const {
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
} = useCreateFlashcard(onClose)

  // Get tags from all tag groups - memoized
  const topicTags = useMemo(() =>
    tags.find(t => t.name === 'topic')?.tags || [],
    [tags]
  )
  const departmentTags = useMemo(() =>
    tags.find(t => t.name === 'department')?.tags || [],
    [tags]
  )
  const universityTags = useMemo(() =>
    tags.find(t => t.name === 'university')?.tags || [],
    [tags]
  )
  const semesterTags = useMemo(() =>
    tags.find(t => t.name === 'semester')?.tags || [],
    [tags]
  )

  // Handlers for tag changes
  const handleTopicTagsChange = (newTags) => {
    form.setFieldValue('topicTags', newTags)
  }

  const handleDepartmentTagsChange = (newTags) => {
    form.setFieldValue('departmentTags', newTags)
  }

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
          <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
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

      {/* Topic Tags */}
      <FormSection>
        <Label>Topik</Label>
        <TagSelector
          allTags={topicTags}
          selectedTags={form.values.topicTags || []}
          onTagsChange={handleTopicTagsChange}
          placeholder="-- Pilih Topik --"
          helpText="Pilih topik medis untuk membantu mengorganisir deck"
        />
      </FormSection>

      {/* Department Tags */}
      <FormSection>
        <Label>Departemen</Label>
        <TagSelector
          allTags={departmentTags}
          selectedTags={form.values.departmentTags || []}
          onTagsChange={handleDepartmentTagsChange}
          placeholder="-- Pilih Departemen --"
          helpText="Pilih departemen untuk membantu mengorganisir deck"
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
            isActive={form.values.contentType === 'document'}
            onClick={() => form.setFieldValue('contentType', 'document')}
          >
            📄 Document (PDF)
          </ContentTypeButton>
          <ContentTypeButton
            type="button"
            isActive={form.values.contentType === 'text'}
            onClick={() => form.setFieldValue('contentType', 'text')}
          >
            📝 Text Content
          </ContentTypeButton>
        </ContentTypeButtons>

        {form.values.contentType === 'document' ? (
          <FileUpload
            file={form.values.pdfFile ? {
              name: form.values.pdfFile.name,
              type: form.values.pdfFile.type,
              size: form.values.pdfFile.size
            } : null}
            onFileSelect={handleFileSelect}
            onRemove={() => {
              form.setFieldValue('pdfFile', null)
              form.setFieldValue('uploadedBlobId', null)
            }}
            isUploading={isGenerating}
            acceptedTypes={['application/pdf']}
            acceptedTypesLabel="PDF file"
            maxSizeMB={20}
            uploadText="Klik untuk upload PDF"
            actions={
              <>
                {form.values.pdfFile && (
                    <Button
                    variant="primary"
                    size="small"
                    onClick={() => {
                        // Check if it's a File object or just an object with URL
                        const url = form.values.pdfFile instanceof File
                        ? URL.createObjectURL(form.values.pdfFile)
                        : form.values.pdfFile.url
                        window.open(url, '_blank')
                    }}
                    >
                    Lihat
                    </Button>
                )}
              </>
            }
          />
        ) : (
          <FormSection>
            <Textarea
              value={form.values.textContent}
              onChange={(e) => form.setFieldValue('textContent', e.target.value)}
              placeholder="Paste your medical study material here..."
            />
            <HelpText>Masukkan konten yang ingin di-generate menjadi soal</HelpText>
          </FormSection>
        )}
      </FormSection>

      <FormSection>
        <Label>Number of Cards</Label>
        <Input
          type="number"
          value={form.values.cardCount}
          onChange={(e) => form.setFieldValue('cardCount', parseInt(e.target.value))}
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
          <Button variant="primary" size="small" onClick={handleAddCard}>
            + Add Card
          </Button>
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
