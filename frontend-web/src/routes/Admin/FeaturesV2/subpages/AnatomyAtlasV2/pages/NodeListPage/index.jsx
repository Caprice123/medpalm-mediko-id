import Button from '@components/common/Button'
import Table from '@components/common/Table'
import NodeFormModal from '../../components/NodeFormModal'
import { useNodeListPage } from './hooks/useNodeListPage'
import { ActionGroup } from '../../AnatomyAtlasV2.styles'

const LAYER_LABELS = { 1: 'Topik', 2: 'Modul' }

export default function NodeListPage({ currentLayer, parentNode, onNavigateInto, nodeModal, setNodeModal }) {
  const { nodes, isLoading, handleDelete, reload } = useNodeListPage(currentLayer, parentNode)

  const handleModalSuccess = () => {
    setNodeModal({ open: false, node: null })
    reload()
  }

  const columns = [
    {
      header: LAYER_LABELS[currentLayer] ?? 'Node',
      render: (n) => <span style={{ fontWeight: 600, color: '#111827' }}>{n.name}</span>,
    },
    {
      header: 'Klasifikasi',
      width: '160px',
      render: (n) => <span style={{ color: '#6b7280' }}>{n.classification ?? '-'}</span>,
    },
    {
      header: 'Atlas 3D',
      width: '90px',
      align: 'center',
      render: (n) => <span style={{ color: '#374151', fontWeight: 500 }}>{n.atlasCount ?? 0}</span>,
    },
    {
      header: 'Quiz',
      width: '70px',
      align: 'center',
      render: (n) => <span style={{ color: '#374151', fontWeight: 500 }}>{n.quizCount ?? 0}</span>,
    },
    {
      header: 'Aksi',
      width: '220px',
      align: 'right',
      render: (n) => (
        <ActionGroup>
          <Button size="small" variant="primary" onClick={() => onNavigateInto({ id: n.id, name: n.name, layer: currentLayer })}>
            Detail
          </Button>
          <Button size="small" onClick={() => setNodeModal({ open: true, node: n })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(n)}>Hapus</Button>
        </ActionGroup>
      ),
    },
  ]

  return (
    <>
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
    </>
  )
}
