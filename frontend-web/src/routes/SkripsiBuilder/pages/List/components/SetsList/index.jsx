import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import Modal from '@components/common/Modal'
import { useAppDispatch } from '@store/store'
import { deleteSet } from '@store/skripsi/action'
import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  SetsGrid,
  SetCard,
  SetCardHeader,
  SetCardTitle,
  SetDescription,
  CardActions,
  CardActionButton,
  DeleteButton,
  UpdatedText
} from './SetsList.styles'

function SetsList() {
  const { sets, loading } = useSelector((state) => state.skripsi)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [deleteId, setDeleteId] = useState(null)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleDeleteSet = async (id) => {
    try {
      await dispatch(deleteSet(id))
      setDeleteId(null)
    } catch (error) {
      console.error('Failed to delete set:', error)
      alert('Gagal menghapus set')
    }
  }

  // Loading state
  if (loading?.isSetsLoading) {
    return <LoadingOverlay>Memuat data...</LoadingOverlay>
  }

  // Empty state
  if (sets.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>📝</EmptyStateIcon>
        <EmptyStateText>Tidak ada set skripsi ditemukan</EmptyStateText>
      </EmptyState>
    )
  }

  // Data state - render sets grid
  return (
    <>
      <SetsGrid>
        {sets.map(set => (
          <SetCard key={set.id}>
            <SetCardHeader>
              <SetCardTitle>{set.title}</SetCardTitle>
            </SetCardHeader>

            <SetDescription>
              {set.description || 'Tidak ada deskripsi'}
            </SetDescription>

            <UpdatedText>
              Terakhir diperbarui: {formatDate(set.updated_at)}
            </UpdatedText>

            <div style={{flex: "1"}}></div>

            <CardActions>
              <CardActionButton onClick={() => navigate(`/skripsi/sets/${set.id}`)}>
                Buka Set
              </CardActionButton>
              <DeleteButton onClick={() => setDeleteId(set.id)}>
                <FaTrash />
              </DeleteButton>
            </CardActions>
          </SetCard>
        ))}
      </SetsGrid>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus Set"
        footer={
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setDeleteId(null)}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                background: 'white',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
            <button
              onClick={() => handleDeleteSet(deleteId)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                background: '#ef4444',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Hapus
            </button>
          </div>
        }
      >
        <p style={{ margin: 0, color: '#6b7280' }}>
          Apakah Anda yakin ingin menghapus set ini? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </>
  )
}

export default SetsList
