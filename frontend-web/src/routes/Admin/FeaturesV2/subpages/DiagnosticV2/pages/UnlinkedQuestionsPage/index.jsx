import { useDispatch, useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import QuestionFormModal from '../../components/QuestionFormModal'
import MoveQuestionModal from '../../components/MoveQuestionModal'
import { updateUnlinkedDiagnosticQuestion } from '@store/diagnosticNodes/adminAction'
import { useUnlinkedQuestionsPage } from './hooks/useUnlinkedQuestionsPage'
import { Container, Header, HeaderLeft, PageTitle, ActionGroup } from '../../DiagnosticV2.styles'

export default function UnlinkedQuestionsPage({ onBack }) {
  const dispatch = useDispatch()
  const { questions, pagination, loading } = useSelector(s => s.nodeQuestions)

  const {
    editModal, setEditModal,
    moveModal, setMoveModal,
    search, setSearch,
    handleSearch, handleLoadMore, handleDelete,
    handleEditSuccess, handleMoveSuccess,
  } = useUnlinkedQuestionsPage()

  const columns = [
    {
      header: 'Pertanyaan',
      render: (q) => (
        <div>
          {q.vignette && (
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 2 }}>
              {q.vignette.slice(0, 80)}{q.vignette.length > 80 ? '…' : ''}
            </div>
          )}
          <span>{q.question}</span>
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
          <Button size="small" onClick={() => setEditModal({ open: true, question: q })}>Edit</Button>
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
            <PageTitle>Soal Tidak Tertaut</PageTitle>
          </HeaderLeft>
        </Header>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <TextInput
          placeholder="Cari pertanyaan atau vignette..."
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
        emptyText="Tidak ada soal tanpa sub-topik"
        emptySubtext="Semua soal sudah tertaut ke sub-topik."
      />

      {!pagination.isLastPage && (
        <Button
          variant="secondary"
          onClick={handleLoadMore}
          disabled={loading.isFetchingQuestions}
          style={{ margin: '0 auto' }}
        >
          {loading.isFetchingQuestions ? 'Memuat...' : 'Muat Lebih Banyak'}
        </Button>
      )}

      {editModal.open && (
        <QuestionFormModal
          question={editModal.question}
          onClose={() => setEditModal({ open: false, question: null })}
          onSave={(payload) => dispatch(updateUnlinkedDiagnosticQuestion(editModal.question.id, payload, handleEditSuccess))}
          isSavingOverride={loading.isUpdatingQuestion}
        />
      )}

      {moveModal.open && (
        <MoveQuestionModal
          question={moveModal.question}
          onClose={() => setMoveModal({ open: false, question: null })}
          onSuccess={handleMoveSuccess}
          isSavingOverride={loading.isMovingQuestion}
        />
      )}
    </Container>
  )
}
