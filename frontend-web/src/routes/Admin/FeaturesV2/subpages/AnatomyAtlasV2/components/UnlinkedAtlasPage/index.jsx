import { useDispatch, useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Table from '@components/common/Table'
import Pagination from '@components/common/Pagination'
import TextInput from '@components/common/TextInput'
import AtlasCreateModal from '../ModuleDetailPage/components/AtlasCreateModal'
import MoveContentModal from '../ModuleDetailPage/components/MoveContentModal'
import { assignAtlasToNode } from '@store/unlinkedAtlas/adminAction'
import { useUnlinkedAtlasPage } from './hooks/useUnlinkedAtlasPage'
import { Container, Header, HeaderLeft, PageTitle, ActionGroup } from '../../AnatomyAtlasV2.styles'
import { Description } from '../ModuleDetailPage/ModuleDetailPage.styles'

export default function UnlinkedAtlasPage({ onBack }) {
  const dispatch = useDispatch()
  const { models, pagination, loading } = useSelector(state => state.unlinkedAtlas)
  const totalPages = pagination.isLastPage ? pagination.page : pagination.page + 1

  const {
    editModal, setEditModal,
    assignModal, setAssignModal,
    search, setSearch,
    handleSearch, handlePageChange, handleDelete,
    handleEditSuccess, handleAssignSuccess,
  } = useUnlinkedAtlasPage()

  const columns = [
    {
      header: 'Judul',
      render: (m) => <span style={{ fontWeight: 600, color: '#111827' }}>{m.title}</span>,
    },
    {
      header: 'Deskripsi',
      render: (m) => <Description>{m.description || '—'}</Description>,
    },
    {
      header: 'Versi',
      width: '70px',
      render: (m) => `v${m.version ?? 1}`,
    },
    {
      header: 'Aksi',
      width: '220px',
      align: 'right',
      render: (m) => (
        <ActionGroup>
          <Button size="small" variant="secondary" onClick={() => setAssignModal({ open: true, model: m })}>Pindah</Button>
          <Button size="small" onClick={() => setEditModal({ open: true, model: m })}>Edit</Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(m)}>Hapus</Button>
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
            <PageTitle>Atlas 3D Tidak Terhubung</PageTitle>
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
        data={models}
        loading={loading.isFetchingModels}
        emptyText="Tidak ada Atlas 3D tanpa modul"
        emptySubtext="Semua Atlas 3D sudah terhubung ke modul."
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={totalPages}
        totalItems={pagination.isLastPage ? (pagination.page - 1) * pagination.perPage + models.length : undefined}
        itemsPerPage={pagination.perPage}
        onPageChange={handlePageChange}
      />

      {editModal.open && (
        <AtlasCreateModal
          atlas={editModal.model}
          onSuccess={handleEditSuccess}
          onClose={() => setEditModal({ open: false, model: null })}
        />
      )}

      {assignModal.open && (
        <MoveContentModal
          title="Pindah ke Modul"
          nodeTypeFilter="module"
          onMove={(targetNodeId, onSuccess) =>
            dispatch(assignAtlasToNode(assignModal.model.uniqueId, targetNodeId, onSuccess))
          }
          onSuccess={handleAssignSuccess}
          onClose={() => setAssignModal({ open: false, model: null })}
          isSaving={loading.isAssigningModel}
        />
      )}
    </Container>
  )
}
