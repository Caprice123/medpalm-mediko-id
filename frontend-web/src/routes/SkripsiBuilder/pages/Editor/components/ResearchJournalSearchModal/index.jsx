import { useEffect } from 'react'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { ToggleSlider, ToggleSwitch } from '@routes/Admin/Features/subpages/SummaryNotes/components/SummaryNotesSettingsModal/SummaryNotesSettingsModal.styles'
import { useResearchJournalSearchModal } from './hooks/useResearchJournalSearchModal'
import {
  SectionTitle,
  HintText,
  FilterToggleRow,
  SelectAllRow,
  SearchInput,
  ResultCardGrid,
  ResultCard,
  ResultCardCheck,
  ResultCardBody,
  ResultCardName,
  ResultCardMeta,
  PaginationRow,
  PageInfo,
  PageButtons,
  PageBtn,
  EmptyResults,
  SelectedSummarySection,
  SelectedSummaryLabel,
  SelectedChipsRow,
  SelectedJournalChip,
  YearFilterSection,
  YearPresetRow,
  YearPresetBtn,
  YearRangeRow,
  YearInput,
} from './ResearchJournalSearchModal.styles'

// Journal picker backed by a live OpenAlex search — replaces the old
// admin-curated-list + free-text-custom-input picker. Every selectable
// result comes directly from OpenAlex, so a user can never save a journal
// name that won't actually resolve at chat time. Mirrors
// ChatbotJournalSearchModal, scoped to one skripsi research set instead of
// global user settings.
function ResearchJournalSearchModal({ isOpen, onClose, setUniqueId }) {
  const {
    isSaving,
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
    currentYear,
    myJournals,
    maxJournals,
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
  } = useResearchJournalSearchModal({ isOpen, onClose, setUniqueId })

  useEffect(resetOnOpen, [resetOnOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Research Mode — Set Ini"
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
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
                max={currentYear}
                value={yearFrom}
                onChange={e => setYearFrom(e.target.value)}
              />
              <span>sampai</span>
              <YearInput
                type="number"
                placeholder={String(currentYear)}
                min="1900"
                max={currentYear}
                value={yearTo}
                onChange={e => setYearTo(e.target.value)}
              />
            </YearRangeRow>
            <HintText>Kosongkan salah satu untuk tidak membatasi batas tersebut.</HintText>
          </>
        )}

        {yearMode !== 'custom' && (
          <HintText>
            Menampilkan artikel dari tahun {currentYear - latestYears} ke atas (dihitung saat pencarian).
          </HintText>
        )}
      </YearFilterSection>

      {domainFilterEnabled && (
        <>
          <SelectAllRow>
            <span>
              {myJournals.length === 0
                ? 'Semua jurnal aktif (default)'
                : <>{myJournals.length}<span style={{ color: atLimit ? '#ef4444' : '#9ca3af' }}>/{maxJournals}</span> jurnal dipilih</>}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {searchResults.length > 0 && (
                <Button variant="secondary" size="small" onClick={selectAllResults} type="button">
                  Pilih Halaman Ini
                </Button>
              )}
              <Button variant="secondary" size="small" onClick={clearAllJournals} type="button">
                Reset
              </Button>
            </div>
          </SelectAllRow>

          <HintText>
            Daftar jurnal diambil langsung dari OpenAlex. Cari nama jurnal untuk mempersempit, atau jelajahi daftarnya. Reset untuk menggunakan semua jurnal.
          </HintText>

          <SearchInput
            type="text"
            placeholder="Cari jurnal, contoh: Nature Medicine..."
            value={journalSearch}
            onChange={handleSearchChange}
          />
          <HintText style={{ marginTop: '-0.5rem' }}>
            Ketik kata lengkap untuk hasil terbaik (misalnya &quot;Nature&quot;, bukan &quot;Nat&quot;).
          </HintText>

          {searching ? (
            <EmptyResults>Memuat jurnal...</EmptyResults>
          ) : searchResults.length === 0 ? (
            <EmptyResults>
              {journalSearch.trim() ? `Tidak ada jurnal yang cocok dengan "${journalSearch}"` : 'Belum ada jurnal yang tersedia.'}
            </EmptyResults>
          ) : (
            <>
              <ResultCardGrid>
                {searchResults.map((item) => {
                  const checked = myJournals.includes(item.name)
                  const disabled = !checked && atLimit
                  return (
                    <ResultCard
                      key={item.id}
                      $checked={checked}
                      $disabled={disabled}
                      onClick={() => !disabled && (checked ? removeJournal(item.name) : addJournal(item.name))}
                      type="button"
                    >
                      <ResultCardCheck $checked={checked}>{checked ? '✓' : ''}</ResultCardCheck>
                      <ResultCardBody>
                        <ResultCardName $checked={checked}>{item.name}</ResultCardName>
                        <ResultCardMeta>{item.publisher || 'Penerbit tidak diketahui'}</ResultCardMeta>
                      </ResultCardBody>
                    </ResultCard>
                  )
                })}
              </ResultCardGrid>

              {(searchPagination.page > 1 || !searchPagination.isLastPage) && (
                <PaginationRow>
                  <PageInfo>Halaman {searchPagination.page}</PageInfo>
                  <PageButtons>
                    <PageBtn onClick={() => handleSearchPageChange(searchPagination.page - 1)} disabled={searchPagination.page <= 1}>
                      ‹ Sebelumnya
                    </PageBtn>
                    <PageBtn onClick={() => handleSearchPageChange(searchPagination.page + 1)} disabled={searchPagination.isLastPage}>
                      Berikutnya ›
                    </PageBtn>
                  </PageButtons>
                </PaginationRow>
              )}
            </>
          )}

          {myJournals.length > 0 && (
            <SelectedSummarySection>
              <SelectedSummaryLabel>Jurnal dipilih</SelectedSummaryLabel>
              <SelectedChipsRow>
                {myJournals.map(name => (
                  <SelectedJournalChip key={name}>
                    {name}
                    <button type="button" onClick={() => removeJournal(name)}>✕</button>
                  </SelectedJournalChip>
                ))}
              </SelectedChipsRow>
            </SelectedSummarySection>
          )}
        </>
      )}

    </Modal>
  )
}

export default ResearchJournalSearchModal
