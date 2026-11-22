import { useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { actions, selectChatContext } from '@store/skripsi/v2/reducer'

// What the next message carries with it. The selection lives in Redux keyed by
// tab, so switching tabs and coming back keeps it, and `sendMessage` reads it
// at send time rather than being handed it from here.
//
// The bar itself only summarises; the picking happens in a dialog, so the row
// above the composer stays one line however much is attached.
export const useContextBar = (tabId) => {
  const dispatch = useDispatch()

  const context = useSelector(state => selectChatContext(state, tabId), shallowEqual)
  const sections = useSelector(state => state.skripsiV2.sections, shallowEqual)
  // A report created without one has nothing to attach, and a chip that sends
  // an empty string is worse than no chip.
  const hasCase = useSelector(state => Boolean(state.skripsiV2.currentSet?.caseText))
  const hasCitations = useSelector(state => state.skripsiV2.citations.length > 0)

  const [isPickerOpen, setIsPickerOpen] = useState(false)

  // A section that was attached and then deleted from the report is simply not
  // there any more, so it drops out of both the summary and the count.
  const selectedSectionIds = context.sectionIds.filter(
    id => sections.some(section => section.id === id)
  )

  // What the summary line reads, in the order the dialog lists it. Only what
  // will actually be sent: a tick on a report with no case sends nothing.
  const summary = [
    context.case && hasCase ? 'Kasus' : null,
    context.citations && hasCitations ? 'Referensi' : null,
    ...selectedSectionIds.map(
      id => sections.find(section => section.id === id)?.title
    ),
  ].filter(Boolean)

  const update = (changes) => dispatch(actions.setChatContext({ tabId, context: changes }))

  return {
    context,
    sections,
    hasCase,
    hasCitations,
    selectedSectionIds,
    summary,
    isPickerOpen,
    openPicker: () => setIsPickerOpen(true),
    closePicker: () => setIsPickerOpen(false),
    toggle: (key) => update({ [key]: !context[key] }),
    // Resolved in the reducer against the live selection — see the action.
    toggleSection: (sectionId) => dispatch(
      actions.toggleChatContextSection({ tabId, sectionId })
    ),
  }
}
