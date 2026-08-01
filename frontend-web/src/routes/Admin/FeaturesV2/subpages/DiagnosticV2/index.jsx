import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDiagnosticAdminQuestions,
  addDiagnosticQuestion,
  updateDiagnosticQuestion,
  deleteDiagnosticQuestion,
  importDiagnosticQuestions,
  downloadDiagnosticTemplate,
  moveLinkedDiagnosticQuestion,
} from '@store/diagnosticNodes/adminAction'
import { fetchFeatureNodes, updateFilter, deleteFeatureNode } from '@store/featureNodes'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import Modal from '@components/common/Modal'
import Pagination from '@components/common/Pagination'
import NodeFormModal from './components/NodeFormModal'
import QuestionFormModal from './components/QuestionFormModal'
import MoveQuestionModal from './components/MoveQuestionModal'
import UnlinkedQuestionsPage from './components/UnlinkedQuestionsPage'
import DiagnosticSettingsModal from '@routes/Admin/Features/subpages/DiagnosticQuiz/components/DiagnosticSettingsModal'
import {
  Container, Header, HeaderLeft, Title, PageTitle,
  Breadcrumb, BreadcrumbLink, BreadcrumbSep, BreadcrumbCurrent,
  ActionGroup, ClassificationBadge, SearchRow,
} from './DiagnosticV2.styles'

const LAYER_LABELS = { 1: 'Topik', 2: 'Sub-topik' }
const CLASSIFICATION_LABELS = { primary: 'Utama', special: 'Khusus' }

