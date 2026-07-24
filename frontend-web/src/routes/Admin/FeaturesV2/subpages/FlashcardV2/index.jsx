import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodes, updateFilter } from '@store/featureNodes'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import FlashcardSettingsModal from '@routes/Admin/Features/subpages/Flashcard/components/FlashcardSettingsModal'
import NodeFormModal from './components/NodeFormModal'
import NodeDetailPage from './components/NodeDetailPage'
import { useFlashcardAdmin } from './hooks/useFlashcardAdmin'
import { Container, Header, HeaderLeft, Title, FilterRow, ClassificationBadge } from './FlashcardV2.styles'

const CLASSIFICATION_OPTIONS = [
  { value: '', label: 'Semua Klasifikasi' },
  { value: 'sistem_blok', label: 'Sistem Blok' },
  { value: 'ilmu_lintas_sistem', label: 'Ilmu Lintas Sistem' },
]

const CLASSIFICATION_LABELS = {
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

function FlashcardV2({ onBack }) {
  const dispatch = useDispatch()
  const { nodes, filter, loading } = useSelector(state => state.featureNodes)
  const {
    selectedNode, setSelectedNode,
    modal, setModal,
    settingsOpen, setSettingsOpen,
    search, setSearch,
    handleSearch, handleBack, handleDelete,
  } = useFlashcardAdmin()

  const columns = [
    {
      header: 'Topik',
      render: (n) => <span style={{ fontWeight: 600, color: '#111827' }}>{n.name}</span>,
    },
    {
      header: 'Klasifikasi',
      width: '180px',
      render: (n) => n.classification
        ? <ClassificationBadge>{CLASSIFICATION_LABELS[n.classification] ?? n.classification}</ClassificationBadge>
        : <span style={{ color: '#d1d5db' }}>—</span>,
    },
    {
      header: 'Aksi',
      width: '200px',
      align: 'right',
      render: (n) => (
        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
          <Button size="small" variant="primary" onClick={() => setSelectedNode(n)}>Detail</Button>
          <Button size="small" onClick={() => setModal({ open: true, node: n })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(n)}>Hapus</Button>
        </div>
      ),
    },
  ]

  if (selectedNode) {
    return <NodeDetailPage parentNode={selectedNode} onBack={handleBack} />
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={onBack}>← Fitur</Button>
          <Title>Flashcard V2 — Topik</Title>
        </HeaderLeft>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => setSettingsOpen(true)}>Pengaturan</Button>
          <Button variant="primary" onClick={() => setModal({ open: true, node: null })}>+ Tambah Topik</Button>
        </div>
      </Header>

      <FilterRow>
        <TextInput
          placeholder="Cari nama topik..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1 }}
        />
        <Dropdown
          options={CLASSIFICATION_OPTIONS}
          value={CLASSIFICATION_OPTIONS.find(o => o.value === filter.classification) ?? CLASSIFICATION_OPTIONS[0]}
          onChange={opt => {
            dispatch(updateFilter({ key: 'classification', value: opt?.value ?? '' }))
            dispatch(fetchFeatureNodes())
          }}
          placeholder="Klasifikasi..."
        />
        <Button variant="secondary" onClick={handleSearch}>Cari</Button>
      </FilterRow>

      <Table
        columns={columns}
        data={nodes}
        loading={loading.isFetchingNodes}
        emptyText="Belum ada topik"
        emptySubtext='Klik "+ Tambah Topik" untuk memulai.'
      />

      {modal.open && (
        <NodeFormModal
          layer={1}
          node={modal.node}
          onClose={() => setModal({ open: false, node: null })}
          onSuccess={() => {
            setModal({ open: false, node: null })
            dispatch(fetchFeatureNodes())
          }}
        />
      )}

      {settingsOpen && <FlashcardSettingsModal onClose={() => setSettingsOpen(false)} />}
    </Container>
  )
}

export default FlashcardV2
