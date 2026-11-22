import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { actions, selectChatContext } from '@store/skripsi/v2/reducer'

// Matches the cap the server enforces in skripsiReportContextV2. Three whole
// sections is already most of a model's attention; past that the question
// itself starts losing.
export const MAX_CONTEXT_SECTIONS = 3

// What the next message carries with it. The selection lives in Redux keyed by
// tab, so switching tabs and coming back keeps it, and `sendMessage` reads it
// at send time rather than being handed it from here.
export const useContextBar = (tabId) => {
  const dispatch = useDispatch()

  const context = useSelector(state => selectChatContext(state, tabId), shallowEqual)
  const sections = useSelector(state => state.skripsiV2.sections, shallowEqual)
  // A report created without one has nothing to attach, and a chip that sends
  // an empty string is worse than no chip.
  const hasCase = useSelector(state => Boolean(state.skripsiV2.currentSet?.caseText))
  const hasCitations = useSelector(state => state.skripsiV2.citations.length > 0)

  const attachedSections = context.sectionIds
    .map(id => sections.find(section => section.id === id))
    .filter(Boolean)

  const availableSections = sections.filter(section => !context.sectionIds.includes(section.id))

  const update = (changes) => dispatch(actions.setChatContext({ tabId, context: changes }))

  return {
    context,
    hasCase,
    hasCitations,
    attachedSections,
    availableSections,
    canAddSection: context.sectionIds.length < MAX_CONTEXT_SECTIONS && availableSections.length > 0,
    toggle: (key) => update({ [key]: !context[key] }),
    addSection: (sectionId) => {
      if (!sectionId || context.sectionIds.includes(sectionId)) return
      if (context.sectionIds.length >= MAX_CONTEXT_SECTIONS) return

      update({ sectionIds: [...context.sectionIds, sectionId] })
    },
    removeSection: (sectionId) => update({
      sectionIds: context.sectionIds.filter(id => id !== sectionId),
    }),
  }
}
