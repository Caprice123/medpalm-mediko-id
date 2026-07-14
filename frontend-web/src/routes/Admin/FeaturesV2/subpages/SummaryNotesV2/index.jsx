import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminSummaryNotesV2, fetchAdminSummaryNoteDetailV2, deleteSummaryNoteV2 } from '@store/summaryNotes/v2/adminAction'
import { fetchLazyNodes } from '@store/featureNodes/adminAction'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import CreateNoteModalV2 from './components/CreateNoteModalV2'
import NoteDetailPage from './components/NoteDetailPage'
import {
  Container, Header, HeaderLeft, Title,
  Layout, TreePane, ContentPane,
  FolderRow, FolderChevron, FolderName,
  NoteStatusBadge, NoteActions,
  UnassignedRow, EmptyText, PaneTitle,
  GlobalSearchBar, FilterBar,
} from './SummaryNotesV2.styles'

const UNASSIGNED_ID = '__unassigned__'
const PER_PAGE = 50
const STATUS_OPTIONS = [
  { label: 'Draf', value: 'draft' },
  { label: 'Pengujian', value: 'testing' },
  { label: 'Diterbitkan', value: 'published' },
]

function FolderNode({ node, depth, childrenMap, loadingNodeIds, expandedIds, selectedId, onSelect, onToggle }) {
  const children = childrenMap[node.id] || []
  const isExpanded = expandedIds.has(node.id)
  const isLoading = loadingNodeIds.has(node.id)
  const isSelected = selectedId === node.id
  const childrenLoaded = node.id in childrenMap
  const showChevron = isLoading || !childrenLoaded || children.length > 0

  return (
    <>
      <FolderRow $depth={depth} $selected={isSelected} onClick={() => { onSelect(node.id); onToggle(node.id) }}>
        <FolderChevron $open={isExpanded} $visible={showChevron}>
          {isLoading ? '…' : '▶'}
        </FolderChevron>
        <FolderName $selected={isSelected}>{node.name}</FolderName>
      </FolderRow>
      {isExpanded && children.map(child => (
        <FolderNode
          key={child.id}
          node={child}
          depth={depth + 1}
          childrenMap={childrenMap}
          loadingNodeIds={loadingNodeIds}
          expandedIds={expandedIds}
          selectedId={selectedId}
          onSelect={onSelect}
          onToggle={onToggle}
        />
      ))}
    </>
  )
}

