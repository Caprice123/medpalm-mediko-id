import React, { memo, useState, useEffect } from 'react'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import {
  ClassificationsSection,
  SectionTitle,
  ClassificationsList,
  ClassificationItem as StyledClassificationItem,
  ClassificationHeader,
  ClassificationOptionsList,
  ClassificationOptionItem as StyledClassificationOptionItem,
  OptionHeader,
  ConditionsList,
  ConditionItem as StyledConditionItem,
  SubLabel,
  HelpText,
  ExampleBox
} from '../CalculatorModal.styles'

// Memoized ConditionItem with local state
const ConditionItem = memo(({
  condition,
  classIndex,
  optIndex,
  condIndex,
  isLastCondition,
  onConditionChange,
  onRemoveCondition
}) => {
  const [localResultKey, setLocalResultKey] = useState(condition.result_key)
  const [localValue, setLocalValue] = useState(condition.value)

  useEffect(() => {
    setLocalResultKey(condition.result_key)
    setLocalValue(condition.value)
  }, [condition.result_key, condition.value])

  return (
    <StyledConditionItem>
      <TextInput
        type="text"
        value={localResultKey}
        onChange={(e) => setLocalResultKey(e.target.value)}
        onBlur={(e) => onConditionChange(classIndex, optIndex, condIndex, 'result_key', e.target.value)}
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
        onChange={(option) => onConditionChange(classIndex, optIndex, condIndex, 'operator', option.value)}
      />
      <TextInput
        type="number"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={(e) => onConditionChange(classIndex, optIndex, condIndex, 'value', e.target.value)}
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
          onChange={(option) => onConditionChange(classIndex, optIndex, condIndex, 'logical_operator', option.value)}
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
        onClick={() => onRemoveCondition(classIndex, optIndex, condIndex)}
      >
        ✕
      </Button>
    </StyledConditionItem>
  )
})

ConditionItem.displayName = 'ConditionItem'

