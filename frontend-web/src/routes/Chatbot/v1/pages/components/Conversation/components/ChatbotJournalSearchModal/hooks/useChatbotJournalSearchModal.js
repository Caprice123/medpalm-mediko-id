import { useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserChatbotSettings, searchChatbotJournals } from '@store/chatbot/userAction'

const PER_PAGE = 10
const MAX_JOURNALS = 20
const CURRENT_YEAR = new Date().getFullYear()

export function useChatbotJournalSearchModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { userSettings, loading } = useSelector(state => state.chatbot)

  const [domainFilterEnabled, setDomainFilterEnabled] = useState(true)
  const [myJournals, setMyJournals] = useState([]) // unified list — from search or pre-existing (already cleaned up server-side)

  // Year filter state — no "all years" option; narrowest reasonable default is 5 years
  const [yearMode, setYearMode] = useState('latest5') // 'latest5' | 'latest10' | 'custom'
  const [latestYears, setLatestYears] = useState(null)
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')

  // Live search state
  const [journalSearch, setJournalSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchPagination, setSearchPagination] = useState({ page: 1, perPage: PER_PAGE, isLastPage: true })
  const [searching, setSearching] = useState(false)
  const searchTimeoutRef = useRef(null)

  const loadSearch = useCallback(async (page, query) => {
    setSearching(true)
    try {
      const result = await dispatch(searchChatbotJournals({ query, page, perPage: PER_PAGE }))
      setSearchResults(result.data || [])
      setSearchPagination(result.pagination || { page, perPage: PER_PAGE, isLastPage: true })
    } finally {
      setSearching(false)
    }
  }, [dispatch])

  const resetOnOpen = useCallback(() => {
    if (!isOpen) return

    setDomainFilterEnabled(userSettings.domainFilterEnabled)
    const merged = [...new Set([...(userSettings.selectedJournals ?? []), ...(userSettings.customJournals ?? [])])]
    setMyJournals(merged)

    setJournalSearch('')
    loadSearch(1, '') // browse top journals immediately — no need to type first

    if (userSettings.latestYears) {
      setLatestYears(userSettings.latestYears)
      setYearMode(`latest${userSettings.latestYears}`)
      setYearFrom('')
      setYearTo('')
    } else if (userSettings.yearFrom || userSettings.yearTo) {
      setYearMode('custom')
      setLatestYears(null)
      setYearFrom(userSettings.yearFrom ? String(userSettings.yearFrom) : '')
      setYearTo(userSettings.yearTo ? String(userSettings.yearTo) : '')
    } else {
      // No saved preference yet — default to the last 5 years rather than
      // unrestricted "all years".
      setYearMode('latest5')
      setLatestYears(5)
      setYearFrom('')
      setYearTo('')
    }
  }, [isOpen, userSettings, loadSearch])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setJournalSearch(value)
    clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => loadSearch(1, value), 350)
  }

  const handleSearchPageChange = (page) => loadSearch(page, journalSearch)

  const atLimit = myJournals.length >= MAX_JOURNALS

  const addJournal = (name) => {
    if (myJournals.includes(name) || atLimit) return
    setMyJournals(prev => [...prev, name])
  }

  const removeJournal = (name) => {
    setMyJournals(prev => prev.filter(j => j !== name))
  }

  const selectAllResults = () => {
    setMyJournals(prev => {
      const merged = [...new Set([...prev, ...searchResults.map(r => r.name)])]
      return merged.slice(0, MAX_JOURNALS)
    })
  }

  const clearAllJournals = () => setMyJournals([])

  const handleSave = async () => {
    let saveLatestYears = null
    let saveYearFrom = null
    let saveYearTo = null

    if (yearMode === 'custom') {
      saveYearFrom = yearFrom ? parseInt(yearFrom) : null
      saveYearTo = yearTo ? parseInt(yearTo) : null
    } else {
      saveLatestYears = latestYears
    }

    await dispatch(updateUserChatbotSettings({
      domainFilterEnabled,
      selectedJournals: myJournals,
      customJournals: [],
      latestYears: saveLatestYears,
      yearFrom: saveYearFrom,
      yearTo: saveYearTo,
    }))
    onClose()
  }

  return {
    isSaving: loading.isUpdatingSettings,
    domainFilterEnabled,
    setDomainFilterEnabled,
    yearMode,
    setYearMode,
    latestYears,
    setLatestYears,
    yearFrom,
    setYearFrom,
    yearTo,
    setYearTo,
    currentYear: CURRENT_YEAR,
    myJournals,
    maxJournals: MAX_JOURNALS,
    atLimit,
    journalSearch,
    searchResults,
    searchPagination,
    searching,
    resetOnOpen,
    handleSearchChange,
    handleSearchPageChange,
    addJournal,
    removeJournal,
    selectAllResults,
    clearAllJournals,
    handleSave,
  }
}
