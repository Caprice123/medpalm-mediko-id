import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChatbotDomains, searchChatbotJournals, updateUserChatbotSettings } from '@store/chatbot/v2'

const PER_PAGE = 10
// A research query carries its source filter into the upstream search, which
// has a practical limit on how long that filter can get.
const MAX_SOURCES = 20
const SEARCH_DEBOUNCE_MS = 350

const currentYear = new Date().getFullYear()

// The two providers trust different things, so the picker speaks whichever
// vocabulary the active one actually filters by.
const VOCABULARY = {
  openalex: {
    sectionTitle: 'Filter Jurnal',
    toggleLabel: 'Aktifkan Filter Jurnal',
    toggleHint: 'Batasi hasil pencarian hanya dari jurnal terpercaya',
    allActive: 'Semua jurnal aktif (default)',
    countNoun: 'jurnal dipilih',
    browseHint: 'Cari nama jurnal untuk mempersempit, atau jelajahi daftarnya. Reset untuk menggunakan semua jurnal.',
    searchPlaceholder: 'Cari jurnal, contoh: Nature Medicine...',
    searchHint: 'Ketik kata lengkap untuk hasil terbaik (misalnya "Nature", bukan "Nat").',
    loadingText: 'Memuat jurnal...',
    emptyText: 'Belum ada jurnal yang tersedia.',
    noMatchText: (query) => `Tidak ada jurnal yang cocok dengan "${query}"`,
    selectedLabel: 'Jurnal dipilih',
    metaFallback: 'Penerbit tidak diketahui',
  },
  perplexity: {
    sectionTitle: 'Filter Domain',
    toggleLabel: 'Aktifkan Filter Domain',
    toggleHint: 'Batasi hasil pencarian hanya dari domain terpercaya',
    allActive: 'Semua domain aktif (default)',
    countNoun: 'domain dipilih',
    browseHint: 'Cari domain untuk mempersempit, atau jelajahi daftarnya. Reset untuk menggunakan semua domain.',
    searchPlaceholder: 'Cari domain, contoh: thelancet.com...',
    searchHint: 'Cukup sebagian nama domain, misalnya "lancet".',
    loadingText: 'Memuat domain...',
    emptyText: 'Belum ada domain yang tersedia.',
    noMatchText: (query) => `Tidak ada domain yang cocok dengan "${query}"`,
    selectedLabel: 'Domain dipilih',
    metaFallback: 'Domain terpercaya',
  },
}

const toNameList = (...lists) => [...new Set(
  lists.flat().map(item => (typeof item === 'string' ? item : item?.domain)).filter(Boolean)
)]

// Research-mode settings: which sources to trust, and how far back to look.
//
// Every selectable source comes from a live lookup rather than a free-text
// field, so a student cannot save a name that fails to resolve at chat time.
export const useJournalSearchModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const userSettings = useSelector(state => state.chatbotV2.userSettings)
  const researchProvider = useSelector(state => state.chatbotV2.researchProvider)
  const isSaving = useSelector(state => state.chatbotV2.loading.isUpdatingSettings)

  const isDomainMode = researchProvider === 'perplexity'
  const vocabulary = isDomainMode ? VOCABULARY.perplexity : VOCABULARY.openalex

  const [domainFilterEnabled, setDomainFilterEnabled] = useState(true)
  const [mySources, setMySources] = useState([])

  // 'latest5' | 'latest10' | 'custom'. There is deliberately no "all years":
  // unrestricted search returns too much superseded literature to be useful.
  const [yearMode, setYearMode] = useState('latest5')
  const [latestYears, setLatestYears] = useState(5)
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')

  const [sourceSearch, setSourceSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchPagination, setSearchPagination] = useState({ page: 1, perPage: PER_PAGE, isLastPage: true })
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef(null)

  // Both lookups are paginated and searchable but shaped differently, so each
  // result is flattened to the { id, name, meta } the picker renders.
  const loadSearch = useCallback(async (page, query) => {
    setIsSearching(true)
    try {
      if (isDomainMode) {
        const result = await dispatch(fetchChatbotDomains({ page, perPage: PER_PAGE, search: query }))
        setSearchResults((result.domains || []).map(d => ({ id: d.id, name: d.domain, meta: d.journal_name })))
        setSearchPagination(result.pagination || { page, perPage: PER_PAGE, isLastPage: true })
        return
      }

      const result = await dispatch(searchChatbotJournals({ query, page, perPage: PER_PAGE }))
      setSearchResults((result.data || []).map(j => ({ id: j.id, name: j.name, meta: j.publisher })))
      setSearchPagination(result.pagination || { page, perPage: PER_PAGE, isLastPage: true })
    } finally {
      setIsSearching(false)
    }
  }, [dispatch, isDomainMode])

  // Opening the modal seeds the form from saved settings. The saved picks arrive
  // already split into curated and custom; the picker treats them as one list,
  // because at search time the distinction does not exist.
  useEffect(() => {
    if (!isOpen) return

    setDomainFilterEnabled(userSettings.domainFilterEnabled)
    setMySources(isDomainMode
      ? toNameList(userSettings.selectedDomains ?? [], userSettings.customDomains ?? [])
      : toNameList(userSettings.selectedJournals ?? [], userSettings.customJournals ?? []))

    setSourceSearch('')
    // Browse the top sources straight away rather than showing an empty box
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

  const atLimit = mySources.length >= MAX_SOURCES

  const handleSearchChange = (event) => {
    const { value } = event.target
    setSourceSearch(value)

    clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => loadSearch(1, value), SEARCH_DEBOUNCE_MS)
  }

  const handleSearchPageChange = (page) => loadSearch(page, sourceSearch)

  const addSource = (name) => {
    if (mySources.includes(name) || atLimit) return
    setMySources(prev => [...prev, name])
  }

  const removeSource = (name) => {
    setMySources(prev => prev.filter(source => source !== name))
  }

  const selectAllResults = () => {
    setMySources(prev => [...new Set([...prev, ...searchResults.map(r => r.name)])].slice(0, MAX_SOURCES))
  }

  // An empty list means "no source restriction", which is the default.
  const clearAllSources = () => setMySources([])

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

    // Only the active provider's list is submitted. The backend leaves a list it
    // was not sent alone, so the other provider's pick survives a switch.
    await dispatch(updateUserChatbotSettings({
      domainFilterEnabled,
      ...(isDomainMode
        ? { selectedDomains: mySources, customDomains: [] }
        : { selectedJournals: mySources, customJournals: [] }),
      latestYears: isCustom ? null : latestYears,
      yearFrom: isCustom && yearFrom ? parseInt(yearFrom) : null,
      yearTo: isCustom && yearTo ? parseInt(yearTo) : null,
    }))

    onClose()
  }

  return {
    isSaving,
    vocabulary,
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
    mySources,
    maxSources: MAX_SOURCES,
    atLimit,
    sourceSearch,
    searchResults,
    searchPagination,
    isSearching,
    handleSearchChange,
    handleSearchPageChange,
    addSource,
    removeSource,
    selectAllResults,
    clearAllSources,
    handleSave,
  }
}
