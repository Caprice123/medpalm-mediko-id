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
  ModelBadge,
  CardActions,
  ActionButton,
} from './SessionCard.styles'

function SessionCard({ session, onView, onRetry }) {
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
        <StatItem>
          <StatLabel>AI Model</StatLabel>
          <StatValue>
            <ModelBadge>{session.aiModelUsed || 'N/A'}</ModelBadge>
          </StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Credit Used</StatLabel>
          <StatValue>{session.creditsUsed || 0}</StatValue>
        </StatItem>
      </StatsRow>

      {session.aiFeedback && (
        <TopicDescription>
          <strong>Feedback:</strong> {session.aiFeedback}
        </TopicDescription>
      )}

      <CardActions>
        <ActionButton onClick={() => onView && onView(session)}>
          Lihat Detail
        </ActionButton>
        <ActionButton primary onClick={() => onRetry && onRetry(session)}>
          Ulangi Latihan
        </ActionButton>
      </CardActions>
    </Card>
  )
}

export default SessionCard
