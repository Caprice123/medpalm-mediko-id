import { FaSlidersH } from 'react-icons/fa'
import ContextModal from './components/ContextModal'
import { useContextBar } from './hooks/useContextBar'
import { Bar, BarLabel, Summary, EditHint } from './ContextBar.styles'

// What the chat is allowed to read from the report before it answers.
//
// Without this the model only ever saw the conversation, so "bantu susun
// pembahasan" was answered from general knowledge about PBL reports rather
// than from this one.
//
// The choice is made in a dialog but summarised here, because it changes both
// the answer and what the message costs: a student who is about to ask about
// their case should be able to see, without opening anything, whether the case
// is going with the question.
const ContextBar = ({ tabId }) => {
  const {
    context,
    sections,
    hasCase,
    hasCitations,
    selectedSectionIds,
    summary,
    isPickerOpen,
    openPicker,
    closePicker,
    toggle,
    toggleSection,
  } = useContextBar(tabId)

  return (
    <>
      <Bar type="button" onClick={openPicker} title="Atur konteks yang dikirim ke AI">
        <BarLabel>Konteks</BarLabel>
        <Summary $empty={summary.length === 0}>
          {summary.length === 0 ? 'Belum ada — AI hanya membaca percakapan ini' : summary.join(' · ')}
        </Summary>
        <EditHint><FaSlidersH /> Atur</EditHint>
      </Bar>

      <ContextModal
        isOpen={isPickerOpen}
        onClose={closePicker}
        context={context}
        sections={sections}
        selectedSectionIds={selectedSectionIds}
        hasCase={hasCase}
        hasCitations={hasCitations}
        onToggle={toggle}
        onToggleSection={toggleSection}
      />
    </>
  )
}

export default ContextBar
