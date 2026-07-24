import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodes, deleteFeatureNode, updateFilter, resetFilter, actions } from '@store/featureNodes'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Table from '@components/common/Table'
import Dropdown from '@components/common/Dropdown'
import CreateNodeModal from './components/CreateNodeModal'
import UpdateNodeModal from './components/UpdateNodeModal'
import {
  Container, Header, TitleSection, Title, Subtitle,
  FilterRow, TypeBadge,
} from './NodeStructure.styles'

const NODE_TYPE_LABELS = { department: 'Dept', topic: 'Topik', subtopic: 'Sub', subtopik: 'Sub' }
const CLASSIFICATION_LABELS = { sistem_blok: 'Sistem Blok', ilmu_lintas_sistem: 'Lintas Sistem' }

const VISIBILITY_OPTIONS = [
  { value: '', label: 'Semua Visibilitas' },
  { value: 'general', label: 'Umum' },
  { value: 'premium', label: 'Premium' },
]

const LAYER_OPTIONS = [
  { value: '', label: 'Semua Layer' },
  { value: '1', label: 'Layer 1 (Root)' },
  { value: '2', label: 'Layer 2 (Sub-topik)' },
]

function NodeStructure() {
  const dispatch = useDispatch()
  const { nodes, filter, loading } = useSelector(state => state.featureNodes)

  const [modal, setModal] = useState({ type: null, data: null })

  useEffect(() => {
    dispatch(resetFilter())
    dispatch(fetchFeatureNodes())
  }, [dispatch])

  const handleSearch = () => dispatch(fetchFeatureNodes())

  const handleDelete = (node) => {
    if (nodes.some(n => n.parentId === node.id)) {
      alert(`"${node.name}" masih memiliki sub-node. Hapus sub-node terlebih dahulu.`)
      return
    }
    if (!window.confirm(`Hapus node "${node.name}"?`)) return
    dispatch(deleteFeatureNode(node.id, () => dispatch(fetchFeatureNodes())))
  }

  const columns = [
    {
      header: 'Nama',
      render: (n) => <span style={{ fontWeight: 600, color: '#111827' }}>{n.name}</span>,
    },
    {
      header: 'Tipe',
      width: '80px',
      render: (n) => n.nodeType
        ? <TypeBadge $type={n.nodeType}>{NODE_TYPE_LABELS[n.nodeType] ?? n.nodeType}</TypeBadge>
        : <span style={{ color: '#d1d5db' }}>—</span>,
    },
    {
      header: 'Layer',
      width: '80px',
      render: (n) => n.layer != null
        ? <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>L{n.layer}</span>
        : <span style={{ color: '#d1d5db' }}>—</span>,
    },
    {
      header: 'Klasifikasi',
      width: '140px',
      render: (n) => n.classification
        ? <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{CLASSIFICATION_LABELS[n.classification] ?? n.classification}</span>
        : <span style={{ color: '#d1d5db' }}>—</span>,
    },
    {
      header: 'Visibilitas',
      width: '90px',
      render: (n) => <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{n.visibility ?? '—'}</span>,
    },
    {
      header: 'Induk',
      width: '130px',
      render: (n) => <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{n.parentName ?? '—'}</span>,
    },
    {
      header: 'Aksi',
      width: '210px',
      align: 'right',
      render: (n) => (
        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'flex-end' }}>
          <Button size="small" onClick={() => setModal({ type: 'create', data: n })}>+ Sub</Button>
          <Button size="small" onClick={() => setModal({ type: 'update', data: n })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(n)}>Hapus</Button>
        </div>
      ),
    },
  ]

  return (
    <Container>
      <Header>
        <TitleSection>
          <Title>Struktur Folder</Title>
          <Subtitle>Kelola hierarki departemen, topik, dan sub-topik yang digunakan di semua fitur</Subtitle>
        </TitleSection>
        <Button variant="primary" onClick={() => setModal({ type: 'create', data: null })}>+ Tambah Node</Button>
      </Header>

      <FilterRow>
        <TextInput
          placeholder="Cari nama atau slug..."
          value={filter.search}
          onChange={e => dispatch(updateFilter({ key: 'search', value: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1 }}
        />
        <Dropdown
          options={VISIBILITY_OPTIONS}
          value={VISIBILITY_OPTIONS.find(o => o.value === filter.visibility) ?? VISIBILITY_OPTIONS[0]}
          onChange={opt => { dispatch(updateFilter({ key: 'visibility', value: opt?.value ?? '' })); dispatch(fetchFeatureNodes()) }}
          placeholder="Visibilitas..."
        />
        <Dropdown
          options={LAYER_OPTIONS}
          value={LAYER_OPTIONS.find(o => o.value === filter.layer) ?? LAYER_OPTIONS[0]}
          onChange={opt => { dispatch(updateFilter({ key: 'layer', value: opt?.value ?? '' })); dispatch(fetchFeatureNodes()) }}
          placeholder="Layer..."
        />
        <Button variant="secondary" onClick={handleSearch}>Cari</Button>
      </FilterRow>

      <Table
        columns={columns}
        data={nodes}
        loading={loading.isFetchingNodes}
        emptyText="Belum ada node"
        emptySubtext='Klik "+ Tambah Node" untuk memulai.'
      />

      {modal.type === 'create' && (
        <CreateNodeModal
          defaultParent={modal.data}
          onClose={() => setModal({ type: null, data: null })}
        />
      )}

      {modal.type === 'update' && (
        <UpdateNodeModal
          node={modal.data}
          onClose={() => setModal({ type: null, data: null })}
        />
      )}
    </Container>
  )
}

export default NodeStructure
