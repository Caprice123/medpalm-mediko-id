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
} from './ResearchSettingsModal.styles'

const PER_PAGE = 12
const MAX_JOURNALS = 20

function ResearchSettingsModal({ isOpen, onClose, setUniqueId }) {
  const dispatch = useDispatch()
  const [domainFilterEnabled, setDomainFilterEnabled] = useState(true)
  const [selectedJournals, setSelectedJournals] = useState([])
  const [customJournals, setCustomJournals] = useState([])
  const [newCustomJournal, setNewCustomJournal] = useState('')
  const [saving, setSaving] = useState(false)

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
    setSaving(true)
    try {
      await dispatch(updateSetResearchSettings(setUniqueId, { domainFilterEnabled, selectedJournals, customJournals }))
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
