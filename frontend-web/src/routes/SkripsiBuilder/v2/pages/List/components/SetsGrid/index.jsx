import { useSelector } from 'react-redux'
import { generatePath, useNavigate } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import { SkripsiSetSkeletonGrid } from '@components/common/SkeletonCard'
import { formatJakartaDateLong } from '@utils/dateUtils'
import { PblBuilderRoute } from '../../../../../routes'
import { Grid, SetDescription, UpdatedText, CardActions } from './SetsGrid.styles'

const SetsGrid = ({ onDelete }) => {
  const navigate = useNavigate()
  const sets = useSelector(state => state.skripsiV2.sets)
  const search = useSelector(state => state.skripsiV2.filters.search)
  const isBootstrapping = useSelector(state => state.skripsiV2.loading.isBootstrapping)
  const isFetching = useSelector(state => state.skripsiV2.loading.isFetchingSets)

  // Only the first load gets the skeleton; later pages keep the cards on
  // screen and show their spinner under the grid instead.
  if ((isBootstrapping || isFetching) && sets.length === 0) {
    return <SkripsiSetSkeletonGrid count={6} />
  }

  if (sets.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title={search ? `Tidak ada set yang cocok dengan "${search}"` : 'Belum ada set skripsi'}
      />
    )
  }

  return (
    <Grid>
      {sets.map((set) => (
        <Card key={set.uniqueId} shadow hoverable>
          <CardHeader title={set.title} divider={false} />

          <CardBody padding="0 1.25rem 1.25rem 1.25rem">
            <SetDescription>
              {set.description || 'Tidak ada deskripsi'}
            </SetDescription>

            <UpdatedText>
              Terakhir diperbarui: {formatJakartaDateLong(set.updatedAt)}
            </UpdatedText>

            <CardActions>
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(generatePath(PblBuilderRoute.editorRoute, { setId: set.uniqueId }))}
              >
                Buka Set
              </Button>
              <Button variant="danger" onClick={() => onDelete(set)} title="Hapus set">
                <FaTrash />
              </Button>
            </CardActions>
          </CardBody>
        </Card>
      ))}
    </Grid>
  )
}

export default SetsGrid
