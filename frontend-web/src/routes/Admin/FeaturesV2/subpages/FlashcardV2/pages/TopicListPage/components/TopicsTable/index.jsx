import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import { ClassificationBadge, RowActions } from './TopicsTable.styles'

const CLASSIFICATION_LABELS = {
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

export default function TopicsTable({ onSelectNode, onEditNode, onDeleteNode }) {
  const nodes = useSelector(s => s.featureNodes.nodes)
  const isLoading = useSelector(s => s.featureNodes.loading.isFetchingNodes)

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
        <RowActions>
          <Button size="small" variant="primary" onClick={() => onSelectNode(n)}>Detail</Button>
          <Button size="small" onClick={() => onEditNode(n)}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => onDeleteNode(n)}>Hapus</Button>
        </RowActions>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={nodes}
      loading={isLoading}
      emptyText="Belum ada topik"
      emptySubtext='Klik "+ Tambah Topik" untuk memulai.'
    />
  )
}
