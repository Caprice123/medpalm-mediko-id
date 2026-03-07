import React, { memo, useState, useEffect } from 'react'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import {
  FormGroup,
  FormRow,
  ExampleBox,
  SmallLabel
} from '../CalculatorModal.styles'

const OPERATORS = [
  { value: '==', label: '==' },
  { value: '!=', label: '!=' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
]

const LOGICAL_OPS = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
]

// ── Conditional Formula Item ──────────────────────────────────────────────────
const ConditionalFormulaItem = memo(({
  cf, cfIndex, resultIndex,
  onFormulaChange, onRemove,
  onAddCondition, onRemoveCondition, onConditionChange
}) => {
  const [localFormula, setLocalFormula] = useState(cf.formula)

  useEffect(() => {
    setLocalFormula(cf.formula)
  }, [cf.formula])

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem', background: '#f9fafb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <SmallLabel style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>Kondisi {cfIndex + 1}</SmallLabel>
        <Button variant="danger" size="small" type="button" onClick={() => onRemove(resultIndex, cfIndex)}>Hapus</Button>
      </div>

      {/* Conditions */}
      {(cf.conditions || []).map((cond, condIndex) => (
        <div key={condIndex} style={{ marginBottom: '0.5rem' }}>
          {condIndex > 0 && (
            <div style={{ marginBottom: '0.25rem' }}>
              <Dropdown
                options={LOGICAL_OPS}
                value={cf.conditions[condIndex - 1].logical_operator || 'AND'}
                onChange={(val) => onConditionChange(resultIndex, cfIndex, condIndex - 1, 'logical_operator', val)}
                style={{ width: '80px' }}
              />
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 2 }}>
              <TextInput
                label={condIndex === 0 ? 'Field Key' : undefined}
                type="text"
                value={cond.field_key}
                onChange={(e) => onConditionChange(resultIndex, cfIndex, condIndex, 'field_key', e.target.value)}
                placeholder="sex"
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Dropdown
                label={condIndex === 0 ? 'Op' : undefined}
                options={OPERATORS}
                value={cond.operator}
                onChange={(val) => onConditionChange(resultIndex, cfIndex, condIndex, 'operator', val)}
              />
            </div>
            <div style={{ flex: 2 }}>
              <TextInput
                label={condIndex === 0 ? 'Nilai' : undefined}
                type="text"
                value={cond.value}
                onChange={(e) => onConditionChange(resultIndex, cfIndex, condIndex, 'value', e.target.value)}
                placeholder="male"
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
              />
            </div>
            <div>
              <Button
                variant="danger"
                size="small"
                type="button"
                onClick={() => onRemoveCondition(resultIndex, cfIndex, condIndex)}
                style={{ marginBottom: '2px' }}
              >×</Button>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        size="small"
        type="button"
        onClick={() => onAddCondition(resultIndex, cfIndex)}
        style={{ marginBottom: '0.75rem', fontSize: '0.75rem' }}
      >
        + Tambah Kondisi
      </Button>

      {/* Formula for this condition */}
      <FormGroup style={{ marginBottom: 0 }}>
        <Textarea
          label="Gunakan Formula"
          value={localFormula}
          onChange={(e) => setLocalFormula(e.target.value)}
          onBlur={(e) => onFormulaChange(resultIndex, cfIndex, e.target.value)}
          placeholder="weight_lbs / (height_in * height_in) * 703"
          style={{ fontFamily: 'monospace', fontSize: '13px', minHeight: '60px' }}
        />
      </FormGroup>
    </div>
  )
})
ConditionalFormulaItem.displayName = 'ConditionalFormulaItem'

// ── Result Item ───────────────────────────────────────────────────────────────
const ResultItem = memo(({
  result, resultIndex, errors,
  onResultChange, onRemoveResult,
  onAddConditionalFormula, onRemoveConditionalFormula,
  onConditionalFormulaChange, onAddCFCondition, onRemoveCFCondition, onCFConditionChange
}) => {
  const [localKey, setLocalKey] = useState(result.key)
  const [localFormula, setLocalFormula] = useState(result.formula)
  const [localLabel, setLocalLabel] = useState(result.result_label)
  const [localUnit, setLocalUnit] = useState(result.result_unit || '')
  const [cfOpen, setCfOpen] = useState(false)

  useEffect(() => {
    setLocalKey(result.key)
    setLocalFormula(result.formula)
    setLocalLabel(result.result_label)
    setLocalUnit(result.result_unit || '')
  }, [result.key, result.formula, result.result_label, result.result_unit])

  const conditionalFormulas = result.conditional_formulas || []

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
          label="Formula Default *"
          value={localFormula}
          onChange={(e) => setLocalFormula(e.target.value)}
          onBlur={(e) => onResultChange(resultIndex, 'formula', e.target.value)}
          placeholder="weight / ((height/100) * (height/100))"
          style={{ fontFamily: 'monospace', fontSize: '13px', minHeight: '80px' }}
          error={errors[`result_${resultIndex}_formula`]}
          hint="Digunakan jika tidak ada kondisi yang terpenuhi"
        />
        <ExampleBox style={{ marginTop: '0.25rem' }}>
          Gunakan key dari Input Fields. Operasi: +, -, *, /, (), Math.sqrt(), Math.pow()
        </ExampleBox>
      </FormGroup>

      {/* Conditional Formulas */}
      <div style={{ marginTop: '0.75rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem' }}>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: cfOpen ? '0.75rem' : 0 }}
          onClick={() => setCfOpen(o => !o)}
        >
          <SmallLabel style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>
            Formula Kondisional {conditionalFormulas.length > 0 ? `(${conditionalFormulas.length})` : ''}
          </SmallLabel>
          <span style={{ color: '#6b7280', fontSize: '0.7rem', transition: 'transform 0.2s', display: 'inline-block', transform: cfOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▼</span>
        </div>

        {cfOpen && (
          <div>
            {conditionalFormulas.length > 0 && (
              <ExampleBox style={{ marginBottom: '0.75rem' }}>
                Kondisi dievaluasi secara berurutan. Formula pertama yang terpenuhi akan digunakan. Jika tidak ada yang terpenuhi, Formula Default akan dipakai.
              </ExampleBox>
            )}
            {conditionalFormulas.map((cf, cfIndex) => (
              <ConditionalFormulaItem
                key={cfIndex}
                cf={cf}
                cfIndex={cfIndex}
                resultIndex={resultIndex}
                onFormulaChange={onConditionalFormulaChange}
                onRemove={onRemoveConditionalFormula}
                onAddCondition={onAddCFCondition}
                onRemoveCondition={onRemoveCFCondition}
                onConditionChange={onCFConditionChange}
              />
            ))}
            <Button
              variant="outline"
              size="small"
              type="button"
              onClick={() => onAddConditionalFormula(resultIndex)}
              style={{ fontSize: '0.8rem' }}
            >
              + Tambah Formula Kondisional
            </Button>
          </div>
        )}
      </div>
    </div>
  )
})
ResultItem.displayName = 'ResultItem'

// ── ResultsSection ────────────────────────────────────────────────────────────
const ResultsSection = memo(({
  results, errors,
  onAddResult, onRemoveResult, onResultChange,
  onAddConditionalFormula, onRemoveConditionalFormula,
  onConditionalFormulaChange, onAddCFCondition, onRemoveCFCondition, onCFConditionChange
}) => {
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
          onAddConditionalFormula={onAddConditionalFormula}
          onRemoveConditionalFormula={onRemoveConditionalFormula}
          onConditionalFormulaChange={onConditionalFormulaChange}
          onAddCFCondition={onAddCFCondition}
          onRemoveCFCondition={onRemoveCFCondition}
          onCFConditionChange={onCFConditionChange}
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
