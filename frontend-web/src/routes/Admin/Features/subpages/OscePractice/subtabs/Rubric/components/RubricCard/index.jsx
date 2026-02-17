import { formatLocalDateLong } from '@utils/dateUtils'
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
} from './RubricCard.styles'
import Button from '@components/common/Button'

function RubricCard({ rubric, onEdit }) {
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
          <StatValue>{formatLocalDateLong(rubric.createdAt)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Updated</StatLabel>
          <StatValue>{formatLocalDateLong(rubric.updatedAt)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>ID</StatLabel>
          <StatValue>#{rubric.id}</StatValue>
        </StatItem>
      </CardStats>

      <CardActions>
        <Button onClick={() => onEdit(rubric)}>
          Edit
        </Button>
      </CardActions>
    </Card>
  )
}

export default RubricCard
