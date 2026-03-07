import React, { memo, useState, useEffect } from 'react'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Button from '@components/common/Button'
import {
  FormGroup,
  FormRow,
  ExampleBox,
  SmallLabel
} from '../CalculatorModal.styles'

// ── Result Item ───────────────────────────────────────────────────────────────
const ResultItem = memo(({ result, resultIndex, errors, onResultChange, onRemoveResult }) => {
  const [localKey, setLocalKey] = useState(result.key)
  const [localFormula, setLocalFormula] = useState(result.formula)
  const [localLabel, setLocalLabel] = useState(result.result_label)
  const [localUnit, setLocalUnit] = useState(result.result_unit || '')

  useEffect(() => {
    setLocalKey(result.key)
    setLocalFormula(result.formula)
    setLocalLabel(result.result_label)
    setLocalUnit(result.result_unit || '')
  }, [result.key, result.formula, result.result_label, result.result_unit])

  return (
    <div style={{ border: '2px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem', background: '#fafafa' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <SmallLabel style={{ fontSize: '0.9rem', fontWeight: 700 }}>Hasil {resultIndex + 1}</SmallLabel>
        <Button variant="danger" size="small" type="button" onClick={() => onRemoveResult(resultIndex)}>Hapus</Button>
      </div>

      <FormRow>
        <FormGroup>
          <TextInput
            label="Key *"
            type="text"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            onBlur={(e) => onResultChange(resultIndex, 'key', e.target.value)}
            placeholder="bmi"
            hint="Identifier unik, digunakan di kondisi klasifikasi"
            style={{ fontFamily: 'monospace' }}
          />
        </FormGroup>
        <FormGroup>
          <TextInput
            label="Satuan Hasil"
            type="text"
            value={localUnit}
            onChange={(e) => setLocalUnit(e.target.value)}
            onBlur={(e) => onResultChange(resultIndex, 'result_unit', e.target.value)}
            placeholder="kg/m²"
            hint="Opsional"
          />
        </FormGroup>
      </FormRow>

      <FormGroup>
        <TextInput
          label="Label Hasil *"
          type="text"
          value={localLabel}
          onChange={(e) => setLocalLabel(e.target.value)}
          onBlur={(e) => onResultChange(resultIndex, 'result_label', e.target.value)}
          placeholder="BMI Anda"
          error={errors[`result_${resultIndex}_result_label`]}
        />
      </FormGroup>

      <FormGroup>
        <Textarea
          label="Formula *"
          value={localFormula}
          onChange={(e) => setLocalFormula(e.target.value)}
          onBlur={(e) => onResultChange(resultIndex, 'formula', e.target.value)}
          placeholder="weight / ((height/100) * (height/100))"
          style={{ fontFamily: 'monospace', fontSize: '13px', minHeight: '80px' }}
          error={errors[`result_${resultIndex}_formula`]}
        />
        <ExampleBox style={{ marginTop: '0.25rem' }}>
          Gunakan key dari Input Fields. Operasi: +, -, *, /, (), Math.sqrt(), Math.pow()
        </ExampleBox>
      </FormGroup>
    </div>
  )
})
ResultItem.displayName = 'ResultItem'

// ── ResultsSection ────────────────────────────────────────────────────────────
const ResultsSection = memo(({ results, errors, onAddResult, onRemoveResult, onResultChange }) => {
  return (
    <div>
      {errors.results && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{errors.results}</div>}
      {results.map((result, resultIndex) => (
        <ResultItem
          key={result._id || resultIndex}
          result={result}
          resultIndex={resultIndex}
          errors={errors}
          onResultChange={onResultChange}
          onRemoveResult={onRemoveResult}
        />
      ))}
      <Button variant="outline" fullWidth type="button" onClick={onAddResult}>
        + Tambah Hasil Baru
      </Button>
    </div>
  )
})
ResultsSection.displayName = 'ResultsSection'

export { ResultsSection }
