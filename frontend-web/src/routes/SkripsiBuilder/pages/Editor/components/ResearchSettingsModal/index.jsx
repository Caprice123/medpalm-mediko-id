import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { fetchSetResearchSettings, updateSetResearchSettings, fetchSkripsiDomains } from '@store/skripsi/userAction'
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
const MAX_DOMAINS = 20

function ResearchSettingsModal({ isOpen, onClose, setUniqueId }) {
  const dispatch = useDispatch()
  const [domainFilterEnabled, setDomainFilterEnabled] = useState(true)
  const [selectedDomains, setSelectedDomains] = useState([])
  const [customDomains, setCustomDomains] = useState([])
  const [newCustomDomain, setNewCustomDomain] = useState('')
  const [saving, setSaving] = useState(false)

  const [domains, setDomains] = useState([])
  const [pagination, setPagination] = useState({ page: 1, isLastPage: true })
  const [search, setSearch] = useState('')
  const [domainsLoading, setDomainsLoading] = useState(false)
  const searchTimeoutRef = useRef(null)

  const loadDomains = useCallback(async (page, searchTerm) => {
    setDomainsLoading(true)
    try {
      const result = await dispatch(fetchSkripsiDomains({ page, perPage: PER_PAGE, search: searchTerm }))
      if (result) {
        setDomains(result.domains)
        setPagination(result.pagination)
      }
    } finally {
      setDomainsLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    if (isOpen && setUniqueId) {
      dispatch(fetchSetResearchSettings(setUniqueId)).then(data => {
        if (data) {
          setDomainFilterEnabled(data.domainFilterEnabled)
          setSelectedDomains(data.selectedDomains ?? [])
          setCustomDomains(data.customDomains ?? [])
          setNewCustomDomain('')
        }
      })
      setSearch('')
      loadDomains(1, '')
    }
  }, [isOpen, setUniqueId, dispatch, loadDomains])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)
    clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => loadDomains(1, value), 350)
  }

  const handlePageChange = (page) => loadDomains(page, search)

  const totalSelected = selectedDomains.length + customDomains.length
  const atLimit = totalSelected >= MAX_DOMAINS

  const toggleDomain = (domain) => {
    setSelectedDomains(prev => {
      if (prev.includes(domain)) return prev.filter(d => d !== domain)
      if (atLimit) return prev
      return [...prev, domain]
    })
  }

  const selectAll = () => {
    const pageDomains = domains.map(d => d.domain)
    setSelectedDomains(prev => {
      const merged = Array.from(new Set([...prev, ...pageDomains]))
      const remaining = MAX_DOMAINS - customDomains.length
      return merged.slice(0, remaining)
    })
  }

  const clearAll = () => setSelectedDomains([])

  const addCustomDomain = () => {
    const d = newCustomDomain.trim().toLowerCase()
    if (d && !customDomains.includes(d) && !selectedDomains.includes(d) && !atLimit) {
      setCustomDomains(prev => [...prev, d])
    }
    setNewCustomDomain('')
  }

  const removeCustomDomain = (domain) => setCustomDomains(prev => prev.filter(d => d !== domain))

  const handleSave = async () => {
    setSaving(true)
    try {
      await dispatch(updateSetResearchSettings(setUniqueId, { selectedDomains, customDomains, domainFilterEnabled }))
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const currentPage = pagination.page ?? 1
  const isLastPage = pagination.isLastPage ?? true

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

      {domainFilterEnabled && (
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
            Reset untuk menggunakan semua domain. Pengaturan ini hanya berlaku untuk set riset ini.
          </HintText>

          {(selectedDomains.length > 0 || customDomains.length > 0) && (
            <SelectedSummarySection>
              {selectedDomains.length > 0 && (
                <>
                  <SelectedSummaryLabel>Dipilih dari daftar admin</SelectedSummaryLabel>
                  <SelectedChipsRow>
                    {selectedDomains.map(d => (
                      <AdminDomainChip key={d}>
                        {d}
                        <button type="button" onClick={() => toggleDomain(d)}>✕</button>
                      </AdminDomainChip>
                    ))}
                  </SelectedChipsRow>
                </>
              )}
              {customDomains.length > 0 && (
                <>
                  <SelectedSummaryLabel>Domain kustom set ini</SelectedSummaryLabel>
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
                {domains.map(({ domain }) => {
                  const checked = selectedDomains.includes(domain)
                  const disabled = !checked && atLimit
                  return (
                    <DomainCard key={domain} $checked={checked} $disabled={disabled} onClick={() => !disabled && toggleDomain(domain)} type="button">
                      <DomainCardCheck $checked={checked}>{checked ? '✓' : ''}</DomainCardCheck>
                      {domain}
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
              Domain yang Anda ketik sendiri. Hanya berlaku untuk set riset ini, tidak disimpan ke daftar admin.
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
        </>
      )}
    </Modal>
  )
}

export default ResearchSettingsModal
