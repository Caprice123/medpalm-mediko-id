import React, { memo, useState, useEffect } from 'react'
import isEqual from 'react-fast-compare'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import FileUpload from '@components/common/FileUpload'
import {
  OptionItem as StyledOptionItem,
  SmallLabel
} from '../CalculatorModal.styles'

const OptionItem = memo(({
  option,
  optIndex,
  fieldIndex,
  onFieldOptionChange,
  onRemoveFieldOption,
  onOptionImageUpload,
  onOptionImageRemove
}) => {
  // Local state for smooth typing
  const [localValue, setLocalValue] = useState(option.value)
  const [localLabel, setLocalLabel] = useState(option.label)

  // Sync when option changes
  useEffect(() => {
    setLocalValue(option.value)
    setLocalLabel(option.label)
  }, [option.value, option.label])

  return (
    <StyledOptionItem>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <TextInput
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={(e) => onFieldOptionChange(fieldIndex, optIndex, 'value', e.target.value)}
            placeholder="value (male)"
          />
          <TextInput
            type="text"
            value={localLabel}
            onChange={(e) => setLocalLabel(e.target.value)}
            onBlur={(e) => onFieldOptionChange(fieldIndex, optIndex, 'label', e.target.value)}
            placeholder="Label (Laki-laki)"
          />
        </div>

        {/* Image Upload for Option */}
        <div>
          <SmallLabel style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Gambar (Opsional)</SmallLabel>
          <FileUpload
            file={option.image?.key ? {
              name: option.image?.filename || 'Image',
              type: 'image/*',
              size: option.image?.byteSize
            } : null}
            onFileSelect={(e) => {
              const file = e.target?.files?.[0] || e
              if (file) {
                if (file.type.startsWith('image/')) {
                  onOptionImageUpload(fieldIndex, optIndex, file)
                } else {
                  alert('Mohon pilih file gambar')
                }
              }
            }}
            onRemove={() => onOptionImageRemove(fieldIndex, optIndex)}
            acceptedTypes={['image/*']}
            acceptedTypesLabel="PNG, JPG, GIF"
            maxSizeMB={5}
            uploadText="Upload gambar"
            actions={<></>}
          />
        </div>
      </div>

      <Button
        variant="secondary"
        type="button"
        onClick={() => onRemoveFieldOption(fieldIndex, optIndex)}
        style={{
          padding: '4px 6px',
          fontSize: '0.75rem',
          minWidth: 'auto',
          height: 'fit-content',
          marginTop: '4px'
        }}
      >
        ✕
      </Button>
    </StyledOptionItem>
  )
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if this specific option changed
  return (
    isEqual(prevProps.option, nextProps.option) &&
    prevProps.optIndex === nextProps.optIndex &&
    prevProps.fieldIndex === nextProps.fieldIndex
  )
})

OptionItem.displayName = 'OptionItem'

export { OptionItem }
