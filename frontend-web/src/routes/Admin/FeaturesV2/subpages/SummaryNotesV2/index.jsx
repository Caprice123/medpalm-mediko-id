import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodes, updateFilter } from '@store/featureNodes'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import NodeFormModal from '@routes/Admin/FeaturesV2/subpages/FlashcardV2/components/NodeFormModal'
import SummaryNotesSettingsModal from '@routes/Admin/Features/subpages/SummaryNotes/components/SummaryNotesSettingsModal'
import NodeSummaryPage from './components/NodeSummaryPage'
import UnlinkedNotesPage from './components/UnlinkedNotesPage'
import ClassificationBadge from '@components/common/ClassificationBadge'
import { useSummaryNotesAdmin } from './hooks/useSummaryNotesAdmin'
import { Container, Header, HeaderLeft, Title, FilterRow } from './SummaryNotesV2.styles'

const CLASSIFICATION_OPTIONS = [
  { value: '', label: 'Semua Klasifikasi' },
  { value: 'sistem_blok', label: 'Sistem Blok' },
  { value: 'ilmu_lintas_sistem', label: 'Ilmu Lintas Sistem' },
]

const CLASSIFICATION_LABELS = {
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

function SummaryNotesV2({ onBack }) {
  const dispatch = useDispatch()
  const { nodes, filter, loading } = useSelector(state => state.featureNodes)
  const [view, setView] = useState('topics')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const {
    selectedNode, setSelectedNode,
    modal, setModal,
    search, setSearch,
    handleSearch, handleBack, handleDelete,
  } = useSummaryNotesAdmin()

  const columns = [
    {
      header: 'Topik',
      render: (n) => <span style={{ fontWeight: 600, color: '#111827' }}>{n.name}</span>,
    },
    {
      header: 'Klasifikasi',
      width: '180px',
      render: (n) => <ClassificationBadge value={n.classification} labels={CLASSIFICATION_LABELS} bg="#d1fae5" color="#065f46" />,
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
    return <NodeSummaryPage parentNode={selectedNode} onBack={handleBack} />
  }

  if (view === 'unlinked') {
    return <UnlinkedNotesPage onBack={() => setView('topics')} />
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={onBack}>← Fitur</Button>
          <Title>Summary Notes V2 — Topik</Title>
        </HeaderLeft>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => setView('unlinked')}>Ringkasan Tidak Terhubung</Button>
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

      {settingsOpen && <SummaryNotesSettingsModal isOpen onClose={() => setSettingsOpen(false)} />}
    </Container>
  )
}

export default SummaryNotesV2
