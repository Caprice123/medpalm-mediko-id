import { useSelector } from 'react-redux'
import RubricCard from '../RubricCard'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import { Container, Grid, LoadingContainer } from './RubricsList.styles'

function RubricsList({ onEdit, onCreateFirst }) {
  const { rubrics, loading } = useSelector(state => state.oscePractice)

  if (loading.isGetListRubricsLoading) {
    return (
      <Container>
        <LoadingContainer>
          <div>Loading rubrics...</div>
        </LoadingContainer>
      </Container>
    )
  }

  if (!rubrics || rubrics.length === 0) {
    return (
      <Container>
        <EmptyState
          icon="📋"
          title="Belum ada rubrik"
          description="Mulai dengan membuat rubrik evaluasi OSCE pertama Anda"
          actionLabel="Buat Rubrik Pertama"
          onAction={onCreateFirst}
          actionVariant="primary"
        />
      </Container>
    )
  }

  return (
    <Container>
      <Grid>
        {rubrics.map((rubric) => (
          <RubricCard
            key={rubric.id}
            rubric={rubric}
            onEdit={onEdit}
          />
        ))}
      </Grid>
    </Container>
  )
}

export default RubricsList
