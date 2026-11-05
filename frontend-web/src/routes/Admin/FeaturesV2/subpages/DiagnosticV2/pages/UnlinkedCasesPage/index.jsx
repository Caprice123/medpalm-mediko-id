import { useDispatch, useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import TextInput from '@components/common/TextInput'
import CaseFormModal from '../../components/CaseFormModal'
import MoveCaseModal from '../../components/MoveCaseModal'
import { updateUnlinkedDiagnosticCase } from '@store/diagnosticNodes/adminAction'
import { useUnlinkedCasesPage } from './hooks/useUnlinkedCasesPage'
import {
  Container, Header, HeaderLeft, PageTitle, ActionGroup, VignetteSnippet, CountBadge,
} from '../../DiagnosticV2.styles'

export default function UnlinkedCasesPage({ onBack }) {
  const dispatch = useDispatch()
  const { cases, pagination, loading } = useSelector(s => s.diagnosticCases)
  const {
    editModal, setEditModal,
    moveModal, setMoveModal,
    search, setSearch,
    handleSearch, handleLoadMore, handleDelete,
    handleEditSuccess, handleMoveSuccess,
  } = useUnlinkedCasesPage()

  const columns = [
    {
      header: 'Kasus',
      render: (c) => (
        <VignetteSnippet>
          {c.vignette ? `${c.vignette.slice(0, 120)}${c.vignette.length > 120 ? '…' : ''}` : 'Tanpa vignette'}
        </VignetteSnippet>
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
          <Button size="small" onClick={() => setEditModal({ open: true, diagnosticCase: c })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(c)}>Hapus</Button>
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
            <PageTitle>Kasus Tidak Tertaut</PageTitle>
          </HeaderLeft>
        </Header>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <TextInput
          placeholder="Cari vignette atau pertanyaan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1 }}
        />
        <Button variant="secondary" onClick={handleSearch}>Cari</Button>
      </div>

      <Table
        columns={columns}
        data={cases}
        loading={loading.isFetchingCases}
        emptyText="Tidak ada kasus tanpa sub-topik"
        emptySubtext="Semua kasus sudah tertaut ke sub-topik."
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

      {editModal.open && (
        <CaseFormModal
          diagnosticCase={editModal.diagnosticCase}
          onClose={() => setEditModal({ open: false, diagnosticCase: null })}
          onSave={(payload) => dispatch(updateUnlinkedDiagnosticCase(editModal.diagnosticCase.id, payload, handleEditSuccess))}
          isSavingOverride={loading.isUpdatingCase}
        />
      )}

      {moveModal.open && (
        <MoveCaseModal
          diagnosticCase={moveModal.diagnosticCase}
          onClose={() => setMoveModal({ open: false, diagnosticCase: null })}
          onSuccess={handleMoveSuccess}
          isSavingOverride={loading.isMovingCase}
        />
      )}
    </Container>
  )
}
