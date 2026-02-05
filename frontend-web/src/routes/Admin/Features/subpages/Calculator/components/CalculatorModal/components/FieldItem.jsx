import React, { memo } from 'react'
import isEqual from 'react-fast-compare'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { OptionItem } from './OptionItem'
import { DisplayConditionItem } from './DisplayConditionItem'
import {
  FieldItem as StyledFieldItem,
  DragHandle,
  FieldItemContent,
  FieldInputWrapper,
  SmallLabel,
  OptionsList,
  ConditionsList,
  HelpText
} from '../CalculatorModal.styles.jsx'

const FieldItem = memo(({
  field,
  index,
  draggedIndex,
  errors,
  fields,
  onFieldItemChange,
  onRemoveField,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onAddFieldOption,
  onRemoveFieldOption,
  onFieldOptionChange,
  onOptionImageUpload,
  onOptionImageRemove,
  onAddDisplayCondition,
  onRemoveDisplayCondition,
  onDisplayConditionChange
}) => {
  return (
    <StyledFieldItem
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
      isDragging={draggedIndex === index}
    >
      <DragHandle>⋮⋮</DragHandle>

      <FieldItemContent>
        <FieldInputWrapper>
          <TextInput
            label="Key * (untuk formula)"
            type="text"
            value={field.key}
            onChange={(e) => onFieldItemChange(index, 'key', e.target.value)}
            placeholder="weight"
            error={errors[`field_${index}_key`]}
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
            onChange={(option) => onFieldItemChange(index, 'type', option.value)}
          />
        </FieldInputWrapper>

        <FieldInputWrapper fullWidth>
          <TextInput
            label="Label * (tampil ke user)"
            type="text"
            value={field.label}
            onChange={(e) => onFieldItemChange(index, 'label', e.target.value)}
            placeholder="Berat Badan"
            error={errors[`field_${index}_label`]}
          />
        </FieldInputWrapper>

        <FieldInputWrapper fullWidth>
          <TextInput
            label="Placeholder * (petunjuk untuk user)"
            type="text"
            value={field.placeholder}
            onChange={(e) => onFieldItemChange(index, 'placeholder', e.target.value)}
            placeholder="Masukkan berat badan dalam kg"
            error={errors[`field_${index}_placeholder`]}
          />
        </FieldInputWrapper>

        {field.type === 'number' && (
          <FieldInputWrapper fullWidth>
            <TextInput
              label="Unit (untuk angka)"
              type="text"
              value={field.unit || ''}
              onChange={(e) => onFieldItemChange(index, 'unit', e.target.value)}
              placeholder="kg, cm, mg, dll"
            />
          </FieldInputWrapper>
        )}

        {/* Display Conditions */}
        <FieldInputWrapper fullWidth>
          <SmallLabel>Display Conditions (Tampilkan field ini jika...)</SmallLabel>
          <HelpText style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>
            Field ini hanya akan tampil jika kondisi terpenuhi. Kosongkan jika ingin selalu tampil.
          </HelpText>
          {field.display_conditions && field.display_conditions.length > 0 && (
            <ConditionsList>
              {field.display_conditions.map((condition, condIndex) => (
                <DisplayConditionItem
                  key={condIndex}
                  condition={condition}
                  condIndex={condIndex}
                  fieldIndex={index}
                  isLastCondition={condIndex === field.display_conditions.length - 1}
                  fields={fields}
                  onDisplayConditionChange={onDisplayConditionChange}
                  onRemoveDisplayCondition={onRemoveDisplayCondition}
                />
              ))}
            </ConditionsList>
          )}
          <Button
            variant="outline"
            fullWidth
            type="button"
            onClick={() => onAddDisplayCondition(index)}
            style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.5rem' }}
          >
            + Tambah Kondisi Display
          </Button>
        </FieldInputWrapper>

        {(field.type === 'dropdown' || field.type === 'radio') && (
          <FieldInputWrapper fullWidth>
            <SmallLabel>Options (pilihan untuk user)</SmallLabel>
            <OptionsList>
              {field.options && field.options.map((option, optIndex) => (
                <OptionItem
                  key={optIndex}
                  option={option}
                  optIndex={optIndex}
                  fieldIndex={index}
                  onFieldOptionChange={onFieldOptionChange}
                  onRemoveFieldOption={onRemoveFieldOption}
                  onOptionImageUpload={onOptionImageUpload}
                  onOptionImageRemove={onOptionImageRemove}
                />
              ))}
            </OptionsList>
            <Button variant="outline" fullWidth type="button" onClick={() => onAddFieldOption(index)} style={{ marginTop: '4px' }}>
              + Tambah Option
            </Button>
          </FieldInputWrapper>
        )}
      </FieldItemContent>

      <Button
        variant="danger"
        type="button"
        onClick={() => onRemoveField(index)}
      >
        Hapus
      </Button>
    </StyledFieldItem>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Return true if props are equal (don't re-render)
  // Return false if props are different (do re-render)

  // Check if this field's data changed
  if (!isEqual(prevProps.field, nextProps.field)) {
    return false
  }

  // Check if drag state changed
  if (prevProps.draggedIndex !== nextProps.draggedIndex) {
    return false
  }

  // Check if errors changed for this field
  const prevErrors = Object.keys(prevProps.errors).filter(key => key.includes(`field_${prevProps.index}`))
  const nextErrors = Object.keys(nextProps.errors).filter(key => key.includes(`field_${nextProps.index}`))
  if (!isEqual(prevErrors, nextErrors)) {
    return false
  }

  // Only check fields array if this field has display conditions
  // This prevents unnecessary re-renders when typing in key/label of other fields
  const hasDisplayConditions = nextProps.field.display_conditions && nextProps.field.display_conditions.length > 0
  if (hasDisplayConditions) {
    // Fast check: compare fields length and keys/labels as a simple string
    if (prevProps.fields.length !== nextProps.fields.length) {
      return false
    }
    // Create a hash string for quick comparison instead of deep object comparison
    const prevHash = prevProps.fields.map(f => `${f.key}:${f.label}`).join('|')
    const nextHash = nextProps.fields.map(f => `${f.key}:${f.label}`).join('|')
    if (prevHash !== nextHash) {
      return false
    }
  }

  // Props are equal, don't re-render
  return true
})

FieldItem.displayName = 'FieldItem'

export { FieldItem }
