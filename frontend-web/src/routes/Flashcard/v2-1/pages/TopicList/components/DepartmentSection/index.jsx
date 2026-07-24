import { useState } from 'react'
import Select from 'react-select'
import {
  Card, SectionLabel, FieldGrid, FieldLabel,
  CountRow, CountPresetBtn, AvailableText, CountInput,
} from './DepartmentSection.styles'

const PRESETS = [5, 10, 15, 20]

const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: '10px',
    border: `1.5px solid ${state.isFocused ? '#0d9488' : '#e5e7eb'}`,
    boxShadow: state.isFocused ? '0 0 0 3px rgba(13,148,136,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
    fontSize: '0.875rem',
    minHeight: '42px',
    '&:hover': { borderColor: '#0d9488' },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: '0.875rem',
    backgroundColor: state.isSelected ? '#0d9488' : state.isFocused ? '#f0fdfa' : '#fff',
    color: state.isSelected ? '#fff' : '#374151',
  }),
  placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '0.875rem' }),
  singleValue: (base) => ({ ...base, fontSize: '0.875rem', color: '#374151' }),
  menu: (base) => ({ ...base, borderRadius: '12px', overflow: 'hidden', zIndex: 50 }),
  menuList: (base) => ({ ...base, maxHeight: '200px', overflowY: 'auto' }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
}

export default function DepartmentSection({ index, item, topicOptions, subtopicsMap, loadingTopics, onUpdate, onRemove, canRemove }) {
  const subtopics = item.topicId ? (subtopicsMap[item.topicId] || []) : []
  const isLoadingSubs = item.topicId ? loadingTopics.has(item.topicId) : false

  const subtopicOptions = [
    { value: null, label: 'Semua subtopik' },
    ...subtopics.map(s => ({ value: s.id, label: s.name, cardCount: s.cardCount })),
  ]

  const available = item.topicId
    ? item.subtopicId === null
      ? subtopics.reduce((s, sub) => s + sub.cardCount, 0)
      : (subtopics.find(s => s.id === item.subtopicId)?.cardCount || 0)
    : 0

  const [isCustom, setIsCustom] = useState(false)
  const [customVal, setCustomVal] = useState('')

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <SectionLabel>TOPIK #{index + 1}</SectionLabel>
        {canRemove && (
          <button
            onClick={onRemove}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '1.1rem', lineHeight: 1 }}
          >
            ×
          </button>
        )}
      </div>

      <FieldGrid>
        <div>
          <FieldLabel>Topik</FieldLabel>
          <Select
            options={topicOptions}
            value={topicOptions.find(o => o.value === item.topicId) || null}
            onChange={opt => onUpdate({ topicId: opt?.value || null, subtopicId: null })}
            placeholder="Pilih topik..."
            isClearable
            styles={selectStyles}
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
        </div>
        <div>
          <FieldLabel>Subtopik</FieldLabel>
          <Select
            options={subtopicOptions}
            value={subtopicOptions.find(o => o.value === item.subtopicId) ?? subtopicOptions[0]}
            onChange={opt => onUpdate({ subtopicId: opt?.value ?? null })}
            isDisabled={!item.topicId}
            isLoading={isLoadingSubs}
            styles={selectStyles}
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
        </div>
      </FieldGrid>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <FieldLabel style={{ margin: 0, opacity: !item.topicId ? 0.4 : 1 }}>Jumlah kartu</FieldLabel>
        {available > 0 && <AvailableText>Tersedia {available}</AvailableText>}
      </div>
      <CountRow>
        {PRESETS.map(p => (
          <CountPresetBtn
            key={p}
            $active={!isCustom && item.count === p}
            disabled={!item.topicId || (available > 0 && p > available)}
            onClick={() => { setIsCustom(false); onUpdate({ count: p }) }}
          >
            {p} kartu
          </CountPresetBtn>
        ))}
        <CountPresetBtn
          $active={isCustom}
          disabled={!item.topicId}
          onClick={() => { setIsCustom(true); setCustomVal(String(item.count)) }}
        >
          Custom
        </CountPresetBtn>
        <CountPresetBtn
          $active={!isCustom && available > 0 && item.count === available}
          disabled={!item.topicId || available === 0}
          onClick={() => { setIsCustom(false); onUpdate({ count: available }) }}
        >
          Semua
        </CountPresetBtn>
        {isCustom && item.topicId && (
          <CountInput
            type="number"
            min={1}
            max={available || undefined}
            value={customVal}
            onChange={e => { setCustomVal(e.target.value); onUpdate({ count: parseInt(e.target.value) || 1 }) }}
          />
        )}
      </CountRow>
    </Card>
  )
}
