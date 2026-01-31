import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import { SkripsiSetSkeletonGrid } from '@components/common/SkeletonCard'
import { useAppDispatch } from '@store/store'
import { deleteSet } from '@store/skripsi/action'
import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  SetsGrid,
  SetDescription,
  CardActions,
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
    return <SkripsiSetSkeletonGrid count={6} />
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
          <Card key={set.id} shadow hoverable>
            <CardHeader title={set.title} divider={false} />

            <CardBody padding="0 1.25rem 1.25rem 1.25rem">
              <SetDescription>
                {set.description || 'Tidak ada deskripsi'}
              </SetDescription>

              <UpdatedText>
                Terakhir diperbarui: {formatDate(set.updatedAt)}
              </UpdatedText>

              <CardActions>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate(`/sets/${set.id}`)}
                >
                  Buka Set
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setDeleteId(set.id)}
                >
                  <FaTrash />
                </Button>
              </CardActions>
            </CardBody>
          </Card>
        ))}
      </SetsGrid>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus Set"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteId(null)}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeleteSet(deleteId)}
            >
              Hapus
            </Button>
          </>
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
