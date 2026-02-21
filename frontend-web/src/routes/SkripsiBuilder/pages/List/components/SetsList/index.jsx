import { useState } from 'react'
import { useSelector } from 'react-redux'
import { formatLocalDateLong } from '@utils/dateUtils'
import { useNavigate } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import EmptyState from '@components/common/EmptyState'
import { SkripsiSetSkeletonGrid } from '@components/common/SkeletonCard'
import { useAppDispatch } from '@store/store'
import { deleteSet } from '@store/skripsi/userAction'
import {
  LoadingOverlay,
  SetsGrid,
  SetDescription,
  CardActions,
  UpdatedText
} from './SetsList.styles'
import { fetchSets } from '../../../../../../store/skripsi/userAction'

function SetsList() {
  const { sets, loading } = useSelector((state) => state.skripsi)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [deleteId, setDeleteId] = useState(null)

  const handleDeleteSet = async (id) => {
      await dispatch(deleteSet(id, () => setDeleteId(null)))
      dispatch(fetchSets())
  }

  // Loading state
  if (loading?.isSetsLoading) {
    return <SkripsiSetSkeletonGrid count={6} />
  }

  // Empty state
  if (sets.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="Tidak ada set skripsi ditemukan"
      />
    )
  }

  // Data state - render sets grid
  return (
    <>
      <SetsGrid>
        {sets.map(set => (
          <Card key={set.uniqueId} shadow hoverable>
            <CardHeader title={set.title} divider={false} />

            <CardBody padding="0 1.25rem 1.25rem 1.25rem">
              <SetDescription>
                {set.description || 'Tidak ada deskripsi'}
              </SetDescription>

              <UpdatedText>
                Terakhir diperbarui: {formatLocalDateLong(set.updatedAt)}
              </UpdatedText>

              <CardActions>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate(`/sets/${set.uniqueId}`)}
                >
                  Buka Set
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setDeleteId(set.uniqueId)}
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
