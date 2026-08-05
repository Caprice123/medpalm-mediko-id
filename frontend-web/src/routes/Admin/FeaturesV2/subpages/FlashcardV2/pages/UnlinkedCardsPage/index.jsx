import { useDispatch, useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import CardFormModal from '../../components/CardFormModal'
import MoveCardModal from '../../components/MoveCardModal'
import { updateUnlinkedCard, assignCardToNode } from '@store/unlinkedCards'
import { useUnlinkedCardsPage } from './hooks/useUnlinkedCardsPage'
import { Container, Header, HeaderLeft, PageTitle } from '../../FlashcardV2.styles'
import { ActionGroup } from '../CardsPage/CardsPage.styles'

export default function UnlinkedCardsPage({ onBack }) {
  const dispatch = useDispatch()
  const { cards, pagination, loading } = useSelector(state => state.unlinkedCards)

  const {
    editModal, setEditModal,
    assignModal, setAssignModal,
    search, setSearch,
    handleSearch, handleLoadMore, handleDelete,
    handleEditSuccess, handleAssignSuccess,
  } = useUnlinkedCardsPage()

  const columns = [
    {
      header: 'Front',
      render: (c) => (
        <div>
          {c.imageUrl && (
            <img src={c.imageUrl} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, display: 'block', marginBottom: 4 }} />
          )}
          <span>{c.front}</span>
        </div>
      ),
    },
    { header: 'Back', render: (c) => c.back },
    {
      header: 'Versi',
      width: '70px',
      render: (c) => `v${c.version ?? 1}`,
    },
    {
      header: 'Aksi',
      width: '220px',
      align: 'right',
      render: (c) => (
        <ActionGroup>
          <Button size="small" variant="secondary" onClick={() => setAssignModal({ open: true, card: c })}>Pindah</Button>
          <Button size="small" onClick={() => setEditModal({ open: true, card: c })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(c)}>Hapus</Button>
        </ActionGroup>
      ),
    },
  ]

  return (
    <Container>
      <div>
        <Header>
          <HeaderLeft>
            <Button variant="secondary" onClick={onBack}>← Kembali</Button>
            <PageTitle>Kartu Tidak Terhubung</PageTitle>
          </HeaderLeft>
        </Header>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <TextInput
          placeholder="Cari front atau back..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1 }}
        />
        <Button variant="secondary" onClick={handleSearch}>Cari</Button>
      </div>

      <Table
        columns={columns}
        data={cards}
        loading={loading.isFetchingCards}
        emptyText="Tidak ada kartu tanpa sub-topik"
        emptySubtext="Semua kartu sudah terhubung ke sub-topik."
      />

      {!pagination.isLastPage && (
        <Button
          variant="secondary"
          onClick={handleLoadMore}
          disabled={loading.isFetchingCards}
          style={{ margin: '0 auto' }}
        >
          {loading.isFetchingCards ? 'Memuat...' : 'Muat Lebih Banyak'}
        </Button>
      )}

      {editModal.open && (
        <CardFormModal
          card={editModal.card}
          onClose={() => setEditModal({ open: false, card: null })}
          onSuccess={handleEditSuccess}
          onSave={(payload, onSuccess) => dispatch(updateUnlinkedCard(editModal.card.id, payload, onSuccess))}
          isSavingOverride={loading.isUpdatingCard}
        />
      )}

      {assignModal.open && (
        <MoveCardModal
          card={assignModal.card}
          onClose={() => setAssignModal({ open: false, card: null })}
          onSuccess={handleAssignSuccess}
          onMove={(targetNodeId, onSuccess) => dispatch(assignCardToNode(assignModal.card.id, targetNodeId, onSuccess))}
          isSavingOverride={loading.isAssigningCard}
          title="Pindah ke Sub-topik"
        />
      )}
    </Container>
  )
}
