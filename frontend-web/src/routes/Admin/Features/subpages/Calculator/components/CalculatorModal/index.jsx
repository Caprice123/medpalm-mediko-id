import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
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
import { ResultsSection } from './components/ResultsSection'
import { ClassificationSection } from './components/ClassificationSection'
import { BasicInfoSection } from './components/BasicInfoSection'
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
  AccordionHeader,
  AccordionBody,
  AccordionChevron,
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
  AddReferenceWrapper,
  EditorModeTabs,
  EditorModeTab,
  JsonEditorWrapper,
  JsonTextarea,
  JsonError,
  JsonHint
} from './CalculatorModal.styles'

// Serialize formData → clean JSON (all structural fields, no internal IDs/blobs)
function formDataToJson(data) {
  return JSON.stringify({
    title: data.title || '',
    description: data.description || '',
    status: data.status || 'draft',
    clinical_references: data.clinical_references || [],
    tags: (data.tags || []).map(t => typeof t === 'object' ? { id: t.id, name: t.name } : t),
    fields: (data.fields || []).map(({ _id, image, ...rest }) => ({
      ...rest,
      options: (rest.options || []).map(({ image: _img, ...o }) => o),
      display_conditions: rest.display_conditions || []
    })),
    results: (data.results || []).map(({ _id, ...rest }) => ({
      ...rest,
      conditional_formulas: rest.conditional_formulas || []
    })),
    classifications: data.classifications || []
  }, null, 2)
}

// Parse JSON → partial formData (adds internal _id, ensures required shape)
function jsonToFormData(text) {
  const p = JSON.parse(text)
  return {
    title: p.title ?? '',
    description: p.description ?? '',
    status: p.status ?? 'draft',
    clinical_references: p.clinical_references ?? [],
    tags: p.tags ?? [],
    fields: (p.fields || []).map(f => ({
      _id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      key: f.key ?? '',
      type: f.type ?? 'number',
      label: f.label ?? '',
      placeholder: f.placeholder ?? '',
      description: f.description ?? '',
      unit: f.unit ?? '',
      display_conditions: f.display_conditions ?? [],
      is_required: f.is_required !== undefined ? f.is_required : true,
      options: f.options ?? [],
      image: null
    })),
    results: (p.results || []).map(r => ({
      _id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      key: r.key ?? '',
      formula: r.formula ?? '',
      result_label: r.result_label ?? '',
      result_unit: r.result_unit ?? '',
      conditional_formulas: r.conditional_formulas ?? []
    })),
    classifications: p.classifications ?? []
  }
}

