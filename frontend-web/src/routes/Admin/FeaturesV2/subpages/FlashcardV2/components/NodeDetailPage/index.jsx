import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Table from '@components/common/Table'
import NodeFormModal from '../NodeFormModal'
import CardsPage from '../CardsPage'
import { useNodeDetail } from './hooks/useNodeDetail'
import { Container, Header, HeaderLeft, Breadcrumb, BreadcrumbLink, BreadcrumbSep, BreadcrumbCurrent, PageTitle } from '../../FlashcardV2.styles'
import { SearchRow } from './NodeDetailPage.styles'

export default function NodeDetailPage({ parentNode, onBack }) {
  const { nodes, loading } = useSelector(state => state.featureNodes)
  const {
    selectedSubNode, setSelectedSubNode,
    modal, setModal,
    search, setSearch,
    handleSearch, handleDelete, handleSuccess,
  } = useNodeDetail(parentNode)

  const columns = [
    {
      header: 'Sub-topik',
      render: (n) => <span style={{ fontWeight: 600, color: '#111827' }}>{n.name}</span>,
    },
    {
      header: 'Aksi',
      width: '220px',
      align: 'right',
      render: (n) => (
        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
          <Button size="small" variant="primary" onClick={() => setSelectedSubNode(n)}>Detail</Button>
          <Button size="small" onClick={() => setModal({ open: true, node: n })}>Edit</Button>
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
        <Breadcrumb>
          <BreadcrumbLink onClick={onBack}>Flashcard V2</BreadcrumbLink>
          <BreadcrumbSep>›</BreadcrumbSep>
          <BreadcrumbCurrent>{parentNode.name}</BreadcrumbCurrent>
        </Breadcrumb>
        <Header>
          <HeaderLeft>
            <Button variant="secondary" onClick={onBack}>← Kembali</Button>
            <PageTitle>Sub-topik</PageTitle>
          </HeaderLeft>
          <Button variant="primary" onClick={() => setModal({ open: true, node: null })}>+ Tambah Sub-topik</Button>
        </Header>
      </div>

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
    </Container>
  )
}
