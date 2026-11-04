import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

/**
 * The search box's draft text. Redux holds the applied term; this holds what is
 * currently typed, so the list refetches on submit rather than per keystroke.
 */
export function useClaimableTrack({ onSearchSubmit }) {
  const { filter } = useSelector(state => state.eventV2)
  const [draft, setDraft] = useState(filter.search || '')

  useEffect(() => {
    setDraft(filter.search || '')
  }, [filter.search])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = draft.trim()
    if (trimmed === (filter.search || '')) return
    onSearchSubmit(trimmed)
  }

  return { draft, setDraft, appliedSearch: filter.search, handleSubmit }
}
