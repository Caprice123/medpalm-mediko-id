import { useState } from 'react'
import { useCalculatorModal } from './useCalculatorModal'
import Dropdown from '@components/common/Dropdown'
import TagSelector from '@components/common/TagSelector'
import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormRow,
  HelpText,
  ErrorMessage,
  FieldsSection,
  SectionTitle,
  FieldsList,
  FieldItem,
  DragHandle,
  FieldItemContent,
  FieldInputWrapper,
  SmallLabel,
  SmallInput,
  RemoveButton,
  AddButton,
  OptionsList,
  OptionItem,
  SmallButton,
  ClassificationsSection,
  ClassificationsList,
  ClassificationItem,
  ClassificationHeader,
  ClassificationOptionsList,
  ClassificationOptionItem,
  OptionHeader,
  ConditionsList,
  ConditionItem,
  SubLabel,
  ModalFooter,
  Button,
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
  RemoveReferenceButton,
  AddReferenceWrapper
} from './CalculatorModal.styles'

function CalculatorModal({ isOpen, onClose, calculator, onSuccess }) {
  const [expandedOptions, setExpandedOptions] = useState({})
  const [expandedClassifications, setExpandedClassifications] = useState({})

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
    draggedIndex,
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
    handleSubmit,
    handleClose,
    handleConfirmClose,
    handleCancelClose
  } = useCalculatorModal({ isOpen, calculator, onSuccess, onClose })

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
              <FormGroup>
                <FormLabel>Judul Kalkulator *</FormLabel>
                <FormInput
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFieldChange}
                  placeholder="Contoh: Kalkulator BMI, Kalkulator Dosis Obat"
                />
                {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <FormLabel>Deskripsi</FormLabel>
                <FormTextarea
                  name="description"
                  value={formData.description}
                  onChange={handleFieldChange}
                  placeholder="Jelaskan fungsi kalkulator ini dan untuk apa digunakan..."
                />
                <HelpText>Opsional - Deskripsi singkat tentang kalkulator</HelpText>
              </FormGroup>

              {/* Category Tags Section */}
              <FormGroup>
                <FormLabel>Kategori</FormLabel>
                <TagSelector
                  allTags={categoryTags || []}
                  selectedTags={selectedTags}
                  onTagsChange={handleTagsChange}
                  placeholder="-- Pilih Kategori --"
                  helpText="Pilih kategori untuk membantu mengorganisir kalkulator"
                />
              </FormGroup>

              {/* Step 2: Result Configuration */}
              <FormRow>
                <FormGroup>
                  <FormLabel>Label Hasil *</FormLabel>
                  <FormInput
                    type="text"
                    name="result_label"
                    value={formData.result_label}
                    onChange={handleFieldChange}
                    placeholder="Contoh: BMI Anda, Dosis Obat"
                  />
                  {errors.result_label && <ErrorMessage>{errors.result_label}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <FormLabel>Satuan Hasil</FormLabel>
                  <FormInput
                    type="text"
                    name="result_unit"
                    value={formData.result_unit}
                    onChange={handleFieldChange}
                    placeholder="Contoh: kg/m², mg, ml"
                  />
                  <HelpText>Opsional - Satuan untuk hasil</HelpText>
                </FormGroup>
              </FormRow>

              {/* Step 3: Input Fields */}
              <FieldsSection>
                <SectionTitle>Input Fields *</SectionTitle>
                {errors.fields && <ErrorMessage>{errors.fields}</ErrorMessage>}

                <FieldsList>
                  {formData.fields.map((field, index) => (
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
                          <SmallLabel>Key * (untuk formula)</SmallLabel>
                          <SmallInput
                            type="text"
                            value={field.key}
                            onChange={(e) => handleFieldItemChange(index, 'key', e.target.value)}
                            placeholder="weight"
                          />
                          {errors[`field_${index}_key`] && (
                            <ErrorMessage>{errors[`field_${index}_key`]}</ErrorMessage>
                          )}
                        </FieldInputWrapper>

                        <FieldInputWrapper>
                          <SmallLabel>Type *</SmallLabel>
                          <Dropdown
                            options={[
                              { value: 'number', label: 'Number' },
                              { value: 'text', label: 'Text' },
                              { value: 'dropdown', label: 'Dropdown' },
                              { value: 'radio', label: 'Radio Button' }
                            ]}
                            value={{ value: field.type, label: field.type.charAt(0).toUpperCase() + field.type.slice(1) }}
                            onChange={(option) => handleFieldItemChange(index, 'type', option.value)}
                          />
                        </FieldInputWrapper>

                        <FieldInputWrapper fullWidth>
                          <SmallLabel>Label * (tampil ke user)</SmallLabel>
                          <SmallInput
                            type="text"
                            value={field.label}
                            onChange={(e) => handleFieldItemChange(index, 'label', e.target.value)}
                            placeholder="Berat Badan"
                          />
                          {errors[`field_${index}_label`] && (
                            <ErrorMessage>{errors[`field_${index}_label`]}</ErrorMessage>
                          )}
                        </FieldInputWrapper>

                        <FieldInputWrapper fullWidth>
                          <SmallLabel>Placeholder * (petunjuk untuk user)</SmallLabel>
                          <SmallInput
                            type="text"
                            value={field.placeholder}
                            onChange={(e) => handleFieldItemChange(index, 'placeholder', e.target.value)}
                            placeholder="Masukkan berat badan dalam kg"
                          />
                          {errors[`field_${index}_placeholder`] && (
                            <ErrorMessage>{errors[`field_${index}_placeholder`]}</ErrorMessage>
                          )}
                        </FieldInputWrapper>

                        {field.type === 'number' && (
                          <FieldInputWrapper fullWidth>
                            <SmallLabel>Unit (untuk angka)</SmallLabel>
                            <SmallInput
                              type="text"
                              value={field.unit || ''}
                              onChange={(e) => handleFieldItemChange(index, 'unit', e.target.value)}
                              placeholder="kg, cm, mg, dll"
                            />
                          </FieldInputWrapper>
                        )}

                        {(field.type === 'dropdown' || field.type === 'radio') && (
                          <FieldInputWrapper fullWidth>
                            <SmallLabel>Options (pilihan untuk user)</SmallLabel>
                            <OptionsList>
                              {field.options && field.options.map((option, optIndex) => (
                                <OptionItem key={optIndex}>
                                  <SmallInput
                                    type="text"
                                    value={option.value}
                                    onChange={(e) => handleFieldOptionChange(index, optIndex, 'value', e.target.value)}
                                    placeholder="value (male)"
                                  />
                                  <SmallInput
                                    type="text"
                                    value={option.label}
                                    onChange={(e) => handleFieldOptionChange(index, optIndex, 'label', e.target.value)}
                                    placeholder="Label (Laki-laki)"
                                  />
                                  <SmallButton
                                    type="button"
                                    onClick={() => removeFieldOption(index, optIndex)}
                                  >
                                    ✕
                                  </SmallButton>
                                </OptionItem>
                              ))}
                            </OptionsList>
                            <AddButton type="button" onClick={() => addFieldOption(index)} style={{ marginTop: '4px' }}>
                              + Tambah Option
                            </AddButton>
                          </FieldInputWrapper>
                        )}
                      </FieldItemContent>

                      <RemoveButton
                        type="button"
                        onClick={() => removeField(index)}
                      >
                        Hapus
                      </RemoveButton>
                    </FieldItem>
                  ))}
                </FieldsList>

                <AddButton type="button" onClick={addField}>
                  + Tambah Field Baru
                </AddButton>
              </FieldsSection>

              {/* Step 4: Formula */}
              <InfoBox>
                <InfoIcon>🧮</InfoIcon>
                <InfoText>
                  <strong>Formula menggunakan KEY dari field yang sudah dibuat.</strong>
                  <br />Gunakan operator: + (tambah), - (kurang), * (kali), / (bagi), () (kurung)
                  <br />Fungsi Math juga tersedia: Math.sqrt(), Math.pow(), dll
                </InfoText>
              </InfoBox>

              <FormGroup>
                <FormLabel>Formula *</FormLabel>
                <FormTextarea
                  name="formula"
                  value={formData.formula}
                  onChange={handleFieldChange}
                  placeholder="weight / ((height/100) * (height/100))"
                  style={{ fontFamily: 'monospace', fontSize: '13px', minHeight: '100px' }}
                />
                {errors.formula && <ErrorMessage>{errors.formula}</ErrorMessage>}

                <ExampleBox style={{ marginTop: '0.5rem' }}>
                  <strong>Contoh Formula:</strong>
                  <br />• BMI: weight / ((height/100) * (height/100))
                  <br />• Rata-rata: (nilai1 + nilai2 + nilai3) / 3
                  <br />• Akar kuadrat: Math.sqrt(angka)
                </ExampleBox>
              </FormGroup>

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
                            <SmallInput
                              type="text"
                              value={classification.name}
                              onChange={(e) => handleClassificationChange(classIndex, 'name', e.target.value)}
                              placeholder="Kategori BMI"
                              style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}
                            />
                          </div>
                          <SmallButton
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeClassification(classIndex)
                            }}
                            style={{ background: '#fecaca', color: '#dc2626' }}
                          >
                            ✕
                          </SmallButton>
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
                                    <SmallInput
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
                                  <SmallButton
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeClassificationOption(classIndex, optIndex)
                                    }}
                                  >
                                    ✕
                                  </SmallButton>
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
                                        <ConditionItem key={condIndex}>
                                          <SmallInput
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
                                          <SmallInput
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
                                          <SmallButton
                                            type="button"
                                            onClick={() => removeCondition(classIndex, optIndex, condIndex)}
                                          >
                                            ✕
                                          </SmallButton>
                                        </ConditionItem>
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

                                  <AddButton
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
                                  </AddButton>
                                </div>}
                              </ClassificationOptionItem>
                            )
                            })}
                          </ClassificationOptionsList>
                          <AddButton
                            type="button"
                            onClick={() => addClassificationOption(classIndex)}
                            style={{ marginTop: '0.75rem' }}
                          >
                            + Tambah Jenis Klasifikasi
                          </AddButton>
                        </div>}
                      </ClassificationItem>
                    )
                    })}
                  </ClassificationsList>
                )}

                <AddButton type="button" onClick={addClassification}>
                  + Tambah Grup Klasifikasi
                </AddButton>
              </ClassificationsSection>

              {/* Step 6: Status */}
              <FormRow>
                <FormGroup>
                  <FormLabel>Status</FormLabel>
                  <Dropdown
                    options={[
                      { value: 'draft', label: 'Draft (belum dipublikasi)' },
                      { value: 'published', label: 'Published (dapat digunakan user)' }
                    ]}
                    value={{
                      value: formData.status,
                      label: formData.status === 'draft' ? 'Draft (belum dipublikasi)' : 'Published (dapat digunakan user)'
                    }}
                    onChange={(option) => handleFieldChange({ target: { name: 'status', value: option.value } })}
                  />
                  <HelpText>Draft: hanya admin yang bisa lihat. Published: tersedia untuk semua user.</HelpText>
                </FormGroup>
              </FormRow>

              
              {/* Clinical References Section */}
              <FormGroup>
                <FormLabel>Referensi Klinis</FormLabel>
                {/* {formData.clinical_references && formData.clinical_references.length > 0 && (
                  <ReferencesList>
                    {formData.clinical_references.map((ref, index) => (
                      <ReferenceItem key={index}>
                        <ReferenceText>{ref}</ReferenceText>
                        <RemoveReferenceButton
                          type="button"
                          onClick={() => removeClinicalReference(index)}
                        >
                          ×
                        </RemoveReferenceButton>
                      </ReferenceItem>
                    ))}
                  </ReferencesList>
                )} */}
                {formData.clinical_references.map((ref, index) => (
                  <AddReferenceWrapper key={index} style={{ marginBottom: '0.5rem' }}>
                    <FormInput
                      type="text"
                      value={ref}
                      onChange={(e) => {
                        setFormData(prev => {
                            const updated = [...prev.clinical_references];
                            updated[index] = e.target.value;

                            return { ...prev, clinical_references: updated };
                        });
                      }}
                      placeholder="Contoh: American Heart Association Guidelines 2020"
                      autoFocus
                    />
                    <SmallButton
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, clinical_references: prev.clinical_references.filter((_, i) => i !== index) }))}
                      style={{ background: '#f3f4f6', color: '#6b7280' }}
                    >
                      ✕
                    </SmallButton>
                  </AddReferenceWrapper>
                ))}
                  <AddButton
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, clinical_references: [...prev.clinical_references, ''] }))}
                    style={{ width: '100%' }}
                  >
                    + Tambah Referensi
                  </AddButton>
                <HelpText>Tambahkan referensi klinis atau guideline untuk kalkulator ini</HelpText>
              </FormGroup>
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
