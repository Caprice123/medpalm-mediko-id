import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSetResearchSettings, updateSetResearchSettings, searchSkripsiJournals } from '@store/skripsi/v2'

const PER_PAGE = 10
// A research query carries its journal filter into the upstream search, which
// has a practical limit on how long that filter can get.
const MAX_JOURNALS = 20
const SEARCH_DEBOUNCE_MS = 350

const currentYear = new Date().getFullYear()

// Research settings for one SET — which journals its searches draw from, and
// how far back. Unlike the chatbot's equivalent these belong to the set rather
// than the user, so two skripsi sets can search different literature.
//
// Every selectable journal comes from a live lookup rather than a free-text
// field, so a student cannot save a name that fails to resolve at search time.
export const useResearchSettingsModal = ({ isOpen, onClose, setUniqueId }) => {
  const dispatch = useDispatch()
  const isSaving = useSelector(state => state.skripsiV2.loading.isUpdatingResearchSettings)

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
      const result = await dispatch(searchSkripsiJournals({ query, page, perPage: PER_PAGE }))
      setSearchResults(result.data || [])
      setSearchPagination(result.pagination || { page, perPage: PER_PAGE, isLastPage: true })
    } finally {
      setIsSearching(false)
    }
  }, [dispatch])

  // Opening the modal seeds the form from the set's saved settings. The saved
  // journals arrive split into curated and custom; the picker treats them as
  // one list, because at search time the distinction does not exist.
  useEffect(() => {
    if (!isOpen || !setUniqueId) return

    let cancelled = false

    setJournalSearch('')
    // Browse the top journals straight away rather than showing an empty box
    // the student has to type into first.
    loadSearch(1, '')

    dispatch(fetchSetResearchSettings(setUniqueId)).then((data) => {
      if (cancelled || !data) return

      setDomainFilterEnabled(data.domainFilterEnabled)
      setMyJournals([...new Set([
        ...(data.selectedJournals ?? []),
        ...(data.customJournals ?? []),
      ])])

      if (data.latestYears) {
        setYearMode(`latest${data.latestYears}`)
        setLatestYears(data.latestYears)
        setYearFrom('')
        setYearTo('')
        return
      }

      if (data.yearFrom || data.yearTo) {
        setYearMode('custom')
        setLatestYears(null)
        setYearFrom(data.yearFrom ? String(data.yearFrom) : '')
        setYearTo(data.yearTo ? String(data.yearTo) : '')
        return
      }

      setYearMode('latest5')
      setLatestYears(5)
      setYearFrom('')
      setYearTo('')
    })

    // A slow settings read must not land after the modal has closed again.
    return () => { cancelled = true }
  }, [isOpen, setUniqueId, dispatch, loadSearch])

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

    await dispatch(updateSetResearchSettings(setUniqueId, {
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