export default function DiagnosticV2({ onBack }) {
  const dispatch = useDispatch()
  const { nodes, loading: nodeLoading } = useSelector(s => s.featureNodes)
  const { questions, pagination, loading: qLoading } = useSelector(s => s.nodeQuestions)

  // path = [{id, name, layer}, ...]  — 0 items = topics, 1 item = subtopics, 2 items = questions
  const [path, setPath] = useState([])
  const [showUnlinked, setShowUnlinked] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [nodeModal, setNodeModal] = useState({ open: false, node: null })
  const [qModal, setQModal] = useState({ open: false, question: null })
  const [moveModal, setMoveModal] = useState({ open: false, question: null })
  const [importResult, setImportResult] = useState(null)
  const [search, setSearch] = useState('')
  const importRef = useRef(null)

  const currentLayer = path.length + 1  // 1=topics, 2=subtopics
  const parentNode = path.length > 0 ? path[path.length - 1] : null
  const inQuestions = path.length === 2

  useEffect(() => {
    setSearch('')
    if (showUnlinked) return
    if (!inQuestions) {
      dispatch(updateFilter({ key: 'layer', value: String(currentLayer) }))
      dispatch(updateFilter({ key: 'parentId', value: parentNode?.id ? String(parentNode.id) : '' }))
      dispatch(updateFilter({ key: 'visibility', value: 'diagnostic' }))
      dispatch(updateFilter({ key: 'search', value: '' }))
      dispatch(fetchFeatureNodes())
    } else {
      dispatch(fetchDiagnosticAdminQuestions(parentNode.id))
    }
  }, [path, showUnlinked])

  const handleSearch = () => {
    if (inQuestions) {
      dispatch(fetchDiagnosticAdminQuestions(parentNode.id, { page: 1, search: search.trim() }))
    } else {
      dispatch(updateFilter({ key: 'search', value: search.trim() }))
      dispatch(fetchFeatureNodes())
    }
  }

  const navigate = (node) => setPath(prev => [...prev, node])
  const navigateTo = (index) => setPath(prev => prev.slice(0, index))

  const handleDelete = (node) => {
    if (!window.confirm(`Hapus "${node.name}"? Semua data di dalamnya akan ikut terhapus.`)) return
    dispatch(deleteFeatureNode(node.id, () => {
      dispatch(updateFilter({ key: 'layer', value: String(currentLayer) }))
      dispatch(updateFilter({ key: 'parentId', value: parentNode?.id ? String(parentNode.id) : '' }))
      dispatch(updateFilter({ key: 'visibility', value: 'diagnostic' }))
      dispatch(fetchFeatureNodes())
    }))
  }

  const handleDeleteQuestion = (q) => {
    if (!window.confirm(`Hapus soal ini?`)) return
    dispatch(deleteDiagnosticQuestion(parentNode.id, q.id, () =>
      dispatch(fetchDiagnosticAdminQuestions(parentNode.id))
    ))
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    dispatch(importDiagnosticQuestions(parentNode.id, file, (result) => {
      setImportResult(result)
      dispatch(fetchDiagnosticAdminQuestions(parentNode.id))
    }))
  }

  const handleQSave = (payload) => {
    const onSuccess = () => {
      setQModal({ open: false, question: null })
      dispatch(fetchDiagnosticAdminQuestions(parentNode.id))
    }
    if (qModal.question) {
      dispatch(updateDiagnosticQuestion(parentNode.id, qModal.question.id, payload, onSuccess))
    } else {
      dispatch(addDiagnosticQuestion(parentNode.id, payload, onSuccess))
    }
  }

  const handlePageChange = (page) => {
    dispatch(fetchDiagnosticAdminQuestions(parentNode.id, { page, search: search.trim() }))
  }

  if (showUnlinked) {
    return <UnlinkedQuestionsPage onBack={() => setShowUnlinked(false)} />
  }

  // Node table columns (topics and subtopics)
  const nodeColumns = [
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
          <Button size="small" variant="primary" onClick={() => navigate({ id: n.id, name: n.name, layer: currentLayer })}>
            {currentLayer === 1 ? 'Detail' : 'Soal'}
          </Button>
          <Button size="small" onClick={() => setNodeModal({ open: true, node: n })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(n)}>Hapus</Button>
        </ActionGroup>
      ),
    },
  ]

  // Question table columns
  const questionColumns = [
    {
      header: 'Pertanyaan',
      render: (q) => (
        <div>
          {q.vignette && <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 2 }}>{q.vignette.slice(0, 80)}…</div>}
          <span style={{ fontWeight: 500 }}>{q.question}</span>
        </div>
      ),
    },
    {
      header: 'Jawaban',
      width: '160px',
      render: (q) => <span style={{ color: '#16a34a', fontWeight: 600 }}>{q.answer}</span>,
    },
    {
      header: 'Aksi',
      width: '220px',
      align: 'right',
      render: (q) => (
        <ActionGroup>
          <Button size="small" variant="secondary" onClick={() => setMoveModal({ open: true, question: q })}>Pindah</Button>
          <Button size="small" onClick={() => setQModal({ open: true, question: q })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDeleteQuestion(q)}>Hapus</Button>
        </ActionGroup>
      ),
    },
  ]

  const totalPages = pagination.isLastPage ? pagination.page : pagination.page + 1

  return (
    <Container>
      {path.length > 0 && (
        <Breadcrumb>
          <BreadcrumbLink onClick={() => setPath([])}>Diagnostik V2</BreadcrumbLink>
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
          <Button variant="secondary" onClick={path.length === 0 ? onBack : () => navigateTo(path.length - 1)}>
            ← {path.length === 0 ? 'Fitur' : 'Kembali'}
          </Button>
          <Title>Diagnostik V2</Title>
          {path.length > 0 && <PageTitle>— {LAYER_LABELS[currentLayer] ?? 'Soal'}</PageTitle>}
        </HeaderLeft>

        <ActionGroup>
          {inQuestions ? (
            <>
              <Button variant="secondary" onClick={() => dispatch(downloadDiagnosticTemplate())}>
                Unduh Template
              </Button>
              <input ref={importRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleImport} />
              <Button
                variant="secondary"
                disabled={qLoading.isImportingQuestions}
                onClick={() => importRef.current?.click()}
              >
                {qLoading.isImportingQuestions ? 'Mengimpor...' : 'Import Excel'}
              </Button>
              <Button variant="primary" onClick={() => setQModal({ open: true, question: null })}>
                + Tambah Soal
              </Button>
            </>
          ) : (
            <>
              {path.length === 0 && (
                <>
                  <Button variant="secondary" onClick={() => setShowUnlinked(true)}>
                    Soal Tidak Tertaut
                  </Button>
                  <Button variant="secondary" onClick={() => setSettingsOpen(true)}>
                    Pengaturan
                  </Button>
                </>
              )}
              <Button variant="primary" onClick={() => setNodeModal({ open: true, node: null })}>
                + Tambah {LAYER_LABELS[currentLayer]}
              </Button>
            </>
          )}
        </ActionGroup>
      </Header>

      <SearchRow>
        <TextInput
          placeholder={inQuestions ? 'Cari pertanyaan atau vignette...' : `Cari ${LAYER_LABELS[currentLayer]?.toLowerCase()}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="secondary" onClick={handleSearch}>Cari</Button>
      </SearchRow>

      {inQuestions ? (
        <>
          <Table
            columns={questionColumns}
            data={questions}
            loading={qLoading.isFetchingQuestions}
            emptyText="Belum ada soal"
            emptySubtext='Klik "+ Tambah Soal" untuk memulai.'
          />
          {(questions.length > 0 || pagination.page > 1) && (
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <Table
          columns={nodeColumns}
          data={nodes}
          loading={nodeLoading.isFetchingNodes}
          emptyText={`Belum ada ${LAYER_LABELS[currentLayer]?.toLowerCase()}`}
          emptySubtext={`Klik "+ Tambah ${LAYER_LABELS[currentLayer]}" untuk memulai.`}
        />
      )}

      {nodeModal.open && (
        <NodeFormModal
          layer={currentLayer}
          node={nodeModal.node}
          parentNode={parentNode}
          onClose={() => setNodeModal({ open: false, node: null })}
          onSuccess={() => {
            setNodeModal({ open: false, node: null })
            dispatch(updateFilter({ key: 'layer', value: String(currentLayer) }))
            dispatch(updateFilter({ key: 'parentId', value: parentNode?.id ? String(parentNode.id) : '' }))
            dispatch(updateFilter({ key: 'visibility', value: 'diagnostic' }))
            dispatch(fetchFeatureNodes())
          }}
        />
      )}

      {qModal.open && (
        <QuestionFormModal
          nodeId={parentNode?.id}
          question={qModal.question}
          onClose={() => setQModal({ open: false, question: null })}
          onSave={handleQSave}
          isSavingOverride={qModal.question ? qLoading.isUpdatingQuestion : qLoading.isAddingQuestion}
        />
      )}

      {moveModal.open && (
        <MoveQuestionModal
          question={moveModal.question}
          onClose={() => setMoveModal({ open: false, question: null })}
          onSuccess={() => {
            setMoveModal({ open: false, question: null })
            dispatch(fetchDiagnosticAdminQuestions(parentNode.id))
          }}
          onMove={(targetNodeId, onSuccess) =>
            dispatch(moveLinkedDiagnosticQuestion(moveModal.question.id, targetNodeId, onSuccess))
          }
          isSavingOverride={qLoading.isMovingQuestion}
        />
      )}

      {settingsOpen && <DiagnosticSettingsModal onClose={() => setSettingsOpen(false)} />}

      {importResult && (
        <Modal title="Hasil Import" onClose={() => setImportResult(null)}>
          <p style={{ marginBottom: 8 }}>Berhasil diimpor: <strong>{importResult.imported}</strong> soal</p>
          {importResult.errors?.length > 0 && (
            <>
              <p style={{ marginBottom: 4, color: '#dc2626' }}>Gagal ({importResult.errors.length} baris):</p>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {importResult.errors.map((e, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#dc2626' }}>Baris {e.row}: {e.message}</li>
                ))}
              </ul>
            </>
          )}
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button onClick={() => setImportResult(null)}>Tutup</Button>
          </div>
        </Modal>
      )}
    </Container>
  )
}
