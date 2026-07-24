import { useState, useRef, useEffect } from 'react'
import {
  Wrap, SectionTitle, Description, Row, Col, FieldLabel,
  PresetsRow, PresetBtn, CountInput, StartButton,
  DropdownWrap, DropdownTrigger, TriggerChevron, DropdownPanel,
  DropdownHeader, DropdownCount, DropdownActions, DropdownAction, DropdownDivider,
  DropdownList, DropdownItem, CheckBox, ItemName, ItemCount,
} from './QuickStartInline.styles'

const PRESETS = [5, 10, 15, 20]

function SubtopicDropdown({ options, selected, onChange, isLoading }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = (value) => {
    onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value])
  }

  const triggerLabel = selected.length === 0
    ? 'Semua subtopik'
    : `${selected.length} subtopik dipilih`

  return (
    <DropdownWrap ref={ref}>
      <DropdownTrigger $open={open} onClick={() => setOpen(o => !o)} type="button">
        <span>{isLoading ? 'Memuat...' : triggerLabel}</span>
        <TriggerChevron $open={open}>›</TriggerChevron>
      </DropdownTrigger>

      {open && !isLoading && (
        <DropdownPanel>
          <DropdownHeader>
            <DropdownCount>{selected.length} / {options.length} dipilih</DropdownCount>
            <DropdownActions>
              <DropdownAction type="button" onClick={() => onChange(options.map(o => o.value))}>
                Pilih semua
              </DropdownAction>
              <DropdownDivider>·</DropdownDivider>
              <DropdownAction type="button" onClick={() => onChange([])}>
                Kosongkan
              </DropdownAction>
            </DropdownActions>
          </DropdownHeader>
          <DropdownList>
            {options.map(opt => {
              const checked = selected.includes(opt.value)
              return (
                <DropdownItem key={opt.value} onClick={() => toggle(opt.value)}>
                  <CheckBox $checked={checked}>{checked && '✓'}</CheckBox>
                  <ItemName title={opt.label}>{opt.label}</ItemName>
                  <ItemCount>{opt.cardCount}</ItemCount>
                </DropdownItem>
              )
            })}
          </DropdownList>
        </DropdownPanel>
      )}
    </DropdownWrap>
  )
}

export default function QuickStartInline({ topic, subtopics, isLoadingSubtopics, onStart, isStarting }) {
  const [selected, setSelected] = useState([])
  const [preset, setPreset] = useState(5)
  const [isCustom, setIsCustom] = useState(false)
  const [customVal, setCustomVal] = useState('5')

  const options = subtopics.map(s => ({ value: s.id, label: s.name, cardCount: s.cardCount }))

  const handleStart = () => {
    const nodeIds = selected.length > 0 ? selected : subtopics.map(s => s.id)
    const count = isCustom ? (parseInt(customVal) || 20) : preset
    onStart(nodeIds, count)
  }

  return (
    <Wrap>
      <SectionTitle>Quick Start — {topic.name}</SectionTitle>
      <Description>
        Pilih satu atau beberapa subtopik. Kosongkan untuk mengambil dari semua subtopik.
      </Description>
      <Row>
        <Col style={{ flex: 1, minWidth: 220 }}>
          <FieldLabel>Subtopik (pilih, {subtopics.length} tersedia)</FieldLabel>
          <SubtopicDropdown
            options={options}
            selected={selected}
            onChange={setSelected}
            isLoading={isLoadingSubtopics}
          />
        </Col>

        <Col>
          <FieldLabel>Jumlah kartu</FieldLabel>
          <PresetsRow>
            {PRESETS.map(p => (
              <PresetBtn
                key={p}
                $active={!isCustom && preset === p}
                onClick={() => { setPreset(p); setIsCustom(false) }}
              >
                {p}
              </PresetBtn>
            ))}
            <PresetBtn $active={isCustom} onClick={() => setIsCustom(true)}>Lainnya</PresetBtn>
            {isCustom && (
              <CountInput
                type="number"
                min={1}
                value={customVal}
                onChange={e => setCustomVal(e.target.value)}
              />
            )}
          </PresetsRow>
        </Col>

        <StartButton onClick={handleStart} disabled={isStarting}>
          {isStarting ? 'Menyiapkan...' : 'Mulai Sesi'}
        </StartButton>
      </Row>
    </Wrap>
  )
}
