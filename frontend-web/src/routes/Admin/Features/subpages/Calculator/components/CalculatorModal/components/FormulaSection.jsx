import React, { memo } from 'react'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import {
  FormGroup,
  FormRow,
  ExampleBox
} from '../CalculatorModal.styles'

const FormulaSection = memo(({
  localFormula,
  localResultLabel,
  localResultUnit,
  errors,
  onFormulaChange,
  onFormulaBlur,
  onResultLabelChange,
  onResultLabelBlur,
  onResultUnitChange,
  onResultUnitBlur
}) => {
  return (
    <>
      <FormGroup>
        <Textarea
          label="Formula"
          required
          name="formula"
          value={localFormula}
          onChange={onFormulaChange}
          onBlur={onFormulaBlur}
          placeholder="weight / ((height/100) * (height/100))"
          style={{ fontFamily: 'monospace', fontSize: '13px', minHeight: '100px' }}
          error={errors.formula}
        />

        <ExampleBox style={{ marginTop: '0.5rem' }}>
          <strong>Contoh Formula:</strong>
          <br />• BMI: <code>weight / ((height/100) * (height/100))</code>
          <br />• Dosis: <code>weight * dosage_per_kg</code>
          <br />
          <br />
          Gunakan key dari Input Fields yang sudah dibuat. Operasi: +, -, *, /, (), Math.sqrt(), Math.pow()
        </ExampleBox>
      </FormGroup>

      <FormRow>
        <FormGroup>
          <TextInput
            label="Label Hasil"
            required
            type="text"
            name="result_label"
            value={localResultLabel}
            onChange={onResultLabelChange}
            onBlur={onResultLabelBlur}
            placeholder="Contoh: BMI Anda, Dosis Obat"
            error={errors.result_label}
          />
        </FormGroup>

        <FormGroup>
          <TextInput
            label="Satuan Hasil"
            type="text"
            name="result_unit"
            value={localResultUnit}
            onChange={onResultUnitChange}
            onBlur={onResultUnitBlur}
            placeholder="Contoh: kg/m², mg, ml"
            hint="Opsional - Satuan untuk hasil"
          />
        </FormGroup>
      </FormRow>
    </>
  )
})

FormulaSection.displayName = 'FormulaSection'

export { FormulaSection }
