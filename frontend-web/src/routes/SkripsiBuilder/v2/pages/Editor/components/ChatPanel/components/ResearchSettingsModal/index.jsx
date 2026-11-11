import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { useResearchSettingsModal } from './hooks/useResearchSettingsModal'
import {
  SectionTitle,
  HintText,
  SearchHint,
  FilterToggleRow,
  SelectAllRow,
  SelectAllActions,
  JournalCount,
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
  ToggleSwitch,
  ToggleSlider,
} from './ResearchSettingsModal.styles'

// Research settings for one skripsi set: which journals its searches draw
// from, and how far back.
const ResearchSettingsModal = ({ isOpen, onClose, setUniqueId }) => {
  const {
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
    maxJournals,
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
  } = useResearchSettingsModal({ isOpen, onClose, setUniqueId })

  const renderResults = () => {
    if (isSearching) {
      return <EmptyResults>Memuat jurnal...</EmptyResults>
    }

    if (searchResults.length === 0) {
      return (
        <EmptyResults>
          {journalSearch.trim()
            ? `Tidak ada jurnal yang cocok dengan "${journalSearch}"`
            : 'Belum ada jurnal yang tersedia.'}
        </EmptyResults>
      )
    }

    return (
      <>
        <ResultCardGrid>
          {searchResults.map((item) => {
            const checked = myJournals.includes(item.name)
            // Once the cap is reached, only already-selected cards stay active.
            const disabled = !checked && atLimit

            return (
              <ResultCard
                key={item.id}
                type="button"
                $checked={checked}
                $disabled={disabled}
                onClick={() => {
                  if (disabled) return
                  return checked ? removeJournal(item.name) : addJournal(item.name)
                }}
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
              <PageBtn
                onClick={() => handleSearchPageChange(searchPagination.page - 1)}
                disabled={searchPagination.page <= 1}
              >
                ‹ Sebelumnya
              </PageBtn>
              <PageBtn
                onClick={() => handleSearchPageChange(searchPagination.page + 1)}
                disabled={searchPagination.isLastPage}
              >
                Berikutnya ›
              </PageBtn>
            </PageButtons>
          </PaginationRow>
        )}
      </>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Research Mode"
      size="medium"
      footer={(
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </>
      )}
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
            onChange={(e) => setDomainFilterEnabled(e.target.checked)}
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
            onClick={() => chooseYearPreset('latest5', 5)}
          >
            5 Tahun Terakhir
          </YearPresetBtn>
          <YearPresetBtn
            type="button"
            $active={yearMode === 'latest10'}
            onClick={() => chooseYearPreset('latest10', 10)}
          >
            10 Tahun Terakhir
          </YearPresetBtn>
          <YearPresetBtn
            type="button"
            $active={yearMode === 'custom'}
            onClick={chooseCustomYears}
          >
            Kustom
          </YearPresetBtn>
        </YearPresetRow>

        {yearMode === 'custom' ? (
          <>
            <YearRangeRow>
              <span>Dari</span>
              <YearInput
                type="number"
                placeholder="1900"
                min="1900"
                max={currentYear}
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
              />
              <span>sampai</span>
              <YearInput
                type="number"
                placeholder={String(currentYear)}
                min="1900"
                max={currentYear}
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
              />
            </YearRangeRow>
            <HintText>Kosongkan salah satu untuk tidak membatasi batas tersebut.</HintText>
          </>
        ) : (
          <HintText>
            Menampilkan artikel dari tahun {currentYear - latestYears} ke atas (dihitung saat pencarian).
          </HintText>
        )}
      </YearFilterSection>

      {domainFilterEnabled && (
        <>
          <SelectAllRow>
            <span>
              {myJournals.length === 0 ? (
                'Semua jurnal aktif (default)'
              ) : (
                <>
                  {myJournals.length}
                  <JournalCount $atLimit={atLimit}>/{maxJournals}</JournalCount> jurnal dipilih
                </>
              )}
            </span>
            <SelectAllActions>
              {searchResults.length > 0 && (
                <Button variant="secondary" size="small" type="button" onClick={selectAllResults}>
                  Pilih Halaman Ini
                </Button>
              )}
              <Button variant="secondary" size="small" type="button" onClick={clearAllJournals}>
                Reset
              </Button>
            </SelectAllActions>
          </SelectAllRow>

          <HintText>
            Cari nama jurnal untuk mempersempit, atau jelajahi daftarnya. Reset untuk menggunakan semua jurnal.
          </HintText>

          <SearchInput
            type="text"
            placeholder="Cari jurnal, contoh: Nature Medicine..."
            value={journalSearch}
            onChange={handleSearchChange}
          />
          <SearchHint>
            Ketik kata lengkap untuk hasil terbaik (misalnya &quot;Nature&quot;, bukan &quot;Nat&quot;).
          </SearchHint>

          {renderResults()}

          {myJournals.length > 0 && (
            <SelectedSummarySection>
              <SelectedSummaryLabel>Jurnal dipilih</SelectedSummaryLabel>
              <SelectedChipsRow>
                {myJournals.map((name) => (
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

export default ResearchSettingsModal
