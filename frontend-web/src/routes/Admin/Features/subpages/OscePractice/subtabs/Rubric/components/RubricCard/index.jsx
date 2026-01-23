import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
  CardActionButton
} from './RubricCard.styles'

function RubricCard({ rubric, onEdit }) {
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{rubric.name}</CardTitle>
      </CardHeader>

      <CardContent>
        {rubric.content || 'Tidak ada konten'}
      </CardContent>

      <div style={{flex: 1}}></div>

      <CardStats>
        <StatItem>
          <StatLabel>Created</StatLabel>
          <StatValue>{formatDate(rubric.createdAt)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Updated</StatLabel>
          <StatValue>{formatDate(rubric.updatedAt)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>ID</StatLabel>
          <StatValue>#{rubric.id}</StatValue>
        </StatItem>
      </CardStats>

      <CardActions>
        <CardActionButton onClick={() => onEdit(rubric)}>
          Edit
        </CardActionButton>
      </CardActions>
    </Card>
  )
}

export default RubricCard
