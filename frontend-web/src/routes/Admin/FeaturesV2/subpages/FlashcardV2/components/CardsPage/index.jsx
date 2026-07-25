import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import Pagination from '@components/common/Pagination'
import Modal from '@components/common/Modal'
import CardFormModal from '../CardFormModal'
import MoveCardModal from '../MoveCardModal'
import { importNodeCards, downloadCardsTemplate } from '@store/nodeCards/adminAction'
import { useCardsPage } from './hooks/useCardsPage'
import { Container, Header, HeaderLeft, Breadcrumb, BreadcrumbLink, BreadcrumbSep, BreadcrumbCurrent, PageTitle } from '../../FlashcardV2.styles'
import { ActionGroup } from './CardsPage.styles'

export default function CardsPage({ node, parentNode, onBack }) {
  const dispatch = useDispatch()
  const { cards, pagination, loading } = useSelector(state => state.nodeCards)
  const totalPages = pagination.isLastPage ? pagination.page : pagination.page + 1
  const importRef = useRef(null)
  const [importResult, setImportResult] = useState(null)
  const {
    modal, setModal,
    moveModal, setMoveModal,
    handleDelete, handlePageChange, handleCardSuccess, handleMoveSuccess,
  } = useCardsPage(node)

  const handleImportFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    dispatch(importNodeCards(node.id, file, (result) => {
      setImportResult(result)
      handleCardSuccess()
    }))
  }

  const columns = [
    { header: 'Front', render: (c) => c.front },
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
          <ActionGroup>
            <Button variant="secondary" onClick={() => dispatch(downloadCardsTemplate())}>Unduh Template</Button>
            <input ref={importRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleImportFile} />
            <Button
              variant="secondary"
              disabled={loading.isImportingCards}
              onClick={() => importRef.current?.click()}
            >
              {loading.isImportingCards ? 'Mengimpor...' : 'Import Excel'}
            </Button>
            <Button variant="primary" onClick={() => setModal({ open: true, card: null })}>+ Tambah Kartu</Button>
          </ActionGroup>
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

      {importResult && (
        <Modal title="Hasil Import" onClose={() => setImportResult(null)}>
          <p style={{ marginBottom: 8 }}>Berhasil diimpor: <strong>{importResult.imported}</strong> kartu</p>
          {importResult.errors.length > 0 && (
            <>
              <p style={{ marginBottom: 4, color: '#dc2626' }}>Gagal ({importResult.errors.length} baris):</p>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {importResult.errors.map((e, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#dc2626' }}>Baris {e.row}: {e.message}</li>
                ))}
              </ul>
            </>
          )}
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button onClick={() => setImportResult(null)}>Tutup</Button>
          </div>
        </Modal>
      )}
    </Container>
  )
}
