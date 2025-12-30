import { useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import TagSelector from '@components/common/TagSelector'
import Dropdown from '@components/common/Dropdown'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Button from '@components/common/Button'
import { useCreateCalculator } from '../../hooks/subhooks/useCreateCalculator'
import {
  FormSection,
  Label,
  ErrorText,
  HelpText,
  FieldsSection,
  SectionTitle,
  FieldsList,
  FieldItem,
  DragHandle,
  FieldItemContent,
  FieldInputWrapper,
  OptionsList,
  OptionItem,
  ClassificationsSection,
  ClassificationsList,
  ClassificationItem,
  ClassificationHeader,
  ClassificationOptionsList,
  ClassificationOptionItem,
  OptionHeader,
  ConditionsList,
  ConditionItem,
  InfoBox,
  InfoIcon,
  InfoText,
  ExampleBox,
  ReferencesList,
  ReferenceItem,
  ReferenceText,
  AddReferenceWrapper,
  StatusToggle,
  StatusOption,
  ConfirmOverlay,
  ConfirmDialog,
  ConfirmIcon,
  ConfirmTitle,
  ConfirmMessage,
  ConfirmActions,
  FormRow,
  SubLabel
} from '../shared/CalculatorModal.styles'

const CreateCalculatorModal = ({ onClose }) => {
  const { loading } = useSelector(state => state.calculator)
  const { tags } = useSelector(state => state.tags)

  const [expandedOptions, setExpandedOptions] = useState({})
  const [expandedClassifications, setExpandedClassifications] = useState({})
  const [newReference, setNewReference] = useState('')

  // Get category tags
  const categoryTags = tags.find(tag => tag.name === 'kategori')?.tags ?? []

  const {
    form,
    draggedIndex,
    showConfirmClose,
    handleTagsChange,
    handleFieldItemChange,
    addField,
    removeField,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    addFieldOption,
    removeFieldOption,
    handleFieldOptionChange,
    addClassification,
    removeClassification,
    handleClassificationChange,
    addClassificationOption,
    removeClassificationOption,
    handleClassificationOptionChange,
    addCondition,
    removeCondition,
    handleConditionChange,
    handleClose,
    handleConfirmClose,
    handleCancelClose
  } = useCreateCalculator(onClose)

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

  const addClinicalReference = () => {
    if (newReference.trim()) {
      form.setFieldValue('clinical_references', [
        ...form.values.clinical_references,
        newReference.trim()
      ])
      setNewReference('')
    }
  }

  const removeClinicalReference = (index) => {
    const updatedReferences = form.values.clinical_references.filter((_, i) => i !== index)
    form.setFieldValue('clinical_references', updatedReferences)
  }

  return (
    <>
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Buat Kalkulator Baru"
        size="large"
        footer={
          <>
            <Button onClick={handleClose}>Batal</Button>
            <Button
              variant="primary"
              onClick={form.handleSubmit}
              disabled={loading.isCreateCalculatorLoading}
            >
              {loading.isCreateCalculatorLoading ? 'Menyimpan...' : 'Simpan Kalkulator'}
            </Button>
          </>
        }
      >
        {/* Basic Information */}
        <FormSection>
          <TextInput
            label="Judul Kalkulator"
            required
            value={form.values.title}
            onChange={(e) => form.setFieldValue('title', e.target.value)}
            placeholder="Contoh: Kalkulator BMI, Kalkulator Dosis Obat"
            error={form.errors.title}
          />
        </FormSection>

        <FormSection>
          <Textarea
            label="Deskripsi"
            value={form.values.description}
            onChange={(e) => form.setFieldValue('description', e.target.value)}
            placeholder="Jelaskan fungsi kalkulator ini dan untuk apa digunakan..."
            hint="Opsional - Deskripsi singkat tentang kalkulator"
          />
        </FormSection>

        {/* Category Tags */}
        <FormSection>
          <Label>Kategori</Label>
          <TagSelector
            allTags={categoryTags}
            selectedTags={form.values.tags}
            onTagsChange={handleTagsChange}
            placeholder="-- Pilih Kategori --"
            helpText="Pilih kategori untuk membantu mengorganisir kalkulator"
          />
        </FormSection>

        {/* Result Configuration */}
        <FormRow>
          <FormSection>
            <TextInput
              label="Label Hasil"
              required
              value={form.values.result_label}
              onChange={(e) => form.setFieldValue('result_label', e.target.value)}
              placeholder="Contoh: BMI Anda, Dosis Obat"
              error={form.errors.result_label}
            />
          </FormSection>

          <FormSection>
            <TextInput
              label="Satuan Hasil"
              value={form.values.result_unit}
              onChange={(e) => form.setFieldValue('result_unit', e.target.value)}
              placeholder="Contoh: kg/m², mg, ml"
              hint="Opsional - Satuan untuk hasil"
            />
          </FormSection>
        </FormRow>

        {/* Input Fields */}
        <FieldsSection>
          <SectionTitle>Input Fields *</SectionTitle>
          {form.errors.fields && <ErrorText>{form.errors.fields}</ErrorText>}

          <FieldsList>
            {form.values.fields.map((field, index) => (
              <FieldItem
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                isDragging={draggedIndex === index}
              >
                <DragHandle>⋮⋮</DragHandle>

                <FieldItemContent>
                  <FieldInputWrapper>
                    <TextInput
                      label="Key * (untuk formula)"
                      
                      value={field.key}
                      onChange={(e) => handleFieldItemChange(index, 'key', e.target.value)}
                      placeholder="weight"
                    />
                  </FieldInputWrapper>

                  <FieldInputWrapper>
                    <Dropdown
                      label="Type *"
                      options={[
                        { value: 'number', label: 'Number' },
                        { value: 'text', label: 'Text' },
                        { value: 'dropdown', label: 'Dropdown' },
                        { value: 'radio', label: 'Radio Button' }
                      ]}
                      value={{ value: field.type, label: field.type.charAt(0).toUpperCase() + field.type.slice(1) }}
                      onChange={(option) => handleFieldItemChange(index, 'type', option.value)}
                      usePortal={true}
                    />
                  </FieldInputWrapper>

                  <FieldInputWrapper fullWidth>
                    <TextInput
                      label="Label * (tampil ke user)"
                      
                      value={field.label}
                      onChange={(e) => handleFieldItemChange(index, 'label', e.target.value)}
                      placeholder="Berat Badan"
                    />
                  </FieldInputWrapper>

                  <FieldInputWrapper fullWidth>
                    <TextInput
                      label="Placeholder * (petunjuk untuk user)"
                      
                      value={field.placeholder}
                      onChange={(e) => handleFieldItemChange(index, 'placeholder', e.target.value)}
                      placeholder="Masukkan berat badan dalam kg"
                    />
                  </FieldInputWrapper>

                  {field.type === 'number' && (
                    <FieldInputWrapper fullWidth>
                      <TextInput
                        label="Unit (untuk angka)"
                        
                        value={field.unit || ''}
                        onChange={(e) => handleFieldItemChange(index, 'unit', e.target.value)}
                        placeholder="kg, cm, mg, dll"
                      />
                    </FieldInputWrapper>
                  )}

                  {(field.type === 'dropdown' || field.type === 'radio') && (
                    <FieldInputWrapper fullWidth>
                      <SubLabel>Options (pilihan untuk user)</SubLabel>
                      <OptionsList>
                        {field.options && field.options.map((option, optIndex) => (
                          <OptionItem key={optIndex}>
                            <TextInput
                              
                              value={option.value}
                              onChange={(e) => handleFieldOptionChange(index, optIndex, 'value', e.target.value)}
                              placeholder="value (male)"
                            />
                            <TextInput
                              
                              value={option.label}
                              onChange={(e) => handleFieldOptionChange(index, optIndex, 'label', e.target.value)}
                              placeholder="Label (Laki-laki)"
                            />
                            <Button
                              variant="secondary"
                              size="small"
                              type="button"
                              onClick={() => removeFieldOption(index, optIndex)}
                            >
                              ✕
                            </Button>
                          </OptionItem>
                        ))}
                      </OptionsList>
                      <Button variant="outline" fullWidth type="button" onClick={() => addFieldOption(index)} style={{ marginTop: '4px' }}>
                        + Tambah Option
                      </Button>
                    </FieldInputWrapper>
                  )}
                </FieldItemContent>

                <Button
                  variant="danger"
                  size="small"
                  type="button"
                  onClick={() => removeField(index)}
                >
                  Hapus
                </Button>
              </FieldItem>
            ))}
          </FieldsList>

          <Button variant="outline" fullWidth type="button" onClick={addField}>
            + Tambah Field Baru
          </Button>
        </FieldsSection>

        {/* Formula */}
        <InfoBox>
          <InfoIcon>🧮</InfoIcon>
          <InfoText>
            <strong>Formula menggunakan KEY dari field yang sudah dibuat.</strong>
            <br />Gunakan operator: + (tambah), - (kurang), * (kali), / (bagi), () (kurung)
            <br />Fungsi Math juga tersedia: Math.sqrt(), Math.pow(), dll
          </InfoText>
        </InfoBox>

        <FormSection>
          <Label>Formula *</Label>
          <Textarea
            value={form.values.formula}
            onChange={(e) => form.setFieldValue('formula', e.target.value)}
            placeholder="weight / ((height/100) * (height/100))"
            style={{ fontFamily: 'monospace', fontSize: '13px', minHeight: '100px' }}
          />
          {form.errors.formula && <ErrorText>{form.errors.formula}</ErrorText>}

          <ExampleBox style={{ marginTop: '0.5rem' }}>
            <strong>Contoh Formula:</strong>
            <br />• BMI: weight / ((height/100) * (height/100))
            <br />• Rata-rata: (nilai1 + nilai2 + nilai3) / 3
            <br />• Akar kuadrat: Math.sqrt(angka)
          </ExampleBox>
        </FormSection>

        {/* Classifications */}
        <ClassificationsSection>
          <SectionTitle>Classifications (Opsional)</SectionTitle>
          <HelpText style={{ marginBottom: '1rem' }}>
            Buat kategori berdasarkan hasil perhitungan. Contoh: BMI {"<"} 18.5 = "Underweight"
          </HelpText>

          {form.values.classifications && form.values.classifications.length > 0 && (
            <ClassificationsList>
              {form.values.classifications.map((classification, classIndex) => {
                const isClassificationExpanded = expandedClassifications[classIndex]
                return (
                  <ClassificationItem key={classIndex}>
                    <ClassificationHeader>
                      <div
                        onClick={() => toggleClassification(classIndex)}
                        style={{
                          cursor: 'pointer',
                          fontSize: '1rem',
                          color: '#7c3aed',
                          fontWeight: 700,
                          userSelect: 'none'
                        }}
                      >
                        {isClassificationExpanded ? '▼' : '▶'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          label="Nama Klasifikasi"
                          value={classification.name}
                          onChange={(e) => handleClassificationChange(classIndex, 'name', e.target.value)}
                          placeholder="Kategori BMI"
                        />
                      </div>
                      <Button
                        variant="danger"
                        size="small"
                        type="button"
                        onClick={() => removeClassification(classIndex)}
                      >
                        ✕
                      </Button>
                    </ClassificationHeader>

                    {isClassificationExpanded && (
                      <div>
                        <ClassificationOptionsList>
                          {classification.options && classification.options.map((option, optIndex) => {
                            const isExpanded = expandedOptions[`${classIndex}-${optIndex}`]
                            return (
                              <ClassificationOptionItem key={optIndex}>
                                <OptionHeader>
                                  <div
                                    onClick={() => toggleOption(classIndex, optIndex)}
                                    style={{
                                      cursor: 'pointer',
                                      fontSize: '0.9rem',
                                      color: '#8b5cf6',
                                      fontWeight: 600,
                                      userSelect: 'none'
                                    }}
                                  >
                                    {isExpanded ? '▼' : '▶'}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <TextInput
                                      
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
                                    size="small"
                                    type="button"
                                    onClick={() => removeClassificationOption(classIndex, optIndex)}
                                  >
                                    ✕
                                  </Button>
                                </OptionHeader>

                                {isExpanded && (
                                  <ConditionsList>
                                    <SubLabel>Kondisi (Conditions)</SubLabel>
                                    {option.conditions && option.conditions.map((cond, condIndex) => (
                                      <ConditionItem key={condIndex}>
                                        <div>
                                          <TextInput
                                            
                                            value={cond.result_key}
                                            onChange={(e) => handleConditionChange(classIndex, optIndex, condIndex, 'result_key', e.target.value)}
                                            placeholder="result"
                                          />
                                        </div>
                                        <div>
                                          <Dropdown
                                            options={[
                                              { value: '>', label: '>' },
                                              { value: '>=', label: '>=' },
                                              { value: '<', label: '<' },
                                              { value: '<=', label: '<=' },
                                              { value: '==', label: '==' },
                                              { value: '!=', label: '!=' }
                                            ]}
                                            value={{ value: cond.operator, label: cond.operator }}
                                            onChange={(opt) => handleConditionChange(classIndex, optIndex, condIndex, 'operator', opt.value)}
                                          />
                                        </div>
                                        <div>
                                          <TextInput
                                            
                                            value={cond.value}
                                            onChange={(e) => handleConditionChange(classIndex, optIndex, condIndex, 'value', e.target.value)}
                                            placeholder="18.5"
                                          />
                                        </div>
                                        <div>
                                          {condIndex < option.conditions.length - 1 && (
                                            <Dropdown
                                              options={[
                                                { value: 'AND', label: 'AND' },
                                                { value: 'OR', label: 'OR' }
                                              ]}
                                              value={{ value: cond.logical_operator || 'AND', label: cond.logical_operator || 'AND' }}
                                              onChange={(opt) => handleConditionChange(classIndex, optIndex, condIndex, 'logical_operator', opt.value)}
                                              usePortal={true}
                                            />
                                          )}
                                        </div>
                                        <div>
                                          {option.conditions.length > 1 && (
                                            <Button
                                              variant="secondary"
                                              size="small"
                                              type="button"
                                              onClick={() => removeCondition(classIndex, optIndex, condIndex)}
                                            >
                                              ✕
                                            </Button>
                                          )}
                                        </div>
                                      </ConditionItem>
                                    ))}
                                    <Button
                                      variant="outline"
                                      fullWidth
                                      type="button"
                                      onClick={() => addCondition(classIndex, optIndex)}
                                      style={{ marginTop: '0.5rem' }}
                                    >
                                      + Tambah Kondisi
                                    </Button>
                                  </ConditionsList>
                                )}
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
                          + Tambah Rule Baru
                        </Button>
                      </div>
                    )}
                  </ClassificationItem>
                )
              })}
            </ClassificationsList>
          )}

          <Button variant="outline" fullWidth type="button" onClick={addClassification}>
            + Tambah Klasifikasi Baru
          </Button>
        </ClassificationsSection>

        {/* Clinical References */}
        <FormSection>
          <Label>Referensi Klinis (Opsional)</Label>
          <HelpText>Link atau teks referensi medis untuk kalkulator ini</HelpText>

          {form.values.clinical_references.length > 0 && (
            <ReferencesList>
              {form.values.clinical_references.map((ref, index) => (
                <ReferenceItem key={index}>
                  <ReferenceText>{ref}</ReferenceText>
                  <Button
                    variant="danger"
                    size="small"
                    type="button"
                    onClick={() => removeClinicalReference(index)}
                  >
                    ✕
                  </Button>
                </ReferenceItem>
              ))}
            </ReferencesList>
          )}

          <AddReferenceWrapper>
            <TextInput
              value={newReference}
              onChange={(e) => setNewReference(e.target.value)}
              placeholder="https://... atau teks referensi"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addClinicalReference())}
            />
            <Button
              type="button"
              onClick={addClinicalReference}
              disabled={!newReference.trim()}
            >
              Tambah
            </Button>
          </AddReferenceWrapper>
        </FormSection>

        {/* Status Selection */}
        <StatusToggle>
          <StatusOption>
            <input
              type="radio"
              name="status"
              value="draft"
              checked={form.values.status === 'draft'}
              onChange={(e) => form.setFieldValue('status', e.target.value)}
            />
            Draft
          </StatusOption>
          <StatusOption>
            <input
              type="radio"
              name="status"
              value="published"
              checked={form.values.status === 'published'}
              onChange={(e) => form.setFieldValue('status', e.target.value)}
            />
            Published
          </StatusOption>
        </StatusToggle>
      </Modal>

      {/* Confirm Close Dialog */}
      <ConfirmOverlay isOpen={showConfirmClose} onClick={handleCancelClose}>
        <ConfirmDialog onClick={e => e.stopPropagation()}>
          <ConfirmIcon>⚠️</ConfirmIcon>
          <ConfirmTitle>Unsaved Changes</ConfirmTitle>
          <ConfirmMessage>
            You have unsaved changes. Are you sure you want to close?
          </ConfirmMessage>
          <ConfirmActions>
            <Button onClick={handleCancelClose}>Cancel</Button>
            <Button variant="primary" onClick={handleConfirmClose}>
              Close Without Saving
            </Button>
          </ConfirmActions>
        </ConfirmDialog>
      </ConfirmOverlay>
    </>
  )
}

export default CreateCalculatorModal
