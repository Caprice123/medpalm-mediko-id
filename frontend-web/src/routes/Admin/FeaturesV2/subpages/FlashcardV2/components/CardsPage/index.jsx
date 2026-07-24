import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import Pagination from '@components/common/Pagination'
import CardFormModal from '../CardFormModal'
import MoveCardModal from '../MoveCardModal'
import { useCardsPage } from './hooks/useCardsPage'
import { Container, Header, HeaderLeft, Breadcrumb, BreadcrumbLink, BreadcrumbSep, BreadcrumbCurrent, PageTitle } from '../../FlashcardV2.styles'
import { ActionGroup } from './CardsPage.styles'

export default function CardsPage({ node, parentNode, onBack }) {
  const { cards, pagination, loading } = useSelector(state => state.nodeCards)
  const totalPages = pagination.isLastPage ? pagination.page : pagination.page + 1
  const {
    modal, setModal,
    moveModal, setMoveModal,
    handleDelete, handlePageChange, handleCardSuccess, handleMoveSuccess,
  } = useCardsPage(node)

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
      header: 'Aksi',
      width: '200px',
      align: 'right',
      render: (c) => (
        <ActionGroup>
          <Button size="small" variant="secondary" onClick={() => setMoveModal({ open: true, card: c })}>Pindah</Button>
          <Button size="small" onClick={() => setModal({ open: true, card: c })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(c)}>Hapus</Button>
        </ActionGroup>
      ),
    },
  ]

  return (
    <Container>
      <div>
        <Breadcrumb>
          <BreadcrumbLink onClick={onBack}>Flashcard V2</BreadcrumbLink>
          <BreadcrumbSep>›</BreadcrumbSep>
          <BreadcrumbLink onClick={onBack}>{parentNode.name}</BreadcrumbLink>
          <BreadcrumbSep>›</BreadcrumbSep>
          <BreadcrumbCurrent>{node.name}</BreadcrumbCurrent>
        </Breadcrumb>
        <Header>
          <HeaderLeft>
            <Button variant="secondary" onClick={onBack}>← Kembali</Button>
            <PageTitle>Kartu Flashcard</PageTitle>
          </HeaderLeft>
          <Button variant="primary" onClick={() => setModal({ open: true, card: null })}>+ Tambah Kartu</Button>
        </Header>
      </div>

      <Table
        columns={columns}
        data={cards}
        loading={loading.isFetchingCards}
        emptyText="Belum ada kartu"
        emptySubtext='Klik "+ Tambah Kartu" untuk memulai.'
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={totalPages}
        totalItems={pagination.isLastPage ? (pagination.page - 1) * pagination.perPage + cards.length : undefined}
        itemsPerPage={pagination.perPage}
        onPageChange={handlePageChange}
      />

      {modal.open && (
        <CardFormModal
          nodeId={node.id}
          card={modal.card}
          onClose={() => setModal({ open: false, card: null })}
          onSuccess={handleCardSuccess}
        />
      )}

      {moveModal.open && (
        <MoveCardModal
          card={moveModal.card}
          currentNode={node}
          onClose={() => setMoveModal({ open: false, card: null })}
          onSuccess={handleMoveSuccess}
        />
      )}
    </Container>
  )
}
