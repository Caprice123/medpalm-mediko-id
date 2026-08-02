import { useDispatch, useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import Pagination from '@components/common/Pagination'
import TextInput from '@components/common/TextInput'
import MoveCardModal from '@routes/Admin/FeaturesV2/subpages/FlashcardV2/components/MoveCardModal'
import QuestionFormModal from '../../components/QuestionFormModal'
import { updateUnlinkedQuestion, assignQuestionToNode } from '@store/unlinkedQuestions'
import { useUnlinkedQuestionsPage } from './hooks/useUnlinkedQuestionsPage'
import { Container, Header, HeaderLeft, PageTitle } from '../../McqV2.styles'
import { ActionGroup } from '../QuestionsPage/QuestionsPage.styles'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function UnlinkedQuestionsPage({ onBack }) {
  const dispatch = useDispatch()
  const { questions, pagination, loading } = useSelector(state => state.unlinkedQuestions)
  const totalPages = pagination.isLastPage ? pagination.page : pagination.page + 1
  const {
    editModal, setEditModal,
    assignModal, setAssignModal,
    search, setSearch,
    handleSearch, handlePageChange, handleDelete,
    handleEditSuccess, handleAssignSuccess,
  } = useUnlinkedQuestionsPage()

  const columns = [
    {
      header: 'Pertanyaan',
      render: (q) => (
        <div>
          {q.imageUrl && (
            <img src={q.imageUrl} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, display: 'block', marginBottom: 4 }} />
          )}
          <span style={{ fontWeight: 500 }}>{q.question}</span>
        </div>
      ),
    },
    {
      header: 'Jawaban Benar',
      width: '160px',
      render: (q) => (
        <span style={{ fontWeight: 600, color: '#059669' }}>
          {OPTION_LABELS[q.correctIndex] != null ? `${OPTION_LABELS[q.correctIndex]}: ${q.options?.[q.correctIndex] ?? ''}` : '—'}
        </span>
      ),
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
          <Button size="small" variant="secondary" onClick={() => setAssignModal({ open: true, question: q })}>Pindah</Button>
          <Button size="small" onClick={() => setEditModal({ open: true, question: q })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(q)}>Hapus</Button>
        </ActionGroup>
      ),
    },
  ]

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={onBack}>← Kembali</Button>
          <PageTitle>Pertanyaan Tidak Terhubung</PageTitle>
        </HeaderLeft>
      </Header>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <TextInput
          placeholder="Cari teks pertanyaan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1 }}
        />
        <Button variant="secondary" onClick={handleSearch}>Cari</Button>
      </div>

      <Table
        columns={columns}
        data={questions}
        loading={loading.isFetchingQuestions}
        emptyText="Tidak ada pertanyaan tanpa sub-topik"
        emptySubtext="Semua pertanyaan sudah terhubung ke sub-topik."
      />

      {(questions.length > 0 || pagination.page > 1) && (
        <Pagination
          currentPage={pagination.page}
          totalPages={totalPages}
          totalItems={pagination.isLastPage ? (pagination.page - 1) * pagination.perPage + questions.length : undefined}
          itemsPerPage={pagination.perPage}
          onPageChange={handlePageChange}
        />
      )}

      {editModal.open && (
        <QuestionFormModal
          question={editModal.question}
          onClose={() => setEditModal({ open: false, question: null })}
          onSuccess={handleEditSuccess}
          onSave={(payload, onSuccess) => dispatch(updateUnlinkedQuestion(editModal.question.id, payload, onSuccess))}
          isSavingOverride={loading.isUpdatingQuestion}
        />
      )}

      {assignModal.open && (
        <MoveCardModal
          card={assignModal.question}
          onClose={() => setAssignModal({ open: false, question: null })}
          onSuccess={handleAssignSuccess}
          onMove={(targetNodeId, onSuccess) => dispatch(assignQuestionToNode(assignModal.question.id, targetNodeId, onSuccess))}
          isSavingOverride={loading.isAssigningQuestion}
          title="Pindah ke Sub-topik"
        />
      )}
    </Container>
  )
}
