import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import Loading from '@components/common/Loading'
import Pagination from '@components/Pagination'
import { fetchAdminFlashcardDecks } from '@store/flashcard/adminAction'
import { actions } from '@store/flashcard/reducer'
import {
  FilterSection,
  SelectedItemsPreview,
  SelectedItemsLabel,
  SelectedChips,
  SelectedChip,
  RemoveChipButton,
  EmptySelectedMessage,
  SearchInput,
  Content,
  DecksGrid,
  DeckCard,
  CheckboxContainer,
  CardHeader,
  CardTitle,
  StatusBadge,
  CardDescription,
  TagList,
  Tag,
  CardStats,
  StatItem,
  StatLabel,
  StatValue,
  Footer,
  SelectedItems
} from './FlashcardSelectorModal.styles'

const FlashcardSelectorModal = ({ isOpen, onClose, onSelect, initialSelected = [] }) => {
  const dispatch = useDispatch()
  const { decks, loading, filters, pagination } = useSelector(state => state.flashcard)
  const [selectedIds, setSelectedIds] = useState(new Set(initialSelected.map(item => item.id)))

  useEffect(() => {
    if (isOpen) {
      // Reset to first page and fetch
      dispatch(actions.setPage(1))
      dispatch(fetchAdminFlashcardDecks())
      setSelectedIds(new Set(initialSelected.map(item => item.id)))
    }
  }, [isOpen, dispatch, initialSelected])

  const handleSearchChange = (e) => {
    dispatch(actions.updateFilter({ key: 'search', value: e.target.value }))
  }

  const handleSearchSubmit = () => {
    dispatch(actions.setPage(1))
    dispatch(fetchAdminFlashcardDecks())
  }

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminFlashcardDecks())
  }

  const handleToggleItem = (deck) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(deck.id)) {
      newSelected.delete(deck.id)
    } else {
      newSelected.add(deck.id)
    }
    setSelectedIds(newSelected)
  }

  const handleDone = () => {
    const selected = decks.filter(deck => selectedIds.has(deck.id))
    onSelect(selected)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="fullscreen"
      title="Pilih Flashcard Deck"
      footer={
        <Footer>
          <SelectedItems>
            {selectedIds.size > 0 ? (
              `${selectedIds.size} flashcard deck dipilih`
            ) : (
              'Belum ada flashcard deck yang dipilih'
            )}
          </SelectedItems>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleDone}>
              Selesai
            </Button>
          </div>
        </Footer>
      }
    >
      <FilterSection>
        {/* Selected Items Preview */}
        {selectedIds.size > 0 && (
          <SelectedItemsPreview>
            <SelectedItemsLabel>
              Dipilih ({selectedIds.size})
            </SelectedItemsLabel>
            <SelectedChips>
              {decks
                .filter(deck => selectedIds.has(deck.id))
                .map((deck) => (
                  <SelectedChip key={deck.id}>
                    {deck.title} ({deck.cardCount || deck.flashcard_count || 0} kartu)
                    <RemoveChipButton
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleItem(deck)
                      }}
                    >
                      ✕
                    </RemoveChipButton>
                  </SelectedChip>
                ))}
            </SelectedChips>
          </SelectedItemsPreview>
        )}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <SearchInput
            type="text"
            placeholder="Cari flashcard deck..."
            value={filters.search}
            onChange={handleSearchChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
          <Button variant="primary" onClick={handleSearchSubmit}>
            🔍
          </Button>
        </div>
      </FilterSection>

      <Content>
        {loading.isGetListDecksLoading ? (
          <Loading type="oval" size="large" text="Memuat flashcard decks..." />
        ) : decks.length === 0 ? (
          <EmptyState
            icon="📚"
            title={filters.search ? 'Tidak ada flashcard deck yang cocok' : 'Belum ada flashcard deck'}
            description={filters.search ? 'Coba gunakan kata kunci lain' : 'Belum ada flashcard deck yang tersedia'}
          />
        ) : (
          <>
            <DecksGrid>
              {decks.map((deck) => {
              // Filter tags by tag_group
              const universityTags = deck.tags?.filter(tag => tag.tagGroup?.name === 'university') || []
              const semesterTags = deck.tags?.filter(tag => tag.tagGroup?.name === 'semester') || []
              const isSelected = selectedIds.has(deck.id)

              return (
                <DeckCard
                  key={deck.id}
                  selected={isSelected}
                  onClick={() => handleToggleItem(deck)}
                >
                  <CheckboxContainer checked={isSelected} />

                  <CardHeader>
                    <CardTitle>{deck.title}</CardTitle>
                    <StatusBadge status={deck.status}>
                      {deck.status === 'published' ? 'Published' : deck.status === 'testing' ? 'Testing' : 'Draft'}
                    </StatusBadge>
                  </CardHeader>

                  <CardDescription>
                    {deck.description || 'Tidak ada deskripsi'}
                  </CardDescription>

                  {/* University Tags */}
                  {universityTags.length > 0 && (
                    <TagList>
                      {universityTags.map((tag) => (
                        <Tag key={tag.id} university>
                          🏛️ {tag.name}
                        </Tag>
                      ))}
                    </TagList>
                  )}

                  {/* Semester Tags */}
                  {semesterTags.length > 0 && (
                    <TagList>
                      {semesterTags.map((tag) => (
                        <Tag key={tag.id} semester>
                          📚 {tag.name}
                        </Tag>
                      ))}
                    </TagList>
                  )}

                  <CardStats>
                    <StatItem>
                      <StatLabel>Kartu</StatLabel>
                      <StatValue>{deck.flashcard_count || deck.cardCount || 0}</StatValue>
                    </StatItem>
                    <StatItem>
                      <StatLabel>Created</StatLabel>
                      <StatValue>
                        {new Date(deck.createdAt).toLocaleDateString("id-ID")}
                      </StatValue>
                    </StatItem>
                  </CardStats>
                </DeckCard>
              )
            })}
            </DecksGrid>

            {/* Pagination - only show if more than 1 page */}
            {(pagination.page > 1 || (pagination.page === 1 && !pagination.isLastPage)) && (
              <div style={{ marginTop: '2rem' }}>
                <Pagination
                  currentPage={pagination.page}
                  isLastPage={pagination.isLastPage}
                  onPageChange={handlePageChange}
                  isLoading={loading.isGetListDecksLoading}
                  variant="admin"
                  language="id"
                />
              </div>
            )}
          </>
        )}
      </Content>
    </Modal>
  )
}

export default FlashcardSelectorModal
