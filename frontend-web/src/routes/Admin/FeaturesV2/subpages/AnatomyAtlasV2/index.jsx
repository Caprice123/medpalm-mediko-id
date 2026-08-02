import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodesWithStats, updateFilter, deleteFeatureNode } from '@store/featureNodes'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import NodeFormModal from './components/NodeFormModal'
import ModuleDetailPage from './components/ModuleDetailPage'
import SettingsModal from './components/SettingsModal'
import UnlinkedAtlasPage from './components/UnlinkedAtlasPage'
import UnlinkedAnatomyPage from './components/UnlinkedAnatomyPage'
import {
  Container, Header, HeaderLeft, Title, PageTitle, ActionGroup,
  Breadcrumb, BreadcrumbLink, BreadcrumbSep, BreadcrumbCurrent,
} from './AnatomyAtlasV2.styles'

const LAYER_LABELS = { 1: 'Topik', 2: 'Modul' }
const VISIBILITY = 'general'

export default function AnatomyAtlasV2({ onBack }) {
  const dispatch = useDispatch()
  const { nodes, loading } = useSelector(s => s.featureNodes)

  const [view, setView] = useState('tree') // 'tree' | 'unlinkedAtlas' | 'unlinkedAnatomy'
  const [path, setPath] = useState([])
  const [nodeModal, setNodeModal] = useState({ open: false, node: null })
  const [settingsOpen, setSettingsOpen] = useState(false)

  const currentLayer = path.length + 1
  const parentNode = path.length > 0 ? path[path.length - 1] : null
  const isModuleDetail = path.length === 2

  const applyFilters = (layer, parentId) => {
    dispatch(updateFilter({ key: 'layer', value: String(layer) }))
    dispatch(updateFilter({ key: 'parentId', value: parentId ? String(parentId) : '' }))
    dispatch(updateFilter({ key: 'visibility', value: VISIBILITY }))
    dispatch(updateFilter({ key: 'nodeType', value: layer === 2 ? 'module' : 'topic' }))
    dispatch(fetchFeatureNodesWithStats())
  }

  useEffect(() => {
    if (view === 'tree' && !isModuleDetail) applyFilters(currentLayer, parentNode?.id)
  }, [path, view])

  const navigateInto = (node) => setPath(prev => [...prev, node])
  const navigateTo = (index) => setPath(prev => prev.slice(0, index))

  const handleDelete = (node) => {
    if (!window.confirm(`Hapus "${node.name}"? Semua data di dalamnya akan ikut terhapus.`)) return
    dispatch(deleteFeatureNode(node.id, () => applyFilters(currentLayer, parentNode?.id)))
  }

  const handleNodeSuccess = () => {
    setNodeModal({ open: false, node: null })
    applyFilters(currentLayer, parentNode?.id)
  }

  if (view === 'unlinkedAtlas') {
    return <UnlinkedAtlasPage onBack={() => setView('tree')} />
  }

  if (view === 'unlinkedAnatomy') {
    return <UnlinkedAnatomyPage onBack={() => setView('tree')} />
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
          <Button size="small" variant="primary" onClick={() => navigateInto({ id: n.id, name: n.name, layer: currentLayer })}>
            Detail
          </Button>
          <Button size="small" onClick={() => setNodeModal({ open: true, node: n })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(n)}>Hapus</Button>
        </ActionGroup>
      ),
    },
  ]

  return (
    <Container>
      {path.length > 0 && (
        <Breadcrumb>
          <BreadcrumbLink onClick={() => setPath([])}>Anatomi &amp; Atlas 3D</BreadcrumbLink>
          {path.map((p, i) => (
            <span key={p.id} style={{ display: 'contents' }}>
              <BreadcrumbSep>›</BreadcrumbSep>
              {i < path.length - 1
                ? <BreadcrumbLink onClick={() => navigateTo(i + 1)}>{p.name}</BreadcrumbLink>
                : <BreadcrumbCurrent>{p.name}</BreadcrumbCurrent>
              }
            </span>
          ))}
        </Breadcrumb>
      )}

      <Header>
        <HeaderLeft>
          <Button
            variant="secondary"
            onClick={path.length === 0 ? onBack : () => navigateTo(path.length - 1)}
          >
            ← {path.length === 0 ? 'Fitur' : 'Kembali'}
          </Button>
          <Title>Anatomi &amp; Atlas 3D</Title>
          {path.length > 0 && <PageTitle>— {isModuleDetail ? path[path.length - 1].name : LAYER_LABELS[currentLayer]}</PageTitle>}
        </HeaderLeft>

        {path.length === 0 && (
          <ActionGroup>
            <Button variant="secondary" onClick={() => setView('unlinkedAtlas')}>Atlas Tidak Terhubung</Button>
            <Button variant="secondary" onClick={() => setView('unlinkedAnatomy')}>Quiz Tidak Terhubung</Button>
            <Button variant="secondary" onClick={() => setSettingsOpen(true)}>Pengaturan</Button>
            <Button variant="primary" onClick={() => setNodeModal({ open: true, node: null })}>
              + Tambah {LAYER_LABELS[currentLayer]}
            </Button>
          </ActionGroup>
        )}

        {path.length > 0 && !isModuleDetail && currentLayer <= 2 && (
          <Button variant="primary" onClick={() => setNodeModal({ open: true, node: null })}>
            + Tambah {LAYER_LABELS[currentLayer]}
          </Button>
        )}
      </Header>

      {isModuleDetail ? (
        <ModuleDetailPage module={path[path.length - 1]} />
      ) : (
        <Table
          columns={columns}
          data={nodes}
          loading={loading.isFetchingNodes}
          emptyText={`Belum ada ${(LAYER_LABELS[currentLayer] ?? 'node').toLowerCase()}`}
          emptySubtext={`Klik "+ Tambah ${LAYER_LABELS[currentLayer]}" untuk memulai.`}
        />
      )}

      {nodeModal.open && (
        <NodeFormModal
          layer={currentLayer}
          node={nodeModal.node}
          parentNode={parentNode}
          onClose={() => setNodeModal({ open: false, node: null })}
          onSuccess={handleNodeSuccess}
        />
      )}

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </Container>
  )
}
