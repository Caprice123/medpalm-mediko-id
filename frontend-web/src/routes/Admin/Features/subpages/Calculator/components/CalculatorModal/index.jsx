import { useState, useMemo, useCallback } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useCalculatorModal } from './useCalculatorModal'
import Dropdown from '@components/common/Dropdown'
import TagSelector from '@components/common/TagSelector'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Button from '@components/common/Button'
import FileUpload from '@components/common/FileUpload'
import { FieldItem } from './components/FieldItem'
import { ClassificationSection } from './components/ClassificationSection'
import { BasicInfoSection } from './components/BasicInfoSection'
import { FormulaSection } from './components/FormulaSection'
import { StatusSection } from './components/StatusSection'
import { ClinicalReferencesSection } from './components/ClinicalReferencesSection'
import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FormGroup,
  FormLabel,
  FormRow,
  HelpText,
  ErrorMessage,
  FieldsSection,
  SectionTitle,
  FieldsList,
  FieldItem as StyledFieldItem,
  DragHandle,
  FieldItemContent,
  FieldInputWrapper,
  SmallLabel,
  OptionsList,
  OptionItem as StyledOptionItem,
  ClassificationsSection,
  ClassificationsList,
  ClassificationItem,
  ClassificationHeader,
  ClassificationOptionsList,
  ClassificationOptionItem,
  OptionHeader,
  ConditionsList,
  ConditionItem as StyledConditionItem,
  SubLabel,
  ModalFooter,
  ConfirmOverlay,
  ConfirmDialog,
  ConfirmIcon,
  ConfirmTitle,
  ConfirmMessage,
  ConfirmActions,
  StepIndicator,
  StepNumber,
  StepText,
  InfoBox,
  InfoIcon,
  InfoText,
  ExampleBox,
  ReferencesList,
  ReferenceItem,
  ReferenceText,
  AddReferenceWrapper
} from './CalculatorModal.styles'

