import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import NodeFormModal from '../../components/NodeFormModal'
import SwapNodeOrderModal from '@routes/Admin/FeaturesV2/subpages/FlashcardV2/components/SwapNodeOrderModal'
import ClassificationBadge from '@components/common/ClassificationBadge'
import { useNodeListPage } from './hooks/useNodeListPage'
import { ActionGroup, SearchRow } from '../../AnatomyAtlasV2.styles'
import { TabRow, TabButton } from './NodeListPage.styles'

const LAYER_LABELS = { 1: 'Topik', 2: 'Modul' }
const CLASSIFICATION_LABELS = {
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
  fisiologi: 'Fisiologi',
  patologi: 'Patologi',
}
const CLASSIFICATION_OPTIONS = [
  { value: '', label: 'Semua Klasifikasi' },
  { value: 'sistem_blok', label: 'Sistem Blok' },
  { value: 'ilmu_lintas_sistem', label: 'Ilmu Lintas Sistem' },
]

export default function NodeListPage({ currentLayer, parentNode, onNavigateInto, nodeModal, setNodeModal }) {
  const {
    nodes, isLoading, tab, handleTabChange,
    search, setSearch, handleSearch,
    classification, handleClassificationChange,
    orderModal, setOrderModal,
    handleDelete, handleOrderChanged, reload,
  } = useNodeListPage(currentLayer, parentNode)

  const handleModalSuccess = () => {
    setNodeModal({ open: false, node: null })
    reload()
  }

  const columns = [
    {
      header: LAYER_LABELS[currentLayer] ?? 'Node',
      render: (n) => <span style={{ fontWeight: 600, color: '#111827' }}>{n.name}</span>,
    },
    ...(currentLayer === 1 ? [{
      header: 'Klasifikasi',
      render: (n) => <ClassificationBadge value={n.classification} labels={CLASSIFICATION_LABELS} />,
    }] : []),
    {
      header: 'Atlas 3D',
      align: 'center',
      render: (n) => <span style={{ color: '#374151', fontWeight: 500 }}>{n.atlasCount ?? 0}</span>,
    },
    {
      header: 'Quiz',
      align: 'center',
      render: (n) => <span style={{ color: '#374151', fontWeight: 500 }}>{n.quizCount ?? 0}</span>,
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (n) => (
        <ActionGroup>
          <Button size="small" variant="primary" onClick={() => onNavigateInto({ id: n.id, name: n.name, layer: currentLayer })}>
            Detail
          </Button>
          <Button size="small" onClick={() => setNodeModal({ open: true, node: n })}>Edit</Button>
          {currentLayer === 2 && (
            <Button size="small" variant="secondary" onClick={() => setOrderModal({ open: true, node: n })}>Tukar Posisi</Button>
          )}
          <Button size="small" variant="danger" onClick={() => handleDelete(n)}>Hapus</Button>
        </ActionGroup>
      ),
    },
  ]

  return (
    <>
      {currentLayer === 2 && (
        <TabRow>
          <TabButton $active={tab === 'ordered'} onClick={() => handleTabChange('ordered')}>Terurut</TabButton>
          <TabButton $active={tab === 'all'} onClick={() => handleTabChange('all')}>Semua Modul</TabButton>
        </TabRow>
      )}

      <SearchRow>
        <TextInput
          placeholder={`Cari nama ${(LAYER_LABELS[currentLayer] ?? 'node').toLowerCase()}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1 }}
        />
        {currentLayer === 1 && (
          <Dropdown
            options={CLASSIFICATION_OPTIONS}
            value={CLASSIFICATION_OPTIONS.find(o => o.value === classification) ?? CLASSIFICATION_OPTIONS[0]}
            onChange={handleClassificationChange}
            placeholder="Klasifikasi..."
          />
        )}
        <Button variant="secondary" onClick={handleSearch}>Cari</Button>
      </SearchRow>

      <Table
        columns={columns}
        data={nodes}
        loading={isLoading}
        emptyText={`Belum ada ${(LAYER_LABELS[currentLayer] ?? 'node').toLowerCase()}`}
        emptySubtext={`Klik "+ Tambah ${LAYER_LABELS[currentLayer]}" untuk memulai.`}
      />

      {nodeModal.open && (
        <NodeFormModal
          layer={currentLayer}
          node={nodeModal.node}
          parentNode={parentNode}
          onClose={() => setNodeModal({ open: false, node: null })}
          onSuccess={handleModalSuccess}
        />
      )}

      {orderModal.open && (
        <SwapNodeOrderModal
          node={orderModal.node}
          onClose={() => setOrderModal({ open: false, node: null })}
          onSwapped={handleOrderChanged}
        />
      )}
    </>
  )
}
