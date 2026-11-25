import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { useJournalSearchModal } from './hooks/useJournalSearchModal'
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
} from './JournalSearchModal.styles'

// Research-mode settings for one student: which sources their searches draw
// from, and how far back. The active research provider decides the vocabulary —
// journal names on OpenAlex, domains on Perplexity — and sources are picked from
// a live lookup, so a saved pick always resolves at chat time.
const JournalSearchModal = ({ isOpen, onClose }) => {
  const {
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
    maxSources,
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
  } = useJournalSearchModal({ isOpen, onClose })

  const renderResults = () => {
    if (isSearching) {
      return <EmptyResults>{vocabulary.loadingText}</EmptyResults>
    }

    if (searchResults.length === 0) {
      return (
        <EmptyResults>
          {sourceSearch.trim()
            ? vocabulary.noMatchText(sourceSearch)
            : vocabulary.emptyText}
        </EmptyResults>
      )
    }

    return (
      <>
        <ResultCardGrid>
          {searchResults.map((item) => {
            const checked = mySources.includes(item.name)
            // Once the cap is reached, only already-selected cards stay active.
            const disabled = !checked && atLimit

            return (
              <ResultCard
                key={item.id}
                type="button"
                title={item.meta ? `${item.name} — ${item.meta}` : item.name}
                $checked={checked}
                $disabled={disabled}
                onClick={() => {
                  if (disabled) return
                  return checked ? removeSource(item.name) : addSource(item.name)
                }}
              >
                <ResultCardCheck $checked={checked}>{checked ? '✓' : ''}</ResultCardCheck>
                <ResultCardBody>
                  <ResultCardName $checked={checked}>{item.name}</ResultCardName>
                  <ResultCardMeta>{item.meta || vocabulary.metaFallback}</ResultCardMeta>
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
      <SectionTitle>{vocabulary.sectionTitle}</SectionTitle>

      <FilterToggleRow>
        <div>
          <strong>{vocabulary.toggleLabel}</strong>
          <HintText>{vocabulary.toggleHint}</HintText>
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
              {mySources.length === 0 ? (
                vocabulary.allActive
              ) : (
                <>
                  {mySources.length}
                  <JournalCount $atLimit={atLimit}>/{maxSources}</JournalCount> {vocabulary.countNoun}
                </>
              )}
            </span>
            <SelectAllActions>
              {searchResults.length > 0 && (
                <Button variant="secondary" size="small" type="button" onClick={selectAllResults}>
                  Pilih Halaman Ini
                </Button>
              )}
              <Button variant="secondary" size="small" type="button" onClick={clearAllSources}>
                Reset
              </Button>
            </SelectAllActions>
          </SelectAllRow>

          <HintText>{vocabulary.browseHint}</HintText>

          <SearchInput
            type="text"
            placeholder={vocabulary.searchPlaceholder}
            value={sourceSearch}
            onChange={handleSearchChange}
          />
          <SearchHint>{vocabulary.searchHint}</SearchHint>

          {renderResults()}

          {mySources.length > 0 && (
            <SelectedSummarySection>
              <SelectedSummaryLabel>{vocabulary.selectedLabel}</SelectedSummaryLabel>
              <SelectedChipsRow>
                {mySources.map((name) => (
                  <SelectedJournalChip key={name}>
                    {name}
                    <button type="button" onClick={() => removeSource(name)}>✕</button>
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

export default JournalSearchModal