function CalculatorModal({ isOpen, onClose, calculator, onSuccess }) {
  const [expandedOptions, setExpandedOptions] = useState({})
  const [expandedClassifications, setExpandedClassifications] = useState({})

  // Setup drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const toggleOption = (classIndex, optIndex) => {
    const key = `${classIndex}-${optIndex}`
    setExpandedOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const toggleClassification = (classIndex) => {
    setExpandedClassifications(prev => ({
      ...prev,
      [classIndex]: !prev[classIndex]
    }))
  }

  const {
    formData,
    setFormData,
    errors,
    showConfirmClose,
    loading,
    newReference,
    setNewReference,
    addClinicalReference,
    removeClinicalReference,
    selectedTags,
    categoryTags,
    handleTagsChange,
    handleFieldChange,
    handleFieldItemChange,
    addField,
    removeField,
    handleDragEnd,
    addFieldOption,
    removeFieldOption,
    handleFieldOptionChange,
    handleOptionImageUpload,
    handleOptionImageRemove,
    addDisplayCondition,
    removeDisplayCondition,
    handleDisplayConditionChange,
    addClassification,
    removeClassification,
    handleClassificationChange,
    addClassificationOption,
    removeClassificationOption,
    handleClassificationOptionChange,
    addCondition,
    removeCondition,
    handleConditionChange,
    handleSubmit,
    handleClose,
    handleConfirmClose,
    handleCancelClose
  } = useCalculatorModal({ isOpen, calculator, onSuccess, onClose })

  // Memoize field IDs to prevent recreating array on every render
  const fieldIds = useMemo(() => formData.fields.map(f => f._id), [formData.fields])

  // Memoized handlers for ClinicalReferencesSection
  const handleReferenceChange = useCallback((index, value) => {
    setFormData(prev => {
      const updated = [...prev.clinical_references];
      updated[index] = value;
      return { ...prev, clinical_references: updated };
    });
  }, [setFormData])

  const handleRemoveReference = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      clinical_references: prev.clinical_references.filter((_, i) => i !== index)
    }));
  }, [setFormData])

  const handleAddReference = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      clinical_references: [...prev.clinical_references, '']
    }));
  }, [setFormData])

  if (!isOpen) return null

  return (
    <>
      <Overlay isOpen={isOpen} onClick={handleClose}>
        <Modal onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              {calculator ? 'Edit Calculator' : 'Create Calculator'}
            </ModalTitle>
            <CloseButton onClick={handleClose}>×</CloseButton>
          </ModalHeader>

          <ModalBody>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              <BasicInfoSection
                title={formData.title}
                description={formData.description}
                selectedTags={selectedTags}
                categoryTags={categoryTags}
                errors={errors}
                onFieldChange={handleFieldChange}
                onTagsChange={handleTagsChange}
              />

              {/* Step 2: Result Configuration & Formula */}
              <FormulaSection
                formula={formData.formula}
                resultLabel={formData.result_label}
                resultUnit={formData.result_unit}
                errors={errors}
                onFieldChange={handleFieldChange}
              />

              {/* Step 3: Input Fields */}
              <FieldsSection>
                <SectionTitle>Input Fields *</SectionTitle>
                {errors.fields && <ErrorMessage>{errors.fields}</ErrorMessage>}

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={fieldIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <FieldsList>
                      {formData.fields.map((field, index) => (
                        <FieldItem
                          key={field._id || index}
                          field={field}
                          index={index}
                          errors={errors}
                          fields={field.display_conditions?.length > 0 ? formData.fields : []}
                          onFieldItemChange={handleFieldItemChange}
                          onRemoveField={removeField}
                          onAddFieldOption={addFieldOption}
                          onRemoveFieldOption={removeFieldOption}
                          onFieldOptionChange={handleFieldOptionChange}
                          onOptionImageUpload={handleOptionImageUpload}
                          onOptionImageRemove={handleOptionImageRemove}
                          onAddDisplayCondition={addDisplayCondition}
                          onRemoveDisplayCondition={removeDisplayCondition}
                          onDisplayConditionChange={handleDisplayConditionChange}
                        />
                      ))}
                    </FieldsList>
                  </SortableContext>
                </DndContext>

                <Button variant="outline" fullWidth type="button" onClick={addField}>
                  + Tambah Field Baru
                </Button>
              </FieldsSection>

              {/* Step 5: Classifications (Optional) */}
              <ClassificationSection
                classifications={formData.classifications}
                expandedOptions={expandedOptions}
                expandedClassifications={expandedClassifications}
                onToggleOption={toggleOption}
                onToggleClassification={toggleClassification}
                onAddClassification={addClassification}
                onRemoveClassification={removeClassification}
                onClassificationChange={handleClassificationChange}
                onAddClassificationOption={addClassificationOption}
                onRemoveClassificationOption={removeClassificationOption}
                onClassificationOptionChange={handleClassificationOptionChange}
                onAddCondition={addCondition}
                onRemoveCondition={removeCondition}
                onConditionChange={handleConditionChange}
              />

              {/* Step 6: Status */}
              <StatusSection
                status={formData.status}
                onFieldChange={handleFieldChange}
              />


              {/* Clinical References Section */}
              <ClinicalReferencesSection
                clinicalReferences={formData.clinical_references}
                onReferenceChange={(index, value) => {
                  setFormData(prev => {
                    const updated = [...prev.clinical_references];
                    updated[index] = value;
                    return { ...prev, clinical_references: updated };
                  });
                }}
                onRemoveReference={(index) => {
                  setFormData(prev => ({
                    ...prev,
                    clinical_references: prev.clinical_references.filter((_, i) => i !== index)
                  }));
                }}
                onAddReference={() => {
                  setFormData(prev => ({
                    ...prev,
                    clinical_references: [...prev.clinical_references, '']
                  }));
                }}
              />
            </form>
          </ModalBody>

          <ModalFooter>
            <Button type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Menyimpan...' : calculator ? 'Update Calculator' : 'Create Calculator'}
            </Button>
          </ModalFooter>
        </Modal>
      </Overlay>

      {/* Confirmation Dialog for unsaved changes */}
      <ConfirmOverlay isOpen={showConfirmClose} onClick={handleCancelClose}>
        <ConfirmDialog onClick={e => e.stopPropagation()}>
          <ConfirmIcon>⚠️</ConfirmIcon>
          <ConfirmTitle>Konfirmasi Keluar</ConfirmTitle>
          <ConfirmMessage>
            Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin keluar? Semua perubahan akan hilang.
          </ConfirmMessage>
          <ConfirmActions>
            <Button onClick={handleCancelClose}>
              Batalkan
            </Button>
            <Button variant="danger" onClick={handleConfirmClose}>
              Ya, Keluar
            </Button>
          </ConfirmActions>
        </ConfirmDialog>
      </ConfirmOverlay>
    </>
  )
}

export default CalculatorModal
