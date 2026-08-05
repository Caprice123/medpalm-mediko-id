import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import Breadcrumb from '@components/common/Breadcrumb'
import NodeFormModal from '../../components/NodeFormModal'
import DiagnosticSettingsModal from '@routes/Admin/Features/subpages/DiagnosticQuiz/components/DiagnosticSettingsModal'
import { useNodeListPage } from './hooks/useNodeListPage'
import {
  Container, Header, HeaderLeft, Title, PageTitle,
  ActionGroup, ClassificationBadge, SearchRow,
} from '../../DiagnosticV2.styles'

const LAYER_LABELS = { 1: 'Modul', 2: 'Sub-modul' }
const CLASSIFICATION_LABELS = { primary: 'Utama', special: 'Khusus' }

export default function NodeListPage({
  path, currentLayer, parentNode,
  onBack, onNavigateRoot, onNavigateTo, onNavigateInto, onViewUnlinked,
}) {
  const {
    nodes, isLoading,
    search, setSearch, handleSearch,
    settingsOpen, setSettingsOpen,
    nodeModal, setNodeModal,
    handleDelete, handleModalSuccess,
  } = useNodeListPage(currentLayer, parentNode)

  const isRoot = path.length === 0

  const columns = [
    {
      header: LAYER_LABELS[currentLayer] ?? 'Node',
      render: (n) => <span style={{ fontWeight: 600, color: '#111827' }}>{n.name}</span>,
    },
    ...(currentLayer === 1 ? [{
      header: 'Klasifikasi',
      width: '130px',
      render: (n) => n.classification
        ? <ClassificationBadge $type={n.classification}>{CLASSIFICATION_LABELS[n.classification] ?? n.classification}</ClassificationBadge>
        : <span style={{ color: '#9ca3af', fontSize: '0.8125rem' }}>—</span>,
    }] : []),
    {
      header: 'Aksi',
      width: '220px',
      align: 'right',
      render: (n) => (
        <ActionGroup>
          <Button size="small" variant="primary" onClick={() => onNavigateInto({ id: n.id, name: n.name, layer: currentLayer })}>
            {currentLayer === 1 ? 'Detail' : 'Soal'}
          </Button>
          <Button size="small" onClick={() => setNodeModal({ open: true, node: n })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(n)}>Hapus</Button>
        </ActionGroup>
      ),
    },
  ]

  return (
    <Container>
      {!isRoot && (
        <Breadcrumb
          items={[
            { label: 'Diagnostik V2', onClick: onNavigateRoot },
            ...path.map((p, i) => ({
              label: p.name,
              onClick: i < path.length - 1 ? () => onNavigateTo(i + 1) : undefined,
            })),
          ]}
        />
      )}

      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={onBack}>← {isRoot ? 'Fitur' : 'Kembali'}</Button>
          <Title>Diagnostik V2</Title>
          {!isRoot && <PageTitle>— {LAYER_LABELS[currentLayer] ?? 'Node'}</PageTitle>}
        </HeaderLeft>

        <ActionGroup>
          {isRoot && (
            <>
              <Button variant="secondary" onClick={onViewUnlinked}>Soal Tidak Tertaut</Button>
              <Button variant="secondary" onClick={() => setSettingsOpen(true)}>Pengaturan</Button>
            </>
          )}
          <Button variant="primary" onClick={() => setNodeModal({ open: true, node: null })}>
            + Tambah {LAYER_LABELS[currentLayer]}
          </Button>
        </ActionGroup>
      </Header>

      <SearchRow>
        <TextInput
          placeholder={`Cari ${LAYER_LABELS[currentLayer]?.toLowerCase()}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="secondary" onClick={handleSearch}>Cari</Button>
      </SearchRow>

      <Table
        columns={columns}
        data={nodes}
        loading={isLoading}
        emptyText={`Belum ada ${LAYER_LABELS[currentLayer]?.toLowerCase()}`}
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

      {settingsOpen && <DiagnosticSettingsModal onClose={() => setSettingsOpen(false)} />}
    </Container>
  )
}
