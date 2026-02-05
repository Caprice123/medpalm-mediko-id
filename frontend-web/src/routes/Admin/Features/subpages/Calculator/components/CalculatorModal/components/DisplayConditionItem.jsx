import React, { memo, useState, useEffect } from 'react'
import isEqual from 'react-fast-compare'
import Dropdown from '@components/common/Dropdown'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import {
  ConditionItem
} from '../CalculatorModal.styles'

const DisplayConditionItem = memo(({
  condition,
  condIndex,
  fieldIndex,
  isLastCondition,
  fields,
  onDisplayConditionChange,
  onRemoveDisplayCondition
}) => {
  // Local state for smooth typing
  const [localValue, setLocalValue] = useState(condition.value)

  // Sync when condition changes
  useEffect(() => {
    setLocalValue(condition.value)
  }, [condition.value])

  return (
    <ConditionItem>
      <Dropdown
        options={fields
          .filter((f, i) => i !== fieldIndex) // Exclude current field
          .map(f => ({ value: f.key, label: f.label || f.key }))}
        value={condition.field_key ? {
          value: condition.field_key,
          label: fields.find(f => f.key === condition.field_key)?.label || condition.field_key
        } : null}
        onChange={(option) => onDisplayConditionChange(fieldIndex, condIndex, 'field_key', option?.value || '')}
        placeholder="Pilih field"
      />
      <Dropdown
        options={[
          { value: '==', label: '==' },
          { value: '!=', label: '!=' },
          { value: '>', label: '>' },
          { value: '<', label: '<' },
          { value: '>=', label: '>=' },
          { value: '<=', label: '<=' }
        ]}
        value={{ value: condition.operator, label: condition.operator }}
        onChange={(option) => onDisplayConditionChange(fieldIndex, condIndex, 'operator', option.value)}
      />
      <TextInput
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={(e) => onDisplayConditionChange(fieldIndex, condIndex, 'value', e.target.value)}
        placeholder="value"
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
          onChange={(option) => onDisplayConditionChange(fieldIndex, condIndex, 'logical_operator', option.value)}
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
        onClick={() => onRemoveDisplayCondition(fieldIndex, condIndex)}
      >
        ✕
      </Button>
    </ConditionItem>
  )
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if this specific condition changed
  if (!isEqual(prevProps.condition, nextProps.condition)) {
    return false
  }
  if (prevProps.isLastCondition !== nextProps.isLastCondition) {
    return false
  }
  // Check if fields list changed (for dropdown options)
  // Fast string comparison instead of deep object comparison
  if (prevProps.fields.length !== nextProps.fields.length) {
    return false
  }
  const prevHash = prevProps.fields.map(f => `${f.key}:${f.label}`).join('|')
  const nextHash = nextProps.fields.map(f => `${f.key}:${f.label}`).join('|')
  if (prevHash !== nextHash) {
    return false
  }
  return true
})

DisplayConditionItem.displayName = 'DisplayConditionItem'

export { DisplayConditionItem }
