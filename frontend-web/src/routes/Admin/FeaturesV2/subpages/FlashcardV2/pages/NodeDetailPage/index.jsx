import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Table from '@components/common/Table'
import Breadcrumb from '@components/common/Breadcrumb'
import NodeFormModal from '../../components/NodeFormModal'
import SwapNodeOrderModal from '../../components/SwapNodeOrderModal'
import CardsPage from '../CardsPage'
import { useNodeDetail } from './hooks/useNodeDetail'
import { Container, Header, HeaderLeft, PageTitle } from '../../FlashcardV2.styles'
import { SearchRow, TabRow, TabButton } from './NodeDetailPage.styles'

export default function NodeDetailPage({ parentNode, onBack }) {
  const { nodes, loading } = useSelector(state => state.featureNodes)
  const {
    selectedSubNode, setSelectedSubNode,
    modal, setModal,
    search, setSearch,
    tab, handleTabChange,
    orderModal, setOrderModal,
    handleSearch, handleDelete, handleSuccess, handleOrderChanged,
  } = useNodeDetail(parentNode)

  const columns = [
    {
      header: 'Sub-topik',
      render: (n) => <span style={{ fontWeight: 600, color: '#111827' }}>{n.name}</span>,
    },
    {
      header: 'Aksi',
      width: '280px',
      align: 'right',
      render: (n) => (
        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
          <Button size="small" variant="primary" onClick={() => setSelectedSubNode(n)}>Detail</Button>
          <Button size="small" onClick={() => setModal({ open: true, node: n })}>Edit</Button>
          <Button size="small" variant="secondary" onClick={() => setOrderModal({ open: true, node: n })}>Tukar Posisi</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(n)}>Hapus</Button>
        </div>
      ),
    },
  ]

  if (selectedSubNode) {
    return (
      <CardsPage
        node={selectedSubNode}
        onBack={() => setSelectedSubNode(null)}
        parentNode={parentNode}
      />
    )
  }

  return (
    <Container>
      <div>
        <Breadcrumb
          style={{ marginBottom: '0.25rem' }}
          items={[
            { label: 'Flashcard V2', onClick: onBack },
            { label: parentNode.name },
          ]}
        />
        <Header>
          <HeaderLeft>
            <Button variant="secondary" onClick={onBack}>← Kembali</Button>
            <PageTitle>Sub-topik</PageTitle>
          </HeaderLeft>
          <Button variant="primary" onClick={() => setModal({ open: true, node: null })}>+ Tambah Sub-topik</Button>
        </Header>
      </div>

      <TabRow>
        <TabButton $active={tab === 'ordered'} onClick={() => handleTabChange('ordered')}>Terurut</TabButton>
        <TabButton $active={tab === 'all'} onClick={() => handleTabChange('all')}>Semua Subtopik</TabButton>
      </TabRow>

      <SearchRow>
        <TextInput
          placeholder="Cari nama sub-topik..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1 }}
        />
        <Button variant="secondary" onClick={handleSearch}>Cari</Button>
      </SearchRow>

      <Table
        columns={columns}
        data={nodes}
        loading={loading.isFetchingNodes}
        emptyText="Belum ada sub-topik"
        emptySubtext='Klik "+ Tambah Sub-topik" untuk memulai.'
      />

      {modal.open && (
        <NodeFormModal
          layer={2}
          node={modal.node}
          parentNode={parentNode}
          onClose={() => setModal({ open: false, node: null })}
          onSuccess={handleSuccess}
        />
      )}

      {orderModal.open && (
        <SwapNodeOrderModal
          node={orderModal.node}
          onClose={() => setOrderModal({ open: false, node: null })}
          onSwapped={handleOrderChanged}
        />
      )}
    </Container>
  )
}
