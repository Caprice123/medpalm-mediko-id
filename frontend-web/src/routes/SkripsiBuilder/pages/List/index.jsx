import { FaPlus } from 'react-icons/fa'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { Filter } from './components/Filter'
import SetsList from './components/SetsList'
import Pagination from '@components/Pagination'
import {
  Container,
  ContentWrapper,
  Header,
} from './List.styles'
import { useSkripsiList } from './hooks/useSkripsiList'

const SkripsiList = () => {
  const {
    sets,
    loading,
    pagination,
    hasMorePages,
    showCreateModal,
    formData,
    setFormData,
    handlePageChange,
    handleCreateSet,
    handleOpenCreateModal,
    handleCloseCreateModal,
  } = useSkripsiList()

  return (
    <Container>
      <ContentWrapper>

        <Filter />
        <Header>
          <div></div>
          <Button variant="primary" onClick={handleOpenCreateModal}>
            <FaPlus /> Buat Set Baru
          </Button>
        </Header>

        <SetsList />

        {!loading.isSetsLoading && sets.length > 0 && hasMorePages && (
          <Pagination
            currentPage={pagination.page}
            isLastPage={pagination.isLastPage}
            onPageChange={handlePageChange}
            isLoading={loading.isSetsLoading}
            variant="admin"
            language="id"
          />
        )}
      </ContentWrapper>

      {/* Create Set Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        title="Buat Set Baru"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseCreateModal}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleCreateSet}>
              Buat Set
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1f2937' }}>
              Judul Set <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Masukkan judul set skripsi"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1f2937' }}>
              Deskripsi (Opsional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tambahkan deskripsi singkat"
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border 0.2s',
                resize: 'vertical'
              }}
              onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
        </div>
      </Modal>
    </Container>
  )
}

export default SkripsiList
