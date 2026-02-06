import React, { memo, useState, useEffect } from 'react'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import {
  ClassificationsSection,
  SectionTitle,
  ClassificationsList,
  ClassificationItem as StyledClassificationItem,
  ClassificationOptionsList,
  ClassificationOptionItem as StyledClassificationOptionItem,
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
  const [localValue, setLocalValue] = useState(option.label || option.value)

  useEffect(() => {
    setLocalValue(option.label || option.value)
  }, [option.label, option.value])

  return (
    <StyledClassificationOptionItem>
      {/* Rule Header - Clickable to toggle */}
      <div
        onClick={() => onToggleOption(classIndex, optIndex)}
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
        }}
      >
        <div style={{ fontSize: '0.9rem', color: '#8b5cf6', fontWeight: 600 }}>
          {isExpanded ? '▼' : '▶'}
        </div>
        <div style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
          <TextInput
            type="text"
            value={localValue}
            onChange={(e) => {
              e.stopPropagation()
              setLocalValue(e.target.value)
            }}
            onBlur={(e) => {
              e.stopPropagation()
              const val = e.target.value
              onClassificationOptionChange(classIndex, optIndex, 'value', val)
              onClassificationOptionChange(classIndex, optIndex, 'label', val)
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="Underweight"
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
          ✕
        </Button>
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
                {c.result_key} {c.operator} {c.value}
                {i < option.conditions.length - 1 && <strong style={{ color: '#8b5cf6' }}> {c.logical_operator} </strong>}
              </span>
            ))}
          </ExampleBox>
        )}

        <Button
          variant="outline"
          fullWidth
          type="button"
          onClick={() => onAddCondition(classIndex, optIndex)}
          style={{
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            padding: '0.5rem',
            background: 'rgba(139, 92, 246, 0.1)',
            borderColor: '#8b5cf6'
          }}
        >
          + Tambah Kondisi
        </Button>
      </div>}
    </StyledClassificationOptionItem>
  )
})

ClassificationOptionItem.displayName = 'ClassificationOptionItem'

// Memoized ClassificationItem with local state
const ClassificationItem = memo(({
  classification,
  classIndex,
  isClassificationExpanded,
  expandedOptions,
  onToggleClassification,
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
      {/* Classification Header - Purple Theme - Accordion */}
      <div
        onClick={() => onToggleClassification(classIndex)}
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
        }}
      >
        <div style={{ fontSize: '1rem', color: '#7c3aed', fontWeight: 700 }}>
          {isClassificationExpanded ? '▼' : '▶'}
        </div>
        <div style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
          <TextInput
            type="text"
            value={localName}
            onChange={(e) => {
              e.stopPropagation()
              setLocalName(e.target.value)
            }}
            onBlur={(e) => {
              e.stopPropagation()
              onClassificationChange(classIndex, 'name', e.target.value)
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="Kategori BMI"
            style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}
          />
        </div>
        <Button
          variant="danger"
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemoveClassification(classIndex)
          }}
        >
          ✕
        </Button>
      </div>

      {/* Rules Section - Collapsible */}
      {isClassificationExpanded && <div>
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
          style={{ marginTop: '0.75rem' }}
        >
          + Tambah Jenis Klasifikasi
        </Button>
      </div>}
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
      <SectionTitle>Classifications</SectionTitle>

      {classifications && classifications.length > 0 && (
        <ClassificationsList>
          {classifications.map((classification, classIndex) => {
            const isClassificationExpanded = expandedClassifications[classIndex]
            return (
              <ClassificationItem
                key={classIndex}
                classification={classification}
                classIndex={classIndex}
                isClassificationExpanded={isClassificationExpanded}
                expandedOptions={expandedOptions}
                onToggleClassification={onToggleClassification}
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
            )
          })}
        </ClassificationsList>
      )}

      <Button variant="outline" fullWidth type="button" onClick={onAddClassification}>
        + Tambah Grup Klasifikasi
      </Button>
    </ClassificationsSection>
  )
})

ClassificationSection.displayName = 'ClassificationSection'

export { ClassificationSection }
