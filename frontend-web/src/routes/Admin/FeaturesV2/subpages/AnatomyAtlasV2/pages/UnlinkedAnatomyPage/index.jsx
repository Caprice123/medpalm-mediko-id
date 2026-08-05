import { useDispatch, useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import QuizCreateModal from '../ModuleDetailPage/components/QuizCreateModal'
import MoveContentModal from '../ModuleDetailPage/components/MoveContentModal'
import { assignAnatomyToNode } from '@store/unlinkedAnatomy/adminAction'
import { useUnlinkedAnatomyPage } from './hooks/useUnlinkedAnatomyPage'
import { Container, Header, HeaderLeft, PageTitle, ActionGroup } from '../../AnatomyAtlasV2.styles'
import { Description } from '../ModuleDetailPage/ModuleDetailPage.styles'

export default function UnlinkedAnatomyPage({ onBack }) {
  const dispatch = useDispatch()
  const { quizzes, pagination, loading } = useSelector(state => state.unlinkedAnatomy)

  const {
    editModal, setEditModal,
    assignModal, setAssignModal,
    search, setSearch,
    handleSearch, handleLoadMore, handleDelete,
    handleEditSuccess, handleAssignSuccess,
  } = useUnlinkedAnatomyPage()

  const columns = [
    {
      header: 'Judul',
      render: (q) => <span style={{ fontWeight: 600, color: '#111827' }}>{q.title}</span>,
    },
    {
      header: 'Deskripsi',
      render: (q) => <Description>{q.description || '—'}</Description>,
    },
    {
      header: 'Versi',
      width: '70px',
      render: (q) => `v${q.version ?? 1}`,
    },
    {
      header: 'Aksi',
      width: '220px',
      align: 'right',
      render: (q) => (
        <ActionGroup>
          <Button size="small" variant="secondary" onClick={() => setAssignModal({ open: true, quiz: q })}>Pindah</Button>
          <Button size="small" onClick={() => setEditModal({ open: true, quiz: q })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(q)}>Hapus</Button>
        </ActionGroup>
      ),
    },
  ]

  return (
    <Container>
      <div>
        <Header>
          <HeaderLeft>
            <Button variant="secondary" onClick={onBack}>← Kembali</Button>
            <PageTitle>Quiz Anatomi Tidak Terhubung</PageTitle>
          </HeaderLeft>
        </Header>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <TextInput
          placeholder="Cari judul atau deskripsi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1 }}
        />
        <Button variant="secondary" onClick={handleSearch}>Cari</Button>
      </div>

      <Table
        columns={columns}
        data={quizzes}
        loading={loading.isFetchingQuizzes}
        emptyText="Tidak ada Quiz Anatomi tanpa modul"
        emptySubtext="Semua Quiz Anatomi sudah terhubung ke modul."
      />

      {!pagination.isLastPage && (
        <Button
          variant="secondary"
          onClick={handleLoadMore}
          disabled={loading.isFetchingQuizzes}
          style={{ margin: '0 auto' }}
        >
          {loading.isFetchingQuizzes ? 'Memuat...' : 'Muat Lebih Banyak'}
        </Button>
      )}

      {editModal.open && (
        <QuizCreateModal
          quiz={editModal.quiz}
          onSuccess={handleEditSuccess}
          onClose={() => setEditModal({ open: false, quiz: null })}
        />
      )}

      {assignModal.open && (
        <MoveContentModal
          title="Pindah ke Modul"
          nodeTypeFilter="module"
          onMove={(targetNodeId, onSuccess) =>
            dispatch(assignAnatomyToNode(assignModal.quiz.uniqueId, targetNodeId, onSuccess))
          }
          onSuccess={handleAssignSuccess}
          onClose={() => setAssignModal({ open: false, quiz: null })}
          isSaving={loading.isAssigningQuiz}
        />
      )}
    </Container>
  )
}
