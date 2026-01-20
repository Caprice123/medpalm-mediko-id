import { useSelector } from 'react-redux'
import RubricCard from '../RubricCard'
import Button from '@components/common/Button'
import { Container, Grid, LoadingContainer, EmptyState } from './RubricsList.styles'

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
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
          <h3>Belum ada rubrik</h3>
          <p>Mulai dengan membuat rubrik evaluasi OSCE pertama Anda</p>
          <Button variant="primary" onClick={onCreateFirst}>
            Buat Rubrik Pertama
          </Button>
        </EmptyState>
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