function CalculatorModal({ isOpen, onClose, calculator, onSuccess }) {
  const [expandedOptions, setExpandedOptions] = useState({})
  const [expandedClassifications, setExpandedClassifications] = useState({})
  const [fieldsOpen, setFieldsOpen] = useState(true)
  const [resultsOpen, setResultsOpen] = useState(true)
  const [classificationsOpen, setClassificationsOpen] = useState(true)

  // JSON editor state
  const [editorMode, setEditorMode] = useState('visual')
  const [jsonText, setJsonText] = useState('')
  const [jsonError, setJsonError] = useState('')
  const pendingJsonSync = useRef(0)

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
    setExpandedOptions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleClassification = (classIndex) => {
    setExpandedClassifications(prev => ({ ...prev, [classIndex]: !prev[classIndex] }))
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
    handleFieldImageUpload,
    handleFieldImageRemove,
    addDisplayCondition,
    removeDisplayCondition,
    handleDisplayConditionChange,
    addResult,
    removeResult,
    handleResultChange,
    addConditionalFormula,
    removeConditionalFormula,
    handleConditionalFormulaChange,
    addCFCondition,
    removeCFCondition,
    handleCFConditionChange,
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

  // Sync formData → jsonText (when visual edits happen, not when JSON caused the change)
  useEffect(() => {
    if (pendingJsonSync.current > 0) {
      pendingJsonSync.current--
      return
    }
    setJsonText(formDataToJson(formData))
    setJsonError('')
  }, [formData])

  const handleJsonChange = useCallback((value) => {
    setJsonText(value)
    try {
      const update = jsonToFormData(value)
      pendingJsonSync.current++
      setFormData(() => update)
      setJsonError('')
    } catch (e) {
      setJsonError(e.message)
    }
  }, [setFormData])

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
            <EditorModeTabs>
              <EditorModeTab $active={editorMode === 'visual'} type="button" onClick={() => setEditorMode('visual')}>
                Visual
              </EditorModeTab>
              <EditorModeTab $active={editorMode === 'json'} type="button" onClick={() => setEditorMode('json')}>
                JSON
              </EditorModeTab>
            </EditorModeTabs>

            {editorMode === 'json' && (
              <JsonEditorWrapper>
                <JsonHint>Edit langsung dalam format JSON. Perubahan otomatis tersinkron ke form Visual.</JsonHint>
                <JsonTextarea
                  value={jsonText}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  $hasError={!!jsonError}
                  spellCheck={false}
                />
                {jsonError && <JsonError>⚠ {jsonError}</JsonError>}
              </JsonEditorWrapper>
            )}

            <form onSubmit={handleSubmit} style={{ display: editorMode === 'json' ? 'none' : 'block' }}>
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

              {/* Step 2: Input Fields */}
              <FieldsSection>
                <AccordionHeader onClick={() => setFieldsOpen(o => !o)}>
                  <SectionTitle>Input Fields * {formData.fields.length > 0 && `(${formData.fields.length})`}</SectionTitle>
                  <AccordionChevron $isOpen={fieldsOpen}>▼</AccordionChevron>
                </AccordionHeader>
                {fieldsOpen && (
                  <AccordionBody>
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
                              onFieldImageUpload={handleFieldImageUpload}
                              onFieldImageRemove={handleFieldImageRemove}
                              onAddDisplayCondition={addDisplayCondition}
                              onRemoveDisplayCondition={removeDisplayCondition}
                              onDisplayConditionChange={handleDisplayConditionChange}
                            />
                          ))}
                        </FieldsList>
                      </SortableContext>
                    </DndContext>
                    <Button variant="outline" fullWidth type="button" onClick={addField} style={{ marginTop: formData.fields.length > 0 ? '1rem' : '0' }}>
                      + Tambah Field Baru
                    </Button>
                  </AccordionBody>
                )}
              </FieldsSection>

              {/* Step 3: Results */}
              <FieldsSection>
                <AccordionHeader onClick={() => setResultsOpen(o => !o)}>
                  <SectionTitle>Hasil * {formData.results.length > 0 && `(${formData.results.length})`}</SectionTitle>
                  <AccordionChevron $isOpen={resultsOpen}>▼</AccordionChevron>
                </AccordionHeader>
                {resultsOpen && (
                  <AccordionBody>
                    <ResultsSection
                      results={formData.results}
                      errors={errors}
                      onAddResult={addResult}
                      onRemoveResult={removeResult}
                      onResultChange={handleResultChange}
                      onAddConditionalFormula={addConditionalFormula}
                      onRemoveConditionalFormula={removeConditionalFormula}
                      onConditionalFormulaChange={handleConditionalFormulaChange}
                      onAddCFCondition={addCFCondition}
                      onRemoveCFCondition={removeCFCondition}
                      onCFConditionChange={handleCFConditionChange}
                    />
                  </AccordionBody>
                )}
              </FieldsSection>

              {/* Step 4: Classifications */}
              <FieldsSection>
                <AccordionHeader onClick={() => setClassificationsOpen(o => !o)}>
                  <SectionTitle>Klasifikasi {formData.classifications.length > 0 && `(${formData.classifications.length})`}</SectionTitle>
                  <AccordionChevron $isOpen={classificationsOpen}>▼</AccordionChevron>
                </AccordionHeader>
                {classificationsOpen && (
                  <AccordionBody>
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
                  </AccordionBody>
                )}
              </FieldsSection>

              {/* Step 5: Status */}
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
