import { FaFileAlt, FaQuoteRight } from 'react-icons/fa'
import Checkbox from '@components/common/Checkbox'
import { MAX_CONTEXT_SECTIONS } from '@store/skripsi/v2/reducer'
import {
  Group, GroupHeader, GroupLabel, Counter, Chips, Chip, Reason,
  SectionList, SectionRow, SectionIndex, SectionTitle, OwnBadge, EmptyNote,
} from './ContextPicker.styles'

// What the model is allowed to read from the report before it answers.
//
// One picker for both places that send a prompt — the AI Chat panel and the
// per-section assistant — so "Kasus" means the same thing, and the cap on
// whole sections is the same number, wherever it is ticked.
//
// There used to be a "Kerangka" option that sent every section title plus its
// first line. It is gone: a gist of the whole report is a worse answer to
// "what should the model know" than the two or three sections the student
// actually means, and it grew with the report while nobody chose it.

const ContextPicker = ({
  context,
  sections,
  selectedSectionIds,
  ownSectionId = null,
  hasCase,
  hasCitations,
  disabled = false,
  onToggle,
  onToggleSection,
}) => {
  const isFull = selectedSectionIds.length >= MAX_CONTEXT_SECTIONS

  return (
    <>
      <Group>
        <GroupHeader>
          <GroupLabel>Dokumen pendukung</GroupLabel>
        </GroupHeader>

        <Chips>
          <Chip
            type="button"
            $active={context.case && hasCase}
            disabled={disabled || !hasCase}
            onClick={() => onToggle('case')}
          >
            <FaFileAlt /> Kasus
          </Chip>

          <Chip
            type="button"
            $active={context.citations && hasCitations}
            disabled={disabled || !hasCitations}
            onClick={() => onToggle('citations')}
          >
            <FaQuoteRight /> Referensi
          </Chip>
        </Chips>

        {!hasCase && <Reason>Laporan ini dibuat tanpa teks kasus.</Reason>}
        {!hasCitations && <Reason>Belum ada referensi tersimpan di laporan ini.</Reason>}
      </Group>

      <Group>
        <GroupHeader>
          <GroupLabel>Bagian laporan</GroupLabel>
          <Counter $full={isFull}>
            {selectedSectionIds.length}/{MAX_CONTEXT_SECTIONS} bagian
          </Counter>
        </GroupHeader>

        <SectionList>
          {sections.length === 0 ? (
            <EmptyNote>Laporan ini belum punya bagian.</EmptyNote>
          ) : (
            sections.map((section, index) => {
              const checked = selectedSectionIds.includes(section.id)
              // At the cap the unticked rows go quiet rather than silently
              // dropping the extra one on the server.
              const rowDisabled = disabled || (!checked && isFull)

              return (
                <SectionRow
                  key={section.id}
                  $disabled={rowDisabled}
                  title={section.title}
                >
                  <Checkbox
                    checked={checked}
                    disabled={rowDisabled}
                    onChange={() => onToggleSection(section.id)}
                    noMargin
                  />
                  <SectionIndex>{index + 1}</SectionIndex>
                  <SectionTitle>{section.title}</SectionTitle>
                  {section.id === ownSectionId && <OwnBadge>bagian ini</OwnBadge>}
                </SectionRow>
              )
            })
          )}
        </SectionList>

        {isFull && (
          <Reason>
            Maksimal {MAX_CONTEXT_SECTIONS} bagian sekaligus — lebih dari itu pertanyaannya
            sendiri yang tenggelam.
          </Reason>
        )}
      </Group>
    </>
  )
}

export default ContextPicker
