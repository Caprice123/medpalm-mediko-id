import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { searchSummaryNotesV2 } from '@store/summaryNotes/v2/userAction'

const DEBOUNCE_MS = 300

export function useSidebarSearch() {
  const dispatch = useDispatch()
  const [query, setQuery] = useState('')
  const debounceRef = useRef(null)

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  const handleChange = useCallback((value) => {
    setQuery(value)
    clearTimeout(debounceRef.current)
    if (value.trim()) {
      debounceRef.current = setTimeout(() => {
        dispatch(searchSummaryNotesV2(value.trim()))
      }, DEBOUNCE_MS)
    }
  }, [dispatch])

  const handleClear = useCallback(() => {
    clearTimeout(debounceRef.current)
    setQuery('')
  }, [])

  return {
    query,
    trimmedQuery: query.trim(),
    isSearching: query.trim().length > 0,
    handleChange,
    handleClear,
  }
}
