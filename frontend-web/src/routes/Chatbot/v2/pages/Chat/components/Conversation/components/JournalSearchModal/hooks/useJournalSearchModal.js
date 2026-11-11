import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchChatbotJournals, updateUserChatbotSettings } from '@store/chatbot/v2'

const PER_PAGE = 10
// A research query carries its journal filter into the upstream search, which
// has a practical limit on how long that filter can get.
const MAX_JOURNALS = 20
const SEARCH_DEBOUNCE_MS = 350

const currentYear = new Date().getFullYear()

// Research-mode settings: which journals to trust, and how far back to look.
//
// Every selectable journal comes from a live lookup rather than a free-text
// field, so a student cannot save a name that fails to resolve at chat time.
export const useJournalSearchModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const userSettings = useSelector(state => state.chatbotV2.userSettings)
  const isSaving = useSelector(state => state.chatbotV2.loading.isUpdatingSettings)

  const [domainFilterEnabled, setDomainFilterEnabled] = useState(true)
  const [myJournals, setMyJournals] = useState([])

  // 'latest5' | 'latest10' | 'custom'. There is deliberately no "all years":
  // unrestricted search returns too much superseded literature to be useful.
  const [yearMode, setYearMode] = useState('latest5')
  const [latestYears, setLatestYears] = useState(5)
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')

  const [journalSearch, setJournalSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchPagination, setSearchPagination] = useState({ page: 1, perPage: PER_PAGE, isLastPage: true })
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef(null)

  const loadSearch = useCallback(async (page, query) => {
    setIsSearching(true)
    try {
      const result = await dispatch(searchChatbotJournals({ query, page, perPage: PER_PAGE }))
      setSearchResults(result.data || [])
      setSearchPagination(result.pagination || { page, perPage: PER_PAGE, isLastPage: true })
    } finally {
      setIsSearching(false)
    }
  }, [dispatch])

  // Opening the modal seeds the form from saved settings. The saved journals
  // arrive already split into curated and custom; the picker treats them as one
  // list, because at search time the distinction does not exist.
  useEffect(() => {
    if (!isOpen) return

    setDomainFilterEnabled(userSettings.domainFilterEnabled)
    setMyJournals([...new Set([
      ...(userSettings.selectedJournals ?? []),
      ...(userSettings.customJournals ?? []),
    ])])

    setJournalSearch('')
    // Browse the top journals straight away rather than showing an empty box
    // the user has to type into first.
    loadSearch(1, '')

    if (userSettings.latestYears) {
      setYearMode(`latest${userSettings.latestYears}`)
      setLatestYears(userSettings.latestYears)
      setYearFrom('')
      setYearTo('')
      return
    }

    if (userSettings.yearFrom || userSettings.yearTo) {
      setYearMode('custom')
      setLatestYears(null)
      setYearFrom(userSettings.yearFrom ? String(userSettings.yearFrom) : '')
      setYearTo(userSettings.yearTo ? String(userSettings.yearTo) : '')
      return
    }

    setYearMode('latest5')
    setLatestYears(5)
    setYearFrom('')
    setYearTo('')
    // Re-seeding whenever `userSettings` changes identity would wipe the user's
    // in-progress edits, so this runs on open only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => () => clearTimeout(searchTimeoutRef.current), [])

  const atLimit = myJournals.length >= MAX_JOURNALS

  const handleSearchChange = (event) => {
    const { value } = event.target
    setJournalSearch(value)

    clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => loadSearch(1, value), SEARCH_DEBOUNCE_MS)
  }

  const handleSearchPageChange = (page) => loadSearch(page, journalSearch)

  const addJournal = (name) => {
    if (myJournals.includes(name) || atLimit) return
    setMyJournals(prev => [...prev, name])
  }

  const removeJournal = (name) => {
    setMyJournals(prev => prev.filter(journal => journal !== name))
  }

  const selectAllResults = () => {
    setMyJournals(prev => [...new Set([...prev, ...searchResults.map(r => r.name)])].slice(0, MAX_JOURNALS))
  }

  // An empty list means "no journal restriction", which is the default.
  const clearAllJournals = () => setMyJournals([])

  const chooseYearPreset = (mode, years) => {
    setYearMode(mode)
    setLatestYears(years)
    setYearFrom('')
    setYearTo('')
  }

  const chooseCustomYears = () => {
    setYearMode('custom')
    setLatestYears(null)
  }

  const handleSave = async () => {
    // The two year filters are mutually exclusive — a rolling window or an
    // explicit range, never both.
    const isCustom = yearMode === 'custom'

    await dispatch(updateUserChatbotSettings({
      domainFilterEnabled,
      selectedJournals: myJournals,
      customJournals: [],
      latestYears: isCustom ? null : latestYears,
      yearFrom: isCustom && yearFrom ? parseInt(yearFrom) : null,
      yearTo: isCustom && yearTo ? parseInt(yearTo) : null,
    }))

    onClose()
  }

  return {
    isSaving,
    domainFilterEnabled,
    setDomainFilterEnabled,
    yearMode,
    latestYears,
    yearFrom,
    setYearFrom,
    yearTo,
    setYearTo,
    currentYear,
    chooseYearPreset,
    chooseCustomYears,
    myJournals,
    maxJournals: MAX_JOURNALS,
    atLimit,
    journalSearch,
    searchResults,
    searchPagination,
    isSearching,
    handleSearchChange,
    handleSearchPageChange,
    addJournal,
    removeJournal,
    selectAllResults,
    clearAllJournals,
    handleSave,
  }
}
