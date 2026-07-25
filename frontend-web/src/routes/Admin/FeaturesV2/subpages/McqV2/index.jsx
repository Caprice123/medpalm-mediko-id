import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodes, updateFilter } from '@store/featureNodes'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import McqSettingsModal from '@routes/Admin/Features/subpages/MultipleChoice/components/McqSettingsModal'
import NodeFormModal from '@routes/Admin/FeaturesV2/subpages/FlashcardV2/components/NodeFormModal'
import TopicDetailPage from './components/TopicDetailPage'
import UnlinkedQuestionsPage from './components/UnlinkedQuestionsPage'
import { useMcqV2Admin } from './hooks/useMcqV2Admin'
import { Container, Header, HeaderLeft, Title, FilterRow, ClassificationBadge } from './McqV2.styles'

const CLASSIFICATION_OPTIONS = [
  { value: '', label: 'Semua Klasifikasi' },
  { value: 'sistem_blok', label: 'Sistem Blok' },
  { value: 'ilmu_lintas_sistem', label: 'Ilmu Lintas Sistem' },
]

const CLASSIFICATION_LABELS = {
  sistem_blok: 'Sistem Blok',
  ilmu_lintas_sistem: 'Ilmu Lintas Sistem',
}

function McqV2({ onBack }) {
  const dispatch = useDispatch()
  const { nodes, filter, loading } = useSelector(state => state.featureNodes)
  const [view, setView] = useState('topics') // 'topics' | 'unlinked'
  const {
    selectedNode, setSelectedNode,
    modal, setModal,
    settingsOpen, setSettingsOpen,
    search, setSearch,
    handleSearch, handleBack, handleDelete,
  } = useMcqV2Admin()

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
    return <TopicDetailPage parentNode={selectedNode} onBack={handleBack} />
  }

  if (view === 'unlinked') {
    return <UnlinkedQuestionsPage onBack={() => setView('topics')} />
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={onBack}>← Fitur</Button>
          <Title>MCQ V2 — Topik</Title>
        </HeaderLeft>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => setView('unlinked')}>Pertanyaan Tidak Terhubung</Button>
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

      {settingsOpen && <McqSettingsModal onClose={() => setSettingsOpen(false)} />}
    </Container>
  )
}

export default McqV2
