import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchV2Decks, fetchV2Deck, deleteV2Deck } from '@store/flashcard/v2/adminAction'
import { actions } from '@store/flashcard/reducer'
import { fetchFeatureNodes } from '@store/featureNodes'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import { PiBookOpenTextLight } from 'react-icons/pi'
import Button from '@components/common/Button'
import FlashcardSettingsModal from '@routes/Admin/Features/subpages/Flashcard/components/FlashcardSettingsModal'
import FlashcardFilter from './components/FlashcardFilter'
import DeckFormModal from './components/DeckFormModal'
import DeckDetailPage from './components/DeckDetailPage'
import {
  Container, Header, HeaderLeft, Title,
  Grid, Card, CardAccent, CardBody, CardHeader, CardTitle, StatusBadge,
  Description, TagRow, TagChip,
  Stats, StatItem, StatLabel, StatValue,
  CardActions, EmptyText,
} from './FlashcardV2.styles'

function FlashcardV2({ onBack }) {
  const dispatch = useDispatch()
  const { decks, pagination, loading } = useSelector(state => state.flashcard)

  const [selectedDeck, setSelectedDeck] = useState(null)
  const [editingDeck, setEditingDeck] = useState(null)
  const [creatingDeck, setCreatingDeck] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchV2Decks())
    dispatch(fetchFeatureNodes())
  }, [dispatch])

  const handleLoadMore = () => {
    dispatch(actions.setPage(pagination.page + 1))
    dispatch(fetchV2Decks())
  }

  const handleEdit = (deck) => {
    dispatch(fetchV2Deck(deck.uniqueId, () => setEditingDeck(deck)))
  }

  const handleDelete = async (deck) => {
    if (!window.confirm(`Hapus deck "${deck.title}"?`)) return
    await dispatch(deleteV2Deck(deck.uniqueId))
    dispatch(fetchV2Decks())
  }

  const isLoading = loading?.isGetListDecksLoading

  if (selectedDeck) {
    return (
      <DeckDetailPage
        deck={selectedDeck}
        onBack={() => setSelectedDeck(null)}
      />
    )
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={onBack}>← Kembali</Button>
          <Title>Flashcard V2 — Kelola Deck</Title>
        </HeaderLeft>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => setSettingsOpen(true)}>Pengaturan</Button>
          <Button variant="primary" onClick={() => setCreatingDeck(true)}>+ Tambah Deck</Button>
        </div>
      </Header>

      <FlashcardFilter />

      {isLoading ? (
        <EmptyText>Memuat data...</EmptyText>
      ) : decks.length === 0 ? (
        <EmptyText>Tidak ada deck ditemukan.</EmptyText>
      ) : (
        <>
          <Grid>
            {decks.map(deck => {
              const deckNodes = deck.nodes || []

              return (
                <Card key={deck.id}>
                  <CardAccent />
                  <CardBody>
                    <CardHeader>
                      <CardTitle>{deck.title}</CardTitle>
                      <StatusBadge $published={deck.status === 'published'}>
                        {deck.status === 'published' ? 'Published' : 'Draft'}
                      </StatusBadge>
                    </CardHeader>

                    <Description>{deck.description || 'Tidak ada deskripsi'}</Description>

                    {deckNodes.length > 0 && (
                      <TagRow>
                        {deckNodes.flatMap(r => {
                          const chips = []
                          if (r.departmentName) chips.push(
                            <TagChip key={`${r.id}-dept`} $type="department">
                              <HiOutlineOfficeBuilding size={11} />{r.departmentName}
                            </TagChip>
                          )
                          if (r.nodeName) chips.push(
                            <TagChip key={`${r.id}-topic`} $type="topic">
                              <PiBookOpenTextLight size={11} />{r.nodeName}
                            </TagChip>
                          )
                          return chips
                        })}
                      </TagRow>
                    )}
                    <div style={{flex: 1}}></div>

                    <Stats>
                      <StatItem>
                        <StatLabel>Kartu</StatLabel>
                        <StatValue>{deck.cardCount ?? 0}</StatValue>
                      </StatItem>
                    </Stats>

                    <CardActions>
                      <Button variant="primary" onClick={() => setSelectedDeck(deck)}>Kelola</Button>
                      <Button onClick={() => handleEdit(deck)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDelete(deck)}>Hapus</Button>
                    </CardActions>
                  </CardBody>
                </Card>
              )
            })}
          </Grid>

          {!pagination.isLastPage && (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.5rem' }}>
              <Button
                variant="secondary"
                onClick={handleLoadMore}
                disabled={loading?.isGetListDecksLoading}
              >
                {loading?.isGetListDecksLoading ? 'Memuat...' : 'Muat Lebih'}
              </Button>
            </div>
          )}
        </>
      )}

      {creatingDeck && (
        <DeckFormModal
          mode="create"
          onClose={() => {
            setCreatingDeck(false)
            dispatch(fetchV2Decks())
          }}
        />
      )}

      {editingDeck && (
        <DeckFormModal
          mode="edit"
          onClose={() => {
            setEditingDeck(null)
            dispatch(fetchV2Decks())
          }}
        />
      )}

      {settingsOpen && (
        <FlashcardSettingsModal onClose={() => setSettingsOpen(false)} />
      )}
    </Container>
  )
}

export default FlashcardV2
