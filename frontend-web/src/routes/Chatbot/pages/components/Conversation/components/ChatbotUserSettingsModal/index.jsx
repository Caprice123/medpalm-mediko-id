import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserChatbotSettings, fetchChatbotDomains, fetchChatbotJournals } from '@store/chatbot/userAction'
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
} from './ChatbotUserSettingsModal.styles'

const PER_PAGE = 12
const MAX_DOMAINS = 20

function ChatbotUserSettingsModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { userSettings, loading } = useSelector(state => state.chatbot)
  const isTutor = userSettings.isTutor

  const [domainFilterEnabled, setDomainFilterEnabled] = useState(true)
  const [selectedDomains, setSelectedDomains] = useState([]) // [{ domain, journal_name }]
  const [customDomains, setCustomDomains] = useState([])    // plain strings
  const [newCustomDomain, setNewCustomDomain] = useState('')
  const [selectedJournals, setSelectedJournals] = useState([]) // from admin list
  const [customJournals, setCustomJournals] = useState([])     // manually typed
  const [newCustomJournal, setNewCustomJournal] = useState('')

  const [domains, setDomains] = useState([])
  const [pagination, setPagination] = useState({ page: 1, isLastPage: true })
  const [search, setSearch] = useState('')
  const [domainsLoading, setDomainsLoading] = useState(false)
  const searchTimeoutRef = useRef(null)

  const [journals, setJournals] = useState([])
  const [journalPagination, setJournalPagination] = useState({ page: 1, isLastPage: true })
  const [journalSearch, setJournalSearch] = useState('')
  const [journalsLoading, setJournalsLoading] = useState(false)
  const journalSearchTimeoutRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    setDomainFilterEnabled(userSettings.domainFilterEnabled)
    setSelectedDomains(userSettings.selectedDomains ?? [])
    setCustomDomains(userSettings.customDomains ?? [])
    setSelectedJournals(userSettings.selectedJournals ?? [])
    setCustomJournals(userSettings.customJournals ?? [])
    setNewCustomJournal('')
    setNewCustomDomain('')
    setSearch('')
    setJournalSearch('')
    if (isTutor) {
      loadJournals(1, '')
    } else {
      loadDomains(1, '')
    }
  }, [isOpen, isTutor])

  const loadDomains = useCallback(async (page, searchTerm) => {
    setDomainsLoading(true)
    try {
      const result = await dispatch(fetchChatbotDomains({ page, perPage: PER_PAGE, search: searchTerm }))
      if (result) {
        setDomains(result.domains)
        setPagination(result.pagination)
      }
    } finally {
      setDomainsLoading(false)
    }
  }, [dispatch])

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

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)
    clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => loadDomains(1, value), 350)
  }

  const handlePageChange = (page) => loadDomains(page, search)

  const handleJournalSearchChange = (e) => {
    const value = e.target.value
    setJournalSearch(value)
    clearTimeout(journalSearchTimeoutRef.current)
    journalSearchTimeoutRef.current = setTimeout(() => loadJournals(1, value), 350)
  }

  const handleJournalPageChange = (page) => loadJournals(page, journalSearch)

  const toggleJournal = (journalName) => {
    setSelectedJournals(prev => {
      const exists = prev.includes(journalName)
      if (exists) return prev.filter(j => j !== journalName)
      return [...prev, journalName]
    })
  }

  const selectAllJournals = () => {
    setSelectedJournals(prev => [...new Set([...prev, ...journals.map(j => j.name)])])
  }

  const clearAllJournals = () => { setSelectedJournals([]); setCustomJournals([]) }

  const addCustomJournal = () => {
    const j = newCustomJournal.trim()
    if (j && !customJournals.includes(j) && !selectedJournals.includes(j)) {
      setCustomJournals(prev => [...prev, j])
    }
    setNewCustomJournal('')
  }

  const removeCustomJournal = (name) => setCustomJournals(prev => prev.filter(j => j !== name))

  const totalSelected = selectedDomains.length + customDomains.length
  const atLimit = totalSelected >= MAX_DOMAINS

  const toggleDomain = (item) => {
    // item is { domain, journal_name } from the admin list
    setSelectedDomains(prev => {
      const exists = prev.some(d => d.domain === item.domain)
      if (exists) return prev.filter(d => d.domain !== item.domain)
      if (totalSelected >= MAX_DOMAINS) return prev
      return [...prev, { domain: item.domain, journal_name: item.journal_name ?? '' }]
    })
  }

  const selectAll = () => {
    setSelectedDomains(prev => {
      const existing = new Map(prev.map(d => [d.domain, d]))
      for (const item of domains) {
        if (!existing.has(item.domain)) {
          existing.set(item.domain, { domain: item.domain, journal_name: item.journal_name ?? '' })
        }
      }
      const remaining = MAX_DOMAINS - customDomains.length
      return Array.from(existing.values()).slice(0, remaining)
    })
  }

  const clearAll = () => setSelectedDomains([])

  const addCustomDomain = () => {
    const d = newCustomDomain.trim().toLowerCase()
    const alreadyInSelected = selectedDomains.some(s => s.domain === d)
    if (d && !customDomains.includes(d) && !alreadyInSelected && !atLimit) {
      setCustomDomains(prev => [...prev, d])
    }
    setNewCustomDomain('')
  }

  const removeCustomDomain = (domain) => setCustomDomains(prev => prev.filter(d => d !== domain))

  const handleSave = async () => {
    await dispatch(updateUserChatbotSettings({ selectedDomains, customDomains, domainFilterEnabled, selectedJournals, customJournals }))
    onClose()
  }

  const currentPage = pagination.page ?? 1
  const isLastPage = pagination.isLastPage ?? true

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
      <SectionTitle>Filter Domain</SectionTitle>

      <FilterToggleRow>
        <div>
          <strong>Aktifkan Filter Domain</strong>
          <HintText>Batasi hasil pencarian hanya dari domain terpercaya</HintText>
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

      {domainFilterEnabled && isTutor && (
        <>
          <SelectAllRow>
            <span>
              {selectedJournals.length === 0 && customJournals.length === 0
                ? 'Semua jurnal aktif (default)'
                : <>{selectedJournals.length + customJournals.length} jurnal dipilih</>}
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
            Reset untuk menggunakan semua jurnal. Pilih jurnal tertentu untuk membatasi hasil pencarian OpenAlex.
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
                  return (
                    <DomainCard key={item.name} $checked={checked} $disabled={false} onClick={() => toggleJournal(item.name)} type="button">
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
              <Button variant="secondary" size="small" type="button" onClick={addCustomJournal} disabled={!newCustomJournal.trim()}>
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

      {domainFilterEnabled && !isTutor && (
        <>
          <SelectAllRow>
            <span>
              {totalSelected === 0
                ? 'Semua domain aktif (default)'
                : <>{totalSelected}<span style={{ color: atLimit ? '#ef4444' : '#9ca3af' }}>/{MAX_DOMAINS}</span> domain dipilih</>}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="secondary" size="small" onClick={selectAll} type="button">
                Pilih Halaman Ini
              </Button>
              <Button variant="secondary" size="small" onClick={clearAll} type="button">
                Reset
              </Button>
            </div>
          </SelectAllRow>

          <HintText>
            Reset untuk menggunakan semua domain. Pilih domain tertentu untuk membatasi hasil pencarian.
          </HintText>

          <SearchInput
            type="text"
            placeholder="Cari domain..."
            value={search}
            onChange={handleSearchChange}
          />

          {domainsLoading ? (
            <EmptyDomains>Memuat domain...</EmptyDomains>
          ) : domains.length === 0 ? (
            <EmptyDomains>
              {search ? `Tidak ada domain yang cocok dengan "${search}"` : 'Belum ada domain yang dikonfigurasi oleh admin.'}
            </EmptyDomains>
          ) : (
            <>
              <DomainCardGrid>
                {domains.map((item) => {
                  const checked = selectedDomains.some(d => d.domain === item.domain)
                  const disabled = !checked && atLimit
                  return (
                    <DomainCard key={item.domain} $checked={checked} $disabled={disabled} onClick={() => !disabled && toggleDomain(item)} type="button">
                      <DomainCardCheck $checked={checked}>{checked ? '✓' : ''}</DomainCardCheck>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{item.domain}</span>
                    </DomainCard>
                  )
                })}
              </DomainCardGrid>

              {(currentPage > 1 || !isLastPage) && (
                <PaginationRow>
                  <PageInfo>Halaman {currentPage}</PageInfo>
                  <PageButtons>
                    <PageBtn onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
                      ‹ Sebelumnya
                    </PageBtn>
                    <PageBtn onClick={() => handlePageChange(currentPage + 1)} disabled={isLastPage}>
                      Berikutnya ›
                    </PageBtn>
                  </PageButtons>
                </PaginationRow>
              )}
            </>
          )}

          <CustomDomainSection>
            <CustomDomainTitle>Tambah Domain Kustom</CustomDomainTitle>
            <HintText style={{ marginTop: 0 }}>
              Domain yang Anda ketik sendiri. Hanya berlaku untuk akun Anda, tidak disimpan ke daftar admin.
            </HintText>
            <CustomDomainAddRow>
              <CustomDomainInput
                type="text"
                placeholder="contoh: nature.com"
                value={newCustomDomain}
                onChange={e => setNewCustomDomain(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addCustomDomain())}
              />
              <Button variant="secondary" size="small" type="button" onClick={addCustomDomain} disabled={!newCustomDomain.trim() || atLimit}>
                Tambah
              </Button>
            </CustomDomainAddRow>
          </CustomDomainSection>

          {(selectedDomains.length > 0 || customDomains.length > 0) && (
            <SelectedSummarySection>
              {selectedDomains.length > 0 && (
                <>
                  <SelectedSummaryLabel>Dipilih dari daftar admin</SelectedSummaryLabel>
                  <SelectedChipsRow>
                    {selectedDomains.map(item => (
                      <AdminDomainChip key={item.domain}>
                        {item.domain}
                        <button type="button" onClick={() => toggleDomain(item)}>✕</button>
                      </AdminDomainChip>
                    ))}
                  </SelectedChipsRow>
                </>
              )}
              {customDomains.length > 0 && (
                <>
                  <SelectedSummaryLabel>Domain kustom saya</SelectedSummaryLabel>
                  <SelectedChipsRow>
                    {customDomains.map(d => (
                      <CustomDomainChip key={d}>
                        {d}
                        <button type="button" onClick={() => removeCustomDomain(d)}>✕</button>
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
