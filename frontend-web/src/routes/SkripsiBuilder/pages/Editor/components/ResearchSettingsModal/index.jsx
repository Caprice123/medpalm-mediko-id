import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { fetchSetResearchSettings, updateSetResearchSettings, fetchSkripsiJournals } from '@store/skripsi/userAction'
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
  CustomDomainChip,
  YearFilterSection,
  YearPresetRow,
  YearPresetBtn,
  YearRangeRow,
  YearInput,
} from './ResearchSettingsModal.styles'

const PER_PAGE = 12
const MAX_JOURNALS = 20
const CURRENT_YEAR = new Date().getFullYear()

function ResearchSettingsModal({ isOpen, onClose, setUniqueId }) {
  const dispatch = useDispatch()
  const [domainFilterEnabled, setDomainFilterEnabled] = useState(true)
  const [selectedJournals, setSelectedJournals] = useState([])
  const [customJournals, setCustomJournals] = useState([])
  const [newCustomJournal, setNewCustomJournal] = useState('')
  const [saving, setSaving] = useState(false)

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

  const loadJournals = useCallback(async (page, searchTerm) => {
    setJournalsLoading(true)
    try {
      const result = await dispatch(fetchSkripsiJournals({ page, perPage: PER_PAGE, search: searchTerm }))
      if (result) {
        setJournals(result.journals)
        setJournalPagination(result.pagination)
      }
    } finally {
      setJournalsLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    if (isOpen && setUniqueId) {
      dispatch(fetchSetResearchSettings(setUniqueId)).then(data => {
        if (data) {
          setDomainFilterEnabled(data.domainFilterEnabled)
          setSelectedJournals(data.selectedJournals ?? [])
          setCustomJournals(data.customJournals ?? [])
          setNewCustomJournal('')

          // Restore year filter state
          if (data.latestYears) {
            setLatestYears(data.latestYears)
            setYearMode(`latest${data.latestYears}`)
            setYearFrom('')
            setYearTo('')
          } else if (data.yearFrom || data.yearTo) {
            setYearMode('custom')
            setLatestYears(null)
            setYearFrom(data.yearFrom ? String(data.yearFrom) : '')
            setYearTo(data.yearTo ? String(data.yearTo) : '')
          } else {
            setYearMode('default')
            setLatestYears(null)
            setYearFrom('')
            setYearTo('')
          }
        }
      })
      setJournalSearch('')
      loadJournals(1, '')
    }
  }, [isOpen, setUniqueId, dispatch, loadJournals])

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
      saveLatestYears = latestYears
    } else if (yearMode === 'custom') {
      saveYearFrom = yearFrom ? parseInt(yearFrom) : null
      saveYearTo   = yearTo   ? parseInt(yearTo)   : null
    }

    setSaving(true)
    try {
      await dispatch(updateSetResearchSettings(setUniqueId, {
        domainFilterEnabled,
        selectedJournals,
        customJournals,
        latestYears: saveLatestYears,
        yearFrom: saveYearFrom,
        yearTo: saveYearTo,
      }))
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Research Mode — Set Ini"
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan'}
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

      <YearFilterSection>
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
      </YearFilterSection>

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
              Nama jurnal yang tidak ada di daftar admin. Hanya berlaku untuk set riset ini.
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
                  <SelectedSummaryLabel>Jurnal kustom set ini</SelectedSummaryLabel>
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

export default ResearchSettingsModal