function SummaryNotesV2({ onBack }) {
  const dispatch = useDispatch()
  const { notes, loading: notesLoading, pagination } = useSelector(s => s.summaryNotesV2)

  // Lazy tree state
  const [rootNodes, setRootNodes] = useState([])
  const [childrenMap, setChildrenMap] = useState({})
  const [expandedIds, setExpandedIds] = useState(new Set())
  const [loadingNodeIds, setLoadingNodeIds] = useState(new Set())
  const [treeLoading, setTreeLoading] = useState(false)

  // Selection & pagination
  const [selectedNodeId, setSelectedNodeId] = useState(UNASSIGNED_ID)
  const [notesPage, setNotesPage] = useState(1)

  // Navigation
  const [selectedNote, setSelectedNote] = useState(null)
  const [creatingNote, setCreatingNote] = useState(false)

  // Filters — separate input state from committed state to avoid per-keystroke API calls
  const [globalSearchInput, setGlobalSearchInput] = useState('')
  const [globalSearch, setGlobalSearch] = useState('')
  const [globalStatusFilter, setGlobalStatusFilter] = useState('')
  const [folderSearchInput, setFolderSearchInput] = useState('')
  const [folderSearch, setFolderSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const isGlobalSearchActive = !!globalSearch.trim() || !!globalStatusFilter

  // Refs to access current state inside callbacks
  const selectionRef = useRef({ selectedNodeId, notesPage, globalSearch, globalStatusFilter, folderSearch, statusFilter })
  useEffect(() => {
    selectionRef.current = { selectedNodeId, notesPage, globalSearch, globalStatusFilter, folderSearch, statusFilter }
  })

  // ── Data loading ──────────────────────────────────────────────

  const doFetchNotes = (nodeId, page, gSearch, gStatus, fSearch, sFilter, append = false) => {
    if (gSearch.trim() || gStatus) {
      dispatch(fetchAdminSummaryNotesV2({
        ...(gSearch.trim() && { search: gSearch.trim() }),
        ...(gStatus && { status: gStatus }),
        perPage: PER_PAGE, page, append,
      }))
    } else if (nodeId === UNASSIGNED_ID) {
      dispatch(fetchAdminSummaryNotesV2({
        unassigned: true, perPage: PER_PAGE, page, append,
        ...(fSearch && { search: fSearch }),
        ...(sFilter && { status: sFilter }),
      }))
    } else {
      dispatch(fetchAdminSummaryNotesV2({
        nodeId, perPage: PER_PAGE, page, append,
        ...(fSearch && { search: fSearch }),
        ...(sFilter && { status: sFilter }),
      }))
    }
  }

  // Fetch notes when selection/filters change — always page 1, replace
  useEffect(() => {
    setNotesPage(1)
    doFetchNotes(selectedNodeId, 1, globalSearch, globalStatusFilter, folderSearch, statusFilter)
  }, [selectedNodeId, globalSearch, globalStatusFilter, folderSearch, statusFilter])

  // Load root nodes on mount
  useEffect(() => {
    setTreeLoading(true)
    dispatch(fetchLazyNodes(null))
      .then(nodes => setRootNodes(nodes))
      .finally(() => setTreeLoading(false))
  }, [])

  // ── Tree interaction ──────────────────────────────────────────

  const handleToggleNode = async (nodeId) => {
    const isExpanded = expandedIds.has(nodeId)

    if (isExpanded) {
      setExpandedIds(prev => { const s = new Set(prev); s.delete(nodeId); return s })
      return
    }

    // Expand: fetch children if not loaded
    setExpandedIds(prev => new Set([...prev, nodeId]))

    if (!(nodeId in childrenMap)) {
      setLoadingNodeIds(prev => new Set([...prev, nodeId]))
      try {
        const children = await dispatch(fetchLazyNodes(nodeId))
        setChildrenMap(prev => ({ ...prev, [nodeId]: children }))
      } finally {
        setLoadingNodeIds(prev => { const s = new Set(prev); s.delete(nodeId); return s })
      }
    }
  }

  const handleSelectNode = (nodeId) => {
    if (nodeId === selectedNodeId) return
    setSelectedNodeId(nodeId)
    setNotesPage(1)
    setFolderSearch('')
    setFolderSearchInput('')
    setStatusFilter('')
  }

  // ── Notes actions ─────────────────────────────────────────────

  const handleKelola = async (note) => {
    await dispatch(fetchAdminSummaryNoteDetailV2(note.uniqueId))
    setSelectedNote(note)
  }

  const handleDelete = async (note) => {
    if (!window.confirm(`Hapus ringkasan "${note.title}"?`)) return
    await dispatch(deleteSummaryNoteV2(note.uniqueId))
    setNotesPage(1)
    doFetchNotes(selectedNodeId, 1, globalSearch, globalStatusFilter, folderSearch, statusFilter)
  }

  const handleBack = () => {
    setSelectedNote(null)
    setNotesPage(1)
    doFetchNotes(selectedNodeId, 1, globalSearch, globalStatusFilter, folderSearch, statusFilter)
  }

  const handleLoadMore = () => {
    const nextPage = notesPage + 1
    setNotesPage(nextPage)
    doFetchNotes(selectedNodeId, nextPage, globalSearch, globalStatusFilter, folderSearch, statusFilter, true)
  }

  // ── Filter handlers ───────────────────────────────────────────

  const commitGlobalSearch = (value) => {
    setGlobalSearch(value)
    setNotesPage(1)
  }

  const commitFolderSearch = (value) => {
    setFolderSearch(value)
    setNotesPage(1)
  }

  const handleStatusFilter = (value) => {
    setStatusFilter(value)
    setNotesPage(1)
  }

  // ── Render ────────────────────────────────────────────────────

  if (selectedNote) {
    return <NoteDetailPage note={selectedNote} onBack={handleBack} />
  }

  const isLoading = notesLoading?.isAdminNotesLoading

  const columns = [
    {
      header: 'Judul',
      render: (note) => (
        <div>
          <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{note.title}</div>
          {note.description && (
            <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.125rem' }}>{note.description}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      width: '110px',
      render: (note) => <NoteStatusBadge $status={note.status}>{note.status}</NoteStatusBadge>,
    },
    {
      header: 'Aksi',
      width: '140px',
      render: (note) => (
        <NoteActions>
          <Button variant="primary" onClick={() => handleKelola(note)}>Kelola</Button>
          <Button variant="danger" onClick={() => handleDelete(note)}>Hapus</Button>
        </NoteActions>
      ),
    },
  ]

  const emptyText = isGlobalSearchActive
    ? 'Tidak ada ringkasan yang sesuai pencarian'
    : selectedNodeId === UNASSIGNED_ID
      ? 'Semua ringkasan sudah ditugaskan ke folder'
      : 'Tidak ada ringkasan di folder ini'

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={onBack}>← Kembali</Button>
          <Title>Summary Notes V2 — Struktur Folder</Title>
        </HeaderLeft>
      </Header>

      {/* Global search — searches across all folders */}
      <GlobalSearchBar>
        <div style={{ flex: 1, minWidth: 0 }}>
          <TextInput
            placeholder="Cari judul di semua folder... (Enter)"
            value={globalSearchInput}
            onChange={e => setGlobalSearchInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') commitGlobalSearch(e.target.value.trim())
              if (e.key === 'Escape') { setGlobalSearchInput(''); commitGlobalSearch('') }
            }}
          />
        </div>
        <div style={{ width: '180px', flexShrink: 0 }}>
          <Dropdown
            options={STATUS_OPTIONS}
            value={globalStatusFilter ? STATUS_OPTIONS.find(o => o.value === globalStatusFilter) : null}
            onChange={opt => { setGlobalStatusFilter(opt?.value || ''); setNotesPage(1) }}
            placeholder="Semua Status"
            usePortal
            isClearable
          />
        </div>
      </GlobalSearchBar>

      <Layout>
        <TreePane>
          <PaneTitle>Folder</PaneTitle>

          <UnassignedRow
            $selected={selectedNodeId === UNASSIGNED_ID}
            onClick={() => { handleSelectNode(UNASSIGNED_ID) }}
          >
            <FolderName $selected={selectedNodeId === UNASSIGNED_ID}>Belum Ditugaskan</FolderName>
          </UnassignedRow>

          {treeLoading ? (
            <EmptyText style={{ padding: '1rem', fontSize: '0.75rem' }}>Memuat...</EmptyText>
          ) : rootNodes.map(node => (
            <FolderNode
              key={node.id}
              node={node}
              depth={0}
              childrenMap={childrenMap}
              loadingNodeIds={loadingNodeIds}
              expandedIds={expandedIds}
              selectedId={selectedNodeId}
              onSelect={handleSelectNode}
              onToggle={handleToggleNode}
            />
          ))}
        </TreePane>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <FilterBar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <TextInput
                placeholder={isGlobalSearchActive ? 'Global search aktif...' : 'Cari dalam folder ini... (Enter)'}
                value={folderSearchInput}
                onChange={e => setFolderSearchInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') commitFolderSearch(e.target.value.trim())
                  if (e.key === 'Escape') { setFolderSearchInput(''); commitFolderSearch('') }
                }}
                disabled={isGlobalSearchActive}
              />
            </div>
            <div style={{ width: '160px', flexShrink: 0 }}>
              <Dropdown
                options={STATUS_OPTIONS}
                value={statusFilter ? STATUS_OPTIONS.find(o => o.value === statusFilter) : null}
                onChange={opt => handleStatusFilter(opt?.value || '')}
                placeholder="Semua Status"
                disabled={isGlobalSearchActive}
                usePortal
                isClearable
              />
            </div>
            <Button
              variant="primary"
              onClick={() => setCreatingNote(true)}
              style={{ flexShrink: 0 }}
            >
              + Tambah
            </Button>
          </FilterBar>

          <ContentPane>
            <Table
              columns={columns}
              data={notes}
              loading={isLoading}
              hoverable
              emptyText={emptyText}
              emptySubtext=""
            />
          </ContentPane>

          {!pagination?.isLastPage && (
            <div style={{ padding: '0.625rem 1rem', borderTop: '1px solid #e5e7eb', flexShrink: 0 }}>
              <Button
                variant="secondary"
                disabled={isLoading}
                onClick={handleLoadMore}
                style={{ width: '100%' }}
              >
                {isLoading ? 'Memuat...' : 'Muat Lebih Banyak'}
              </Button>
            </div>
          )}
        </div>
      </Layout>

      {creatingNote && (
        <CreateNoteModalV2
          nodeId={selectedNodeId !== UNASSIGNED_ID ? selectedNodeId : null}
          onClose={async (note) => {
            setCreatingNote(false)
            if (note?.uniqueId) {
              await dispatch(fetchAdminSummaryNoteDetailV2(note.uniqueId))
              setSelectedNote(note)
            } else {
              doFetchNotes(selectedNodeId, notesPage, globalSearch, globalStatusFilter, folderSearch, statusFilter)
            }
          }}
        />
      )}
    </Container>
  )
}

export default SummaryNotesV2
