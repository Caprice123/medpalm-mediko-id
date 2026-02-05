import { useState, useMemo, useEffect, useCallback } from 'react'
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

  // Local state for top-level inputs to prevent lag
  const [localTitle, setLocalTitle] = useState('')
  const [localDescription, setLocalDescription] = useState('')
  const [localFormula, setLocalFormula] = useState('')
  const [localResultLabel, setLocalResultLabel] = useState('')
  const [localResultUnit, setLocalResultUnit] = useState('')

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

  // Sync local state with formData
  useEffect(() => {
    setLocalTitle(formData.title)
    setLocalDescription(formData.description)
    setLocalFormula(formData.formula)
    setLocalResultLabel(formData.result_label)
    setLocalResultUnit(formData.result_unit)
  }, [formData.title, formData.description, formData.formula, formData.result_label, formData.result_unit])

  // Memoized handlers for BasicInfoSection
  const handleTitleChange = useCallback((e) => setLocalTitle(e.target.value), [])
  const handleDescriptionChange = useCallback((e) => setLocalDescription(e.target.value), [])

  // Memoized handlers for FormulaSection
  const handleFormulaChange = useCallback((e) => setLocalFormula(e.target.value), [])
  const handleResultLabelChange = useCallback((e) => setLocalResultLabel(e.target.value), [])
  const handleResultUnitChange = useCallback((e) => setLocalResultUnit(e.target.value), [])

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
                localTitle={localTitle}
                localDescription={localDescription}
                selectedTags={selectedTags}
                categoryTags={categoryTags}
                errors={errors}
                onTitleChange={handleTitleChange}
                onTitleBlur={handleFieldChange}
                onDescriptionChange={handleDescriptionChange}
                onDescriptionBlur={handleFieldChange}
                onTagsChange={handleTagsChange}
              />

              {/* Step 2: Result Configuration & Formula */}
              <FormulaSection
                localFormula={localFormula}
                localResultLabel={localResultLabel}
                localResultUnit={localResultUnit}
                errors={errors}
                onFormulaChange={handleFormulaChange}
                onFormulaBlur={handleFieldChange}
                onResultLabelChange={handleResultLabelChange}
                onResultLabelBlur={handleFieldChange}
                onResultUnitChange={handleResultUnitChange}
                onResultUnitBlur={handleFieldChange}
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
              <ClassificationsSection>
                <SectionTitle>Classifications</SectionTitle>

                {formData.classifications && formData.classifications.length > 0 && (
                  <ClassificationsList>
                    {formData.classifications.map((classification, classIndex) => {
                      const isClassificationExpanded = expandedClassifications[classIndex]
                      return (
                      <ClassificationItem key={classIndex}>
                        {/* Classification Header - Purple Theme - Accordion */}
                        <div
                          onClick={() => toggleClassification(classIndex)}
                          style={{
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          marginBottom: isClassificationExpanded ? '1rem' : '0.5rem',
                          border: '2px solid rgba(139, 92, 246, 0.3)',
                          boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}>
                          <div style={{ fontSize: '1rem', color: '#7c3aed', fontWeight: 700 }}>
                            {isClassificationExpanded ? '▼' : '▶'}
                          </div>
                          <div style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
                            <TextInput
                              type="text"
                              value={classification.name}
                              onChange={(e) => handleClassificationChange(classIndex, 'name', e.target.value)}
                              placeholder="Kategori BMI"
                              style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}
                            />
                          </div>
                          <Button
                            variant="danger"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeClassification(classIndex)
                            }}
                          >
                            ✕
                          </Button>
                        </div>

                        {/* Rules Section - Collapsible */}
                        {isClassificationExpanded && <div>
                          <ClassificationOptionsList>
                            {classification.options && classification.options.map((option, optIndex) => {
                              const isExpanded = expandedOptions[`${classIndex}-${optIndex}`]
                              return (
                              <ClassificationOptionItem key={optIndex}>
                                {/* Rule Header - Clickable to toggle */}
                                <div
                                  onClick={() => toggleOption(classIndex, optIndex)}
                                  style={{
                                  background: 'rgba(139, 92, 246, 0.05)',
                                  padding: '0.75rem',
                                  borderRadius: '6px',
                                  marginBottom: isExpanded ? '0.75rem' : '0',
                                  border: '1px solid rgba(139, 92, 246, 0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}>
                                  <div style={{ fontSize: '0.9rem', color: '#8b5cf6', fontWeight: 600 }}>
                                    {isExpanded ? '▼' : '▶'}
                                  </div>
                                  <div style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
                                    <TextInput
                                      type="text"
                                      value={option.label || option.value}
                                      onChange={(e) => {
                                        const val = e.target.value
                                        handleClassificationOptionChange(classIndex, optIndex, 'value', val)
                                        handleClassificationOptionChange(classIndex, optIndex, 'label', val)
                                      }}
                                      placeholder="Underweight"
                                    />
                                  </div>
                                  <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeClassificationOption(classIndex, optIndex)
                                    }}
                                  >
                                    ✕
                                  </Button>
                                </div>

                                {/* Conditions - Collapsible */}
                                {isExpanded && <div>
                                  <SubLabel style={{ fontSize: '0.8rem' }}>Kondisi untuk "{option.label || option.value || 'klasifikasi ini'}"</SubLabel>
                                  <HelpText style={{ marginTop: '0.25rem', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                                    Kondisi terakhir otomatis tanpa logical operator (null). Gunakan AND jika semua harus terpenuhi, OR jika salah satu saja.
                                  </HelpText>

                                  <ConditionsList>
                                    {option.conditions && option.conditions.map((condition, condIndex) => {
                                      const isLastCondition = condIndex === option.conditions.length - 1
                                      return (
                                        <StyledConditionItem key={condIndex}>
                                          <TextInput
                                            type="text"
                                            value={condition.result_key}
                                            onChange={(e) => handleConditionChange(classIndex, optIndex, condIndex, 'result_key', e.target.value)}
                                            placeholder="result"
                                            title="Key yang dicek (result/field key)"
                                          />
                                          <Dropdown
                                            options={[
                                              { value: '>', label: '>' },
                                              { value: '<', label: '<' },
                                              { value: '>=', label: '>=' },
                                              { value: '<=', label: '<=' },
                                              { value: '==', label: '==' },
                                              { value: '!=', label: '!=' }
                                            ]}
                                            value={{ value: condition.operator, label: condition.operator }}
                                            onChange={(option) => handleConditionChange(classIndex, optIndex, condIndex, 'operator', option.value)}
                                          />
                                          <TextInput
                                            type="number"
                                            value={condition.value}
                                            onChange={(e) => handleConditionChange(classIndex, optIndex, condIndex, 'value', e.target.value)}
                                            placeholder="18.5"
                                            step="0.01"
                                          />
                                          {!isLastCondition && (
                                            <Dropdown
                                              options={[
                                                { value: 'AND', label: 'AND' },
                                                { value: 'OR', label: 'OR' }
                                              ]}
                                              value={{
                                                value: condition.logical_operator || 'AND',
                                                label: condition.logical_operator || 'AND'
                                              }}
                                              onChange={(option) => handleConditionChange(classIndex, optIndex, condIndex, 'logical_operator', option.value)}
                                            />
                                          )}
                                          {isLastCondition && (
                                            <div style={{
                                              fontSize: '0.7rem',
                                              color: '#8b5cf6',
                                              textAlign: 'center',
                                              padding: '0.5rem',
                                              background: 'rgba(139, 92, 246, 0.1)',
                                              borderRadius: '4px',
                                              fontWeight: 600,
                                              border: '1px solid rgba(139, 92, 246, 0.3)'
                                            }}>
                                              null
                                            </div>
                                          )}
                                          <Button
                                            variant="secondary"
                                            type="button"
                                            onClick={() => removeCondition(classIndex, optIndex, condIndex)}
                                          >
                                            ✕
                                          </Button>
                                        </StyledConditionItem>
                                      )
                                    })}
                                  </ConditionsList>

                                  {option.conditions && option.conditions.length > 0 && (
                                    <ExampleBox style={{ marginTop: '0.5rem', fontSize: '0.7rem', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                      <strong style={{ color: '#8b5cf6' }}>Akan aktif jika:</strong> {option.conditions.map((c, i) => (
                                        <span key={i}>
                                          {c.result_key} {c.operator} {c.value}
                                          {i < option.conditions.length - 1 && <strong style={{ color: '#8b5cf6' }}> {c.logical_operator} </strong>}
                                        </span>
                                      ))}
                                    </ExampleBox>
                                  )}

                                  <Button
                                    variant="outline"
                                    fullWidth
                                    type="button"
                                    onClick={() => addCondition(classIndex, optIndex)}
                                    style={{
                                      marginTop: '0.5rem',
                                      fontSize: '0.75rem',
                                      padding: '0.5rem',
                                      background: 'rgba(139, 92, 246, 0.1)',
                                      borderColor: '#8b5cf6'
                                    }}
                                  >
                                    + Tambah Kondisi
                                  </Button>
                                </div>}
                              </ClassificationOptionItem>
                            )
                            })}
                          </ClassificationOptionsList>
                          <Button
                            variant="outline"
                            fullWidth
                            type="button"
                            onClick={() => addClassificationOption(classIndex)}
                            style={{ marginTop: '0.75rem' }}
                          >
                            + Tambah Jenis Klasifikasi
                          </Button>
                        </div>}
                      </ClassificationItem>
                    )
                    })}
                  </ClassificationsList>
                )}

                <Button variant="outline" fullWidth type="button" onClick={addClassification}>
                  + Tambah Grup Klasifikasi
                </Button>
              </ClassificationsSection>

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