// Memoized ClassificationOptionItem with local state
const ClassificationOptionItem = memo(({
  option,
  classIndex,
  optIndex,
  isExpanded,
  onToggleOption,
  onClassificationOptionChange,
  onRemoveClassificationOption,
  onAddCondition,
  onRemoveCondition,
  onConditionChange
}) => {
  const [localValue, setLocalValue] = useState(option.value)
  const [localLabel, setLocalLabel] = useState(option.label)

  useEffect(() => {
    setLocalValue(option.value)
    setLocalLabel(option.label)
  }, [option.value, option.label])

  return (
    <StyledClassificationOptionItem>
      <OptionHeader onClick={() => onToggleOption(classIndex, optIndex)}>
        <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <TextInput
            type="text"
            value={localValue}
            onChange={(e) => {
              e.stopPropagation()
              setLocalValue(e.target.value)
            }}
            onBlur={(e) => {
              e.stopPropagation()
              onClassificationOptionChange(classIndex, optIndex, 'value', e.target.value)
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="Value (normal)"
            style={{ flex: 1 }}
          />
          <TextInput
            type="text"
            value={localLabel}
            onChange={(e) => {
              e.stopPropagation()
              setLocalLabel(e.target.value)
            }}
            onBlur={(e) => {
              e.stopPropagation()
              onClassificationOptionChange(classIndex, optIndex, 'label', e.target.value)
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="Label (Normal)"
            style={{ flex: 1 }}
          />
        </div>
        <Button
          variant="secondary"
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemoveClassificationOption(classIndex, optIndex)
          }}
        >
          Hapus
        </Button>
      </OptionHeader>

      {isExpanded && (
        <div>
          <SubLabel style={{ fontSize: '0.8rem' }}>
            Kondisi untuk "{option.label || option.value || 'klasifikasi ini'}"
          </SubLabel>
          <HelpText style={{ marginTop: '0.25rem', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
            Kondisi terakhir otomatis tanpa logical operator (null). Gunakan AND jika semua harus terpenuhi, OR jika salah satu saja.
          </HelpText>

          <ConditionsList>
            {option.conditions && option.conditions.map((condition, condIndex) => {
              const isLastCondition = condIndex === option.conditions.length - 1
              return (
                <ConditionItem
                  key={condIndex}
                  condition={condition}
                  classIndex={classIndex}
                  optIndex={optIndex}
                  condIndex={condIndex}
                  isLastCondition={isLastCondition}
                  onConditionChange={onConditionChange}
                  onRemoveCondition={onRemoveCondition}
                />
              )
            })}
          </ConditionsList>

          {option.conditions && option.conditions.length > 0 && (
            <ExampleBox style={{ marginTop: '0.5rem', fontSize: '0.7rem', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <strong style={{ color: '#8b5cf6' }}>Akan aktif jika:</strong> {option.conditions.map((c, i) => (
                <span key={i}>
                  {i > 0 && ` ${option.conditions[i - 1].logical_operator || ''} `}
                  result {c.operator} {c.value}
                </span>
              ))}
            </ExampleBox>
          )}

          <Button
            variant="outline"
            fullWidth
            type="button"
            onClick={() => onAddCondition(classIndex, optIndex)}
            style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.5rem' }}
          >
            + Tambah Kondisi
          </Button>
        </div>
      )}
    </StyledClassificationOptionItem>
  )
})

ClassificationOptionItem.displayName = 'ClassificationOptionItem'

// Memoized ClassificationItem with local state
const ClassificationItem = memo(({
  classification,
  classIndex,
  expandedOptions,
  onToggleOption,
  onClassificationChange,
  onRemoveClassification,
  onAddClassificationOption,
  onRemoveClassificationOption,
  onClassificationOptionChange,
  onAddCondition,
  onRemoveCondition,
  onConditionChange
}) => {
  const [localName, setLocalName] = useState(classification.name)

  useEffect(() => {
    setLocalName(classification.name)
  }, [classification.name])

  return (
    <StyledClassificationItem>
      <ClassificationHeader>
        <TextInput
          label="Nama Klasifikasi"
          type="text"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          onBlur={(e) => onClassificationChange(classIndex, 'name', e.target.value)}
          placeholder="Contoh: Kategori BMI"
          style={{ flex: 1 }}
        />
        <Button
          variant="danger"
          type="button"
          onClick={() => onRemoveClassification(classIndex)}
        >
          Hapus Klasifikasi
        </Button>
      </ClassificationHeader>

      <ClassificationOptionsList>
        {classification.options && classification.options.map((option, optIndex) => {
          const isExpanded = expandedOptions[`${classIndex}-${optIndex}`]
          return (
            <ClassificationOptionItem
              key={optIndex}
              option={option}
              classIndex={classIndex}
              optIndex={optIndex}
              isExpanded={isExpanded}
              onToggleOption={onToggleOption}
              onClassificationOptionChange={onClassificationOptionChange}
              onRemoveClassificationOption={onRemoveClassificationOption}
              onAddCondition={onAddCondition}
              onRemoveCondition={onRemoveCondition}
              onConditionChange={onConditionChange}
            />
          )
        })}
      </ClassificationOptionsList>

      <Button
        variant="outline"
        fullWidth
        type="button"
        onClick={() => onAddClassificationOption(classIndex)}
        style={{ marginTop: '0.5rem' }}
      >
        + Tambah Option Klasifikasi
      </Button>
    </StyledClassificationItem>
  )
})

ClassificationItem.displayName = 'ClassificationItem'

// Main ClassificationSection component
const ClassificationSection = memo(({
  classifications,
  expandedOptions,
  expandedClassifications,
  onToggleOption,
  onToggleClassification,
  onAddClassification,
  onRemoveClassification,
  onClassificationChange,
  onAddClassificationOption,
  onRemoveClassificationOption,
  onClassificationOptionChange,
  onAddCondition,
  onRemoveCondition,
  onConditionChange
}) => {
  return (
    <ClassificationsSection>
      <SectionTitle>Klasifikasi Hasil (Opsional)</SectionTitle>
      <HelpText style={{ marginBottom: '1rem' }}>
        Klasifikasi digunakan untuk memberikan interpretasi atau kategori berdasarkan hasil perhitungan.
        Contoh: BMI 18.5-24.9 = "Normal", BMI &gt; 25 = "Overweight"
      </HelpText>

      <ClassificationsList>
        {classifications.map((classification, classIndex) => (
          <ClassificationItem
            key={classIndex}
            classification={classification}
            classIndex={classIndex}
            expandedOptions={expandedOptions}
            onToggleOption={onToggleOption}
            onClassificationChange={onClassificationChange}
            onRemoveClassification={onRemoveClassification}
            onAddClassificationOption={onAddClassificationOption}
            onRemoveClassificationOption={onRemoveClassificationOption}
            onClassificationOptionChange={onClassificationOptionChange}
            onAddCondition={onAddCondition}
            onRemoveCondition={onRemoveCondition}
            onConditionChange={onConditionChange}
          />
        ))}
      </ClassificationsList>

      <Button variant="outline" fullWidth type="button" onClick={onAddClassification}>
        + Tambah Klasifikasi Baru
      </Button>
    </ClassificationsSection>
  )
})

ClassificationSection.displayName = 'ClassificationSection'

export { ClassificationSection }
