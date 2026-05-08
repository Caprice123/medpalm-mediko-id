import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserChatbotSettings, fetchChatbotJournals } from '@store/chatbot/userAction'
import { getUserData } from '@utils/authToken'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { ToggleSlider, ToggleSwitch } from '@routes/Admin/Features/subpages/SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'
import {
  SectionTitle,
  HintText,
  FilterToggleRow,
  SelectAllRow,
  SearchInput,
  DomainCardGrid,
  DomainCard,
  DomainCardCheck,
  PaginationRow,
  PageInfo,
  PageButtons,
  PageBtn,
  EmptyDomains,
  SelectedSummarySection,
  SelectedSummaryLabel,
  SelectedChipsRow,
  AdminDomainChip,
  CustomDomainSection,
  CustomDomainTitle,
  CustomDomainAddRow,
  CustomDomainInput,
  CustomDomainChips,
  CustomDomainChip,
  YearFilterSection,
  YearPresetRow,
  YearPresetBtn,
  YearRangeRow,
  YearInput,
} from './ChatbotUserSettingsModal.styles'

const PER_PAGE = 12
const MAX_JOURNALS = 20
const CURRENT_YEAR = new Date().getFullYear()


function ChatbotUserSettingsModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { userSettings, loading } = useSelector(state => state.chatbot)
  const isNonUser = getUserData()?.role !== 'user'

  const [domainFilterEnabled, setDomainFilterEnabled] = useState(true)
  const [selectedJournals, setSelectedJournals] = useState([]) // from admin list
  const [customJournals, setCustomJournals] = useState([])     // manually typed
  const [newCustomJournal, setNewCustomJournal] = useState('')

  // Year filter state
  const [yearMode, setYearMode] = useState('default') // 'default' | 'latest5' | 'latest10' | 'custom'
  const [latestYears, setLatestYears] = useState(null)
  const [yearFrom, setYearFrom] = useState('')
  const [yearTo, setYearTo] = useState('')

  const [journals, setJournals] = useState([])
  const [journalPagination, setJournalPagination] = useState({ page: 1, isLastPage: true })
  const [journalSearch, setJournalSearch] = useState('')
  const [journalsLoading, setJournalsLoading] = useState(false)
  const journalSearchTimeoutRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    setDomainFilterEnabled(userSettings.domainFilterEnabled)
    setSelectedJournals(userSettings.selectedJournals ?? [])
    setCustomJournals(userSettings.customJournals ?? [])
    setNewCustomJournal('')
    setJournalSearch('')
    loadJournals(1, '')

    // Restore year filter state
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
      setYearMode('default')
      setLatestYears(null)
      setYearFrom('')
      setYearTo('')
    }
  }, [isOpen])

  const loadJournals = useCallback(async (page, searchTerm) => {
    setJournalsLoading(true)
    try {
      const result = await dispatch(fetchChatbotJournals({ page, perPage: PER_PAGE, search: searchTerm }))
      if (result) {
        setJournals(result.journals)
        setJournalPagination(result.pagination)
      }
    } finally {
      setJournalsLoading(false)
    }
  }, [dispatch])

  const handleJournalSearchChange = (e) => {
    const value = e.target.value
    setJournalSearch(value)
    clearTimeout(journalSearchTimeoutRef.current)
    journalSearchTimeoutRef.current = setTimeout(() => loadJournals(1, value), 350)
  }

  const handleJournalPageChange = (page) => loadJournals(page, journalSearch)

  const totalSelected = selectedJournals.length + customJournals.length
  const atLimit = totalSelected >= MAX_JOURNALS

  const toggleJournal = (journalName) => {
    setSelectedJournals(prev => {
      const exists = prev.includes(journalName)
      if (exists) return prev.filter(j => j !== journalName)
      if (totalSelected >= MAX_JOURNALS) return prev
      return [...prev, journalName]
    })
  }

  const selectAllJournals = () => {
    setSelectedJournals(prev => {
      const merged = [...new Set([...prev, ...journals.map(j => j.name)])]
      const remaining = MAX_JOURNALS - customJournals.length
      return merged.slice(0, remaining)
    })
  }

  const clearAllJournals = () => { setSelectedJournals([]); setCustomJournals([]) }

  const addCustomJournal = () => {
    const j = newCustomJournal.trim()
    if (j && !customJournals.includes(j) && !selectedJournals.includes(j) && !atLimit) {
      setCustomJournals(prev => [...prev, j])
    }
    setNewCustomJournal('')
  }

  const removeCustomJournal = (name) => setCustomJournals(prev => prev.filter(j => j !== name))

  const handleSave = async () => {
    let saveLatestYears = null
    let saveYearFrom = null
    let saveYearTo = null

    if (yearMode !== 'default' && yearMode !== 'custom') {
      // preset: extract N from e.g. 'latest5'
      saveLatestYears = latestYears
    } else if (yearMode === 'custom') {
      saveYearFrom = yearFrom ? parseInt(yearFrom) : null
      saveYearTo   = yearTo   ? parseInt(yearTo)   : null
    }

    await dispatch(updateUserChatbotSettings({
      domainFilterEnabled,
      selectedJournals,
      customJournals,
      latestYears: saveLatestYears,
      yearFrom: saveYearFrom,
      yearTo: saveYearTo,
    }))
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Research Mode"
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading.isUpdatingSettings}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading.isUpdatingSettings}>
            {loading.isUpdatingSettings ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      }
    >
      <SectionTitle>Filter Jurnal</SectionTitle>

      <FilterToggleRow>
        <div>
          <strong>Aktifkan Filter Jurnal</strong>
          <HintText>Batasi hasil pencarian hanya dari jurnal terpercaya</HintText>
        </div>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={domainFilterEnabled}
            onChange={e => setDomainFilterEnabled(e.target.checked)}
          />
          <ToggleSlider />
        </ToggleSwitch>
      </FilterToggleRow>

      {isNonUser && <YearFilterSection>
        <SectionTitle>Filter Tahun Publikasi</SectionTitle>
        <HintText>Batasi pencarian berdasarkan tahun terbit artikel.</HintText>
        <YearPresetRow>
          <YearPresetBtn
            type="button"
            $active={yearMode === 'default'}
            onClick={() => { setYearMode('default'); setLatestYears(null); setYearFrom(''); setYearTo('') }}
          >
            Semua Tahun
          </YearPresetBtn>
          <YearPresetBtn
            type="button"
            $active={yearMode === 'latest5'}
            onClick={() => { setYearMode('latest5'); setLatestYears(5); setYearFrom(''); setYearTo('') }}
          >
            5 Tahun Terakhir
          </YearPresetBtn>
          <YearPresetBtn
            type="button"
            $active={yearMode === 'latest10'}
            onClick={() => { setYearMode('latest10'); setLatestYears(10); setYearFrom(''); setYearTo('') }}
          >
            10 Tahun Terakhir
          </YearPresetBtn>
          <YearPresetBtn
            type="button"
            $active={yearMode === 'custom'}
            onClick={() => { setYearMode('custom'); setLatestYears(null) }}
          >
            Kustom
          </YearPresetBtn>
        </YearPresetRow>

        {yearMode === 'custom' && (
          <>
            <YearRangeRow>
              <span>Dari</span>
              <YearInput
                type="number"
                placeholder="1900"
                min="1900"
                max={CURRENT_YEAR}
                value={yearFrom}
                onChange={e => setYearFrom(e.target.value)}
              />
              <span>sampai</span>
              <YearInput
                type="number"
                placeholder={String(CURRENT_YEAR)}
                min="1900"
                max={CURRENT_YEAR}
                value={yearTo}
                onChange={e => setYearTo(e.target.value)}
              />
            </YearRangeRow>
            <HintText>Kosongkan salah satu untuk tidak membatasi batas tersebut.</HintText>
          </>
        )}

        {yearMode !== 'default' && yearMode !== 'custom' && (
          <HintText>
            Menampilkan artikel dari tahun {CURRENT_YEAR - latestYears} ke atas (dihitung saat pencarian).
          </HintText>
        )}
      </YearFilterSection>}

      {domainFilterEnabled && (
        <>
          <SelectAllRow>
            <span>
              {selectedJournals.length === 0 && customJournals.length === 0
                ? 'Semua jurnal aktif (default)'
                : <>{totalSelected}<span style={{ color: atLimit ? '#ef4444' : '#9ca3af' }}>/{MAX_JOURNALS}</span> jurnal dipilih</>}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="secondary" size="small" onClick={selectAllJournals} type="button">
                Pilih Halaman Ini
              </Button>
              <Button variant="secondary" size="small" onClick={clearAllJournals} type="button">
                Reset
              </Button>
            </div>
          </SelectAllRow>

          <HintText>
            Reset untuk menggunakan semua jurnal. Pilih jurnal tertentu untuk membatasi hasil pencarian.
          </HintText>

          <SearchInput
            type="text"
            placeholder="Cari jurnal..."
            value={journalSearch}
            onChange={handleJournalSearchChange}
          />

          {journalsLoading ? (
            <EmptyDomains>Memuat jurnal...</EmptyDomains>
          ) : journals.length === 0 ? (
            <EmptyDomains>
              {journalSearch ? `Tidak ada jurnal yang cocok dengan "${journalSearch}"` : 'Belum ada jurnal yang dikonfigurasi oleh admin.'}
            </EmptyDomains>
          ) : (
            <>
              <DomainCardGrid>
                {journals.map((item) => {
                  const checked = selectedJournals.includes(item.name)
                  const disabled = !checked && atLimit
                  return (
                    <DomainCard key={item.name} $checked={checked} $disabled={disabled} onClick={() => !disabled && toggleJournal(item.name)} type="button">
                      <DomainCardCheck $checked={checked}>{checked ? '✓' : ''}</DomainCardCheck>
                      <span style={{ fontWeight: 500, fontSize: '0.8rem' }}>{item.name}</span>
                    </DomainCard>
                  )
                })}
              </DomainCardGrid>

              {(journalPagination.page > 1 || !journalPagination.isLastPage) && (
                <PaginationRow>
                  <PageInfo>Halaman {journalPagination.page}</PageInfo>
                  <PageButtons>
                    <PageBtn onClick={() => handleJournalPageChange(journalPagination.page - 1)} disabled={journalPagination.page <= 1}>
                      ‹ Sebelumnya
                    </PageBtn>
                    <PageBtn onClick={() => handleJournalPageChange(journalPagination.page + 1)} disabled={journalPagination.isLastPage}>
                      Berikutnya ›
                    </PageBtn>
                  </PageButtons>
                </PaginationRow>
              )}
            </>
          )}

          <CustomDomainSection>
            <CustomDomainTitle>Tambah Jurnal Kustom</CustomDomainTitle>
            <HintText style={{ marginTop: 0 }}>
              Nama jurnal yang tidak ada di daftar admin. Hanya berlaku untuk akun Anda.
            </HintText>
            <CustomDomainAddRow>
              <CustomDomainInput
                type="text"
                placeholder="contoh: Nature Medicine"
                value={newCustomJournal}
                onChange={e => setNewCustomJournal(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addCustomJournal())}
              />
              <Button variant="secondary" size="small" type="button" onClick={addCustomJournal} disabled={!newCustomJournal.trim() || atLimit}>
                Tambah
              </Button>
            </CustomDomainAddRow>
          </CustomDomainSection>

          {(selectedJournals.length > 0 || customJournals.length > 0) && (
            <SelectedSummarySection>
              {selectedJournals.length > 0 && (
                <>
                  <SelectedSummaryLabel>Dipilih dari daftar admin</SelectedSummaryLabel>
                  <SelectedChipsRow>
                    {selectedJournals.map(name => (
                      <AdminDomainChip key={name}>
                        {name}
                        <button type="button" onClick={() => toggleJournal(name)}>✕</button>
                      </AdminDomainChip>
                    ))}
                  </SelectedChipsRow>
                </>
              )}
              {customJournals.length > 0 && (
                <>
                  <SelectedSummaryLabel>Jurnal kustom saya</SelectedSummaryLabel>
                  <SelectedChipsRow>
                    {customJournals.map(name => (
                      <CustomDomainChip key={name}>
                        {name}
                        <button type="button" onClick={() => removeCustomJournal(name)}>✕</button>
                      </CustomDomainChip>
                    ))}
                  </SelectedChipsRow>
                </>
              )}
            </SelectedSummarySection>
          )}
        </>
      )}

    </Modal>
  )
}

export default ChatbotUserSettingsModal
