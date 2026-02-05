import React, { memo, useState, useEffect } from 'react'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import {
  FormGroup,
  FormLabel,
  HelpText,
  AddReferenceWrapper
} from '../CalculatorModal.styles'

const ReferenceItem = memo(({ reference, index, onReferenceChange, onRemoveReference }) => {
  const [localValue, setLocalValue] = useState(reference)

  useEffect(() => {
    setLocalValue(reference)
  }, [reference])

  return (
    <AddReferenceWrapper style={{ marginBottom: '0.5rem' }}>
      <TextInput
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={(e) => onReferenceChange(index, e.target.value)}
        placeholder="Contoh: American Heart Association Guidelines 2020"
        autoFocus
      />
      <Button
        variant="secondary"
        type="button"
        onClick={() => onRemoveReference(index)}
      >
        ✕
      </Button>
    </AddReferenceWrapper>
  )
})

ReferenceItem.displayName = 'ReferenceItem'

const ClinicalReferencesSection = memo(({
  clinicalReferences,
  onReferenceChange,
  onRemoveReference,
  onAddReference
}) => {
  return (
    <FormGroup>
      <FormLabel>Referensi Klinis</FormLabel>
      {clinicalReferences.map((ref, index) => (
        <ReferenceItem
          key={index}
          reference={ref}
          index={index}
          onReferenceChange={onReferenceChange}
          onRemoveReference={onRemoveReference}
        />
      ))}
      <Button
        variant="outline"
        fullWidth
        type="button"
        onClick={onAddReference}
      >
        + Tambah Referensi
      </Button>
      <HelpText>Tambahkan referensi klinis atau guideline untuk kalkulator ini</HelpText>
    </FormGroup>
  )
})

ClinicalReferencesSection.displayName = 'ClinicalReferencesSection'

export { ClinicalReferencesSection }
