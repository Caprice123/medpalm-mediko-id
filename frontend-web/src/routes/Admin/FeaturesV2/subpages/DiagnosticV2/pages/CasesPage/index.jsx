import { useDispatch } from 'react-redux'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import Modal from '@components/common/Modal'
import Breadcrumb from '@components/common/Breadcrumb'
import CaseFormModal from '../../components/CaseFormModal'
import MoveCaseModal from '../../components/MoveCaseModal'
import { downloadDiagnosticTemplate, moveLinkedDiagnosticCase } from '@store/diagnosticNodes/adminAction'
import { useCasesPage } from './hooks/useCasesPage'
import {
  Container, Header, HeaderLeft, Title, PageTitle, ActionGroup, SearchRow,
  VignetteSnippet, QuestionPreviewList, QuestionPreviewRow, QuestionPreviewIndex, TypeBadge, CountBadge,
} from '../../DiagnosticV2.styles'

const PREVIEW_LIMIT = 2

export default function CasesPage({ path, parentNode, onBack, onNavigateRoot, onNavigateTo }) {
  const dispatch = useDispatch()
  const {
    cases, pagination, loading,
    search, setSearch, handleSearch,
    caseModal, setCaseModal, handleCaseSave,
    moveModal, setMoveModal, handleMoveSuccess,
    importResult, setImportResult, importRef, handleImportFile,
    handleDelete, handleLoadMore,
  } = useCasesPage(parentNode)

  const columns = [
    {
      header: 'Kasus',
      render: (c) => (
        <div>
          <VignetteSnippet>
            {c.vignette ? `${c.vignette.slice(0, 120)}${c.vignette.length > 120 ? '…' : ''}` : 'Tanpa vignette'}
          </VignetteSnippet>
          <QuestionPreviewList>
            {c.questions.slice(0, PREVIEW_LIMIT).map((q, i) => (
              <QuestionPreviewRow key={q.id}>
                <QuestionPreviewIndex>{i + 1}.</QuestionPreviewIndex>
                <span>{q.question}</span>
                <TypeBadge $text={q.answerType === 'text'}>
                  {q.answerType === 'text' ? 'Isian Teks' : 'Pilihan Ganda'}
                </TypeBadge>
              </QuestionPreviewRow>
            ))}
            {c.questionCount > PREVIEW_LIMIT && (
              <QuestionPreviewRow>
                <QuestionPreviewIndex>+</QuestionPreviewIndex>
                <span>{c.questionCount - PREVIEW_LIMIT} soal lainnya</span>
              </QuestionPreviewRow>
            )}
          </QuestionPreviewList>
        </div>
      ),
    },
    {
      header: 'Jumlah Soal',
      render: (c) => <CountBadge>{c.questionCount} soal</CountBadge>,
    },
    {
      header: 'Aksi',
      align: 'right',
      render: (c) => (
        <ActionGroup>
          <Button size="small" variant="secondary" onClick={() => setMoveModal({ open: true, diagnosticCase: c })}>Pindah</Button>
          <Button size="small" onClick={() => setCaseModal({ open: true, diagnosticCase: c })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(c)}>Hapus</Button>
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
          <PageTitle>— Kasus</PageTitle>
        </HeaderLeft>

        <ActionGroup>
          <Button variant="secondary" onClick={() => dispatch(downloadDiagnosticTemplate())}>Unduh Template</Button>
          <input ref={importRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleImportFile} />
          <Button
            variant="secondary"
            disabled={loading.isImportingCases}
            onClick={() => importRef.current?.click()}
          >
            {loading.isImportingCases ? 'Mengimpor...' : 'Import Excel'}
          </Button>
          <Button variant="primary" onClick={() => setCaseModal({ open: true, diagnosticCase: null })}>+ Tambah Kasus</Button>
        </ActionGroup>
      </Header>

      <SearchRow>
        <TextInput
          placeholder="Cari vignette atau pertanyaan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="secondary" onClick={handleSearch}>Cari</Button>
      </SearchRow>

      <Table
        columns={columns}
        data={cases}
        loading={loading.isFetchingCases}
        emptyText="Belum ada kasus"
        emptySubtext='Klik "+ Tambah Kasus" untuk memulai.'
      />

      {!pagination.isLastPage && (
        <Button
          variant="secondary"
          onClick={handleLoadMore}
          disabled={loading.isFetchingCases}
          style={{ margin: '0 auto' }}
        >
          {loading.isFetchingCases ? 'Memuat...' : 'Muat Lebih Banyak'}
        </Button>
      )}

      {caseModal.open && (
        <CaseFormModal
          nodeId={parentNode?.id}
          diagnosticCase={caseModal.diagnosticCase}
          onClose={() => setCaseModal({ open: false, diagnosticCase: null })}
          onSave={handleCaseSave}
          isSavingOverride={caseModal.diagnosticCase ? loading.isUpdatingCase : loading.isAddingCase}
        />
      )}

      {moveModal.open && (
        <MoveCaseModal
          diagnosticCase={moveModal.diagnosticCase}
          onClose={() => setMoveModal({ open: false, diagnosticCase: null })}
          onSuccess={handleMoveSuccess}
          onMove={(targetNodeId, onSuccess) =>
            dispatch(moveLinkedDiagnosticCase(moveModal.diagnosticCase.id, targetNodeId, onSuccess))
          }
          isSavingOverride={loading.isMovingCase}
        />
      )}

      {importResult && (
        <Modal title="Hasil Import" onClose={() => setImportResult(null)}>
          <p style={{ marginBottom: 8 }}>Berhasil diimpor: <strong>{importResult.imported}</strong> kasus</p>
          {importResult.errors?.length > 0 && (
            <>
              <p style={{ marginBottom: 4, color: 'var(--color-danger)' }}>Gagal ({importResult.errors.length}):</p>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {importResult.errors.map((e, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'var(--color-danger)' }}>
                    {e.row ? `Baris ${e.row}: ` : ''}{e.message}
                  </li>
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
