import React, { memo, useState, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
  errors,
  fields,
  onFieldItemChange,
  onRemoveField,
  onAddFieldOption,
  onRemoveFieldOption,
  onFieldOptionChange,
  onOptionImageUpload,
  onOptionImageRemove,
  onAddDisplayCondition,
  onRemoveDisplayCondition,
  onDisplayConditionChange
}) => {
  // Local state for all text inputs to prevent lag
  const [localKey, setLocalKey] = useState(field.key)
  const [localLabel, setLocalLabel] = useState(field.label)
  const [localPlaceholder, setLocalPlaceholder] = useState(field.placeholder)
  const [localUnit, setLocalUnit] = useState(field.unit || '')

  // Sync local state when field changes from parent
  useEffect(() => {
    setLocalKey(field.key)
    setLocalLabel(field.label)
    setLocalPlaceholder(field.placeholder)
    setLocalUnit(field.unit || '')
  }, [field.key, field.label, field.placeholder, field.unit])

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <StyledFieldItem
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
    >
      <DragHandle {...attributes} {...listeners}>⋮⋮</DragHandle>

      <FieldItemContent>
        <FieldInputWrapper>
          <TextInput
            label="Key * (untuk formula)"
            type="text"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            onBlur={(e) => onFieldItemChange(index, 'key', e.target.value)}
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
            value={localLabel}
            onChange={(e) => setLocalLabel(e.target.value)}
            onBlur={(e) => onFieldItemChange(index, 'label', e.target.value)}
            placeholder="Berat Badan"
            error={errors[`field_${index}_label`]}
          />
        </FieldInputWrapper>

        <FieldInputWrapper fullWidth>
          <TextInput
            label="Placeholder * (petunjuk untuk user)"
            type="text"
            value={localPlaceholder}
            onChange={(e) => setLocalPlaceholder(e.target.value)}
            onBlur={(e) => onFieldItemChange(index, 'placeholder', e.target.value)}
            placeholder="Masukkan berat badan dalam kg"
            error={errors[`field_${index}_placeholder`]}
          />
        </FieldInputWrapper>

        {field.type === 'number' && (
          <FieldInputWrapper fullWidth>
            <TextInput
              label="Unit (untuk angka)"
              type="text"
              value={localUnit}
              onChange={(e) => setLocalUnit(e.target.value)}
              onBlur={(e) => onFieldItemChange(index, 'unit', e.target.value)}
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
})

FieldItem.displayName = 'FieldItem'

export { FieldItem }
