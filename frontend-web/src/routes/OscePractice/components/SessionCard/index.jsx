import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardHeader,
  TopicInfo,
  TopicTitle,
  TopicDescription,
  DateBadge,
  StatsRow,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
  ActionButton,
} from './SessionCard.styles'

function SessionCard({ session }) {
    const navigate = useNavigate()

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return '-'
    return `${minutes} menit`
  }

  const onViewSession = () => {
    navigate(`/osce-practice/session/${session.uniqueId}/result`)
  }

  return (
    <Card>
      <CardHeader>
        <TopicInfo>
          <TopicTitle>{session.topicTitle || 'Untitled Topic'}</TopicTitle>
          {session.topicDescription && (
            <TopicDescription>{session.topicDescription}</TopicDescription>
          )}
        </TopicInfo>
        <DateBadge>{formatDate(session.createdAt)}</DateBadge>
      </CardHeader>

      <StatsRow>
        <StatItem>
          <StatLabel>Durasi</StatLabel>
          <StatValue>{formatDuration(session.durationMinutes)}</StatValue>
        </StatItem>
        {session.totalScore !== null && session.totalScore !== undefined && (
          <StatItem>
            <StatLabel>Skor</StatLabel>
            <StatValue>
              {session.totalScore}
              {session.maxScore && ` / ${session.maxScore}`}
            </StatValue>
          </StatItem>
        )}
      </StatsRow>

      <CardActions>
        <ActionButton onClick={() => onViewSession(session)}>
          Lihat Detail
        </ActionButton>
      </CardActions>
    </Card>
  )
}

export default SessionCard
