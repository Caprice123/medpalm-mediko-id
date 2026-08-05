import { useDispatch, useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import Modal from '@components/common/Modal'
import Breadcrumb from '@components/common/Breadcrumb'
import MoveCardModal from '@routes/Admin/FeaturesV2/subpages/FlashcardV2/components/MoveCardModal'
import QuestionFormModal from '../../components/QuestionFormModal'
import { moveNodeQuestion } from '@store/nodeQuestions'
import { downloadQuestionsTemplate } from '@store/nodeQuestions/adminAction'
import { useQuestionsPage } from './hooks/useQuestionsPage'
import { Container, Header, HeaderLeft, PageTitle } from '../../McqV2.styles'
import { ActionGroup, CorrectAnswer } from './QuestionsPage.styles'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function QuestionsPage({ node, parentNode, onBack }) {
  const dispatch = useDispatch()
  const { questions, pagination, loading } = useSelector(state => state.nodeQuestions)
  const {
    modal, setModal,
    moveModal, setMoveModal,
    importRef, importResult, setImportResult,
    handleDelete, handleLoadMore, handleQuestionSuccess, handleMoveSuccess, handleImportFile,
  } = useQuestionsPage(node)

  const columns = [
    {
      header: 'Pertanyaan',
      render: (q) => <span style={{ fontWeight: 500 }}>{q.question}</span>,
    },
    {
      header: 'Jawaban Benar',
      width: '160px',
      render: (q) => (
        <CorrectAnswer>
          {OPTION_LABELS[q.correctIndex] != null ? `${OPTION_LABELS[q.correctIndex]}: ${q.options?.[q.correctIndex] ?? ''}` : '—'}
        </CorrectAnswer>
      ),
    },
    {
      header: 'Aksi',
      width: '200px',
      align: 'right',
      render: (q) => (
        <ActionGroup>
          <Button size="small" variant="secondary" onClick={() => setMoveModal({ open: true, question: q })}>Pindah</Button>
          <Button size="small" onClick={() => setModal({ open: true, question: q })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(q)}>Hapus</Button>
        </ActionGroup>
      ),
    },
  ]

  return (
    <Container>
      <div>
        <Breadcrumb
          style={{ marginBottom: '0.25rem' }}
          items={[
            { label: 'MCQ V2', onClick: onBack },
            { label: parentNode.name, onClick: onBack },
            { label: node.name },
          ]}
        />
        <Header>
          <HeaderLeft>
            <Button variant="secondary" onClick={onBack}>← Kembali</Button>
            <PageTitle>Pertanyaan</PageTitle>
          </HeaderLeft>
          <ActionGroup>
            <Button variant="secondary" onClick={() => dispatch(downloadQuestionsTemplate())}>Unduh Template</Button>
            <input ref={importRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleImportFile} />
            <Button
              variant="secondary"
              disabled={loading.isImportingQuestions}
              onClick={() => importRef.current?.click()}
            >
              {loading.isImportingQuestions ? 'Mengimpor...' : 'Import Excel'}
            </Button>
            <Button variant="primary" onClick={() => setModal({ open: true, question: null })}>+ Tambah Pertanyaan</Button>
          </ActionGroup>
        </Header>
      </div>

      <Table
        columns={columns}
        data={questions}
        loading={loading.isFetchingQuestions}
        emptyText="Belum ada pertanyaan"
        emptySubtext='Klik "+ Tambah Pertanyaan" untuk memulai.'
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

      {modal.open && (
        <QuestionFormModal
          nodeId={node.id}
          question={modal.question}
          onClose={() => setModal({ open: false, question: null })}
          onSuccess={handleQuestionSuccess}
        />
      )}

      {moveModal.open && (
        <MoveCardModal
          card={moveModal.question}
          currentNode={node}
          nodeTypeFilter="subtopic"
          onClose={() => setMoveModal({ open: false, question: null })}
          onSuccess={handleMoveSuccess}
          onMove={(targetNodeId, onSuccess) => dispatch(moveNodeQuestion(node.id, moveModal.question.id, targetNodeId, onSuccess))}
          isSavingOverride={loading.isMovingQuestion}
          title="Pindah ke Sub-topik"
        />
      )}

      {importResult && (
        <Modal title="Hasil Import" onClose={() => setImportResult(null)}>
          <p style={{ marginBottom: 8 }}>Berhasil diimpor: <strong>{importResult.imported}</strong> pertanyaan</p>
          {importResult.errors.length > 0 && (
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
