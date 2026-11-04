import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

/**
 * The search box's draft text. Redux holds the *applied* search term; this holds
 * what is currently typed, so the list only refetches on submit rather than on
 * every keystroke.
 */
export function useWebinarFilters({ onSearchSubmit }) {
  const { filter } = useSelector(state => state.webinarV2)
  const [draft, setDraft] = useState(filter.search || '')

  // Keep the box in step when the applied term changes elsewhere (a reset, or a
  // return to the page with a term already in state).
  useEffect(() => {
    setDraft(filter.search || '')
  }, [filter.search])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = draft.trim()
    if (trimmed === (filter.search || '')) return
    onSearchSubmit(trimmed)
  }

  return {
    draft,
    setDraft,
    activeStatus: filter.registrationStatus,
    handleSubmit,
  }
}
