import { FaFileAlt, FaListUl, FaQuoteRight, FaTimes } from 'react-icons/fa'
import Dropdown from '@components/common/Dropdown'
import { useContextBar, MAX_CONTEXT_SECTIONS } from './hooks/useContextBar'
import {
  Bar, BarLabel, Chip, SectionChip, SectionName, RemoveButton, Adder, Hint,
} from './ContextBar.styles'

// What the chat is allowed to read from the report before it answers.
//
// Without this the model only ever saw the conversation, so "bantu susun
// pembahasan" was answered from general knowledge about PBL reports rather
// than from this one. The case and the outline are on by default because they
// are small and almost always the difference; whole sections are opt-in
// because they are what actually costs tokens, and there is a cap on them.
const ContextBar = ({ tabId }) => {
  const {
    context,
    hasCase,
    hasCitations,
    attachedSections,
    availableSections,
    canAddSection,
    toggle,
    addSection,
    removeSection,
  } = useContextBar(tabId)

  const sectionOptions = availableSections.map(section => ({
    value: section.id,
    label: section.title,
  }))

  return (
    <Bar>
      <BarLabel>Konteks</BarLabel>

      <Chip
        type="button"
        $active={context.case && hasCase}
        disabled={!hasCase}
        onClick={() => toggle('case')}
        title={hasCase
          ? 'Kirim kasus PBL laporan ini sebagai konteks'
          : 'Laporan ini dibuat tanpa teks kasus'}
      >
        <FaFileAlt /> Kasus
      </Chip>

      <Chip
        type="button"
        $active={context.outline}
        onClick={() => toggle('outline')}
        title="Kirim daftar bagian laporan beserta kalimat pertamanya"
      >
        <FaListUl /> Kerangka
      </Chip>

      <Chip
        type="button"
        $active={context.citations && hasCitations}
        disabled={!hasCitations}
        onClick={() => toggle('citations')}
        title={hasCitations
          ? 'Kirim daftar referensi tersimpan beserta nomornya'
          : 'Belum ada referensi tersimpan'}
      >
        <FaQuoteRight /> Referensi
      </Chip>

      {attachedSections.map(section => (
        <SectionChip key={section.id}>
          <SectionName title={section.title}>{section.title}</SectionName>
          <RemoveButton
            type="button"
            aria-label={`Lepas bagian ${section.title}`}
            title="Lepas dari konteks"
            onClick={() => removeSection(section.id)}
          >
            <FaTimes />
          </RemoveButton>
        </SectionChip>
      ))}

      {canAddSection ? (
        <Adder>
          <Dropdown
            options={sectionOptions}
            // Always empty: this is an adder, and what was added is already
            // shown as a chip beside it.
            value={null}
            onChange={(option) => addSection(option?.value)}
            placeholder="+ Tambah bagian"
            isClearable={false}
            usePortal
          />
        </Adder>
      ) : (
        attachedSections.length >= MAX_CONTEXT_SECTIONS && (
          <Hint>Maksimal {MAX_CONTEXT_SECTIONS} bagian</Hint>
        )
      )}
    </Bar>
  )
}

export default ContextBar
