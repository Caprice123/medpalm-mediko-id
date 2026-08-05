import { useDispatch } from 'react-redux'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import Modal from '@components/common/Modal'
import Breadcrumb from '@components/common/Breadcrumb'
import QuestionFormModal from '../../components/QuestionFormModal'
import MoveQuestionModal from '../../components/MoveQuestionModal'
import { downloadDiagnosticTemplate, moveLinkedDiagnosticQuestion } from '@store/diagnosticNodes/adminAction'
import { useQuestionsPage } from './hooks/useQuestionsPage'
import {
  Container, Header, HeaderLeft, Title, PageTitle, ActionGroup, SearchRow,
} from '../../DiagnosticV2.styles'

export default function QuestionsPage({ path, parentNode, onBack, onNavigateRoot, onNavigateTo }) {
  const dispatch = useDispatch()
  const {
    questions, pagination, loading,
    search, setSearch, handleSearch,
    qModal, setQModal, handleQSave,
    moveModal, setMoveModal, handleMoveSuccess,
    importResult, setImportResult, importRef, handleImportFile,
    handleDelete, handleLoadMore,
  } = useQuestionsPage(parentNode)

  const columns = [
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
          <Button size="small" variant="danger" onClick={() => handleDelete(q)}>Hapus</Button>
        </ActionGroup>
      ),
    },
  ]

  return (
    <Container>
      <Breadcrumb
        items={[
          { label: 'Diagnostik V2', onClick: onNavigateRoot },
          ...path.map((p, i) => ({
            label: p.name,
            onClick: i < path.length - 1 ? () => onNavigateTo(i + 1) : undefined,
          })),
        ]}
      />

      <Header>
        <HeaderLeft>
          <Button variant="secondary" onClick={onBack}>← Kembali</Button>
          <Title>Diagnostik V2</Title>
          <PageTitle>— Soal</PageTitle>
        </HeaderLeft>

        <ActionGroup>
          <Button variant="secondary" onClick={() => dispatch(downloadDiagnosticTemplate())}>Unduh Template</Button>
          <input ref={importRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleImportFile} />
          <Button
            variant="secondary"
            disabled={loading.isImportingQuestions}
            onClick={() => importRef.current?.click()}
          >
            {loading.isImportingQuestions ? 'Mengimpor...' : 'Import Excel'}
          </Button>
          <Button variant="primary" onClick={() => setQModal({ open: true, question: null })}>+ Tambah Soal</Button>
        </ActionGroup>
      </Header>

      <SearchRow>
        <TextInput
          placeholder="Cari pertanyaan atau vignette..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="secondary" onClick={handleSearch}>Cari</Button>
      </SearchRow>

      <Table
        columns={columns}
        data={questions}
        loading={loading.isFetchingQuestions}
        emptyText="Belum ada soal"
        emptySubtext='Klik "+ Tambah Soal" untuk memulai.'
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

      {qModal.open && (
        <QuestionFormModal
          nodeId={parentNode?.id}
          question={qModal.question}
          onClose={() => setQModal({ open: false, question: null })}
          onSave={handleQSave}
          isSavingOverride={qModal.question ? loading.isUpdatingQuestion : loading.isAddingQuestion}
        />
      )}

      {moveModal.open && (
        <MoveQuestionModal
          question={moveModal.question}
          onClose={() => setMoveModal({ open: false, question: null })}
          onSuccess={handleMoveSuccess}
          onMove={(targetNodeId, onSuccess) =>
            dispatch(moveLinkedDiagnosticQuestion(moveModal.question.id, targetNodeId, onSuccess))
          }
          isSavingOverride={loading.isMovingQuestion}
        />
      )}

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
