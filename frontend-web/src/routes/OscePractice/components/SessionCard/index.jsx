import { useNavigate } from 'react-router-dom'
import Button from '@components/common/Button'
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
  TagList,
  Tag,
  StatusBadge,
  InfoRow,
  InfoLabel,
  InfoValue,
  ScoreTimeRow,
  ScoreItem,
} from './SessionCard.styles'

function SessionCard({ session }) {
    const navigate = useNavigate()

  // Format duration in HH:MM:SS
  const formatTimeTaken = (seconds) => {
    if (!seconds && seconds !== 0) return '-'

    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = (seconds % 3600) % 60

    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const onViewSession = (session) => {
    if (session.status == "created") {
        navigate(`/osce-practice/session/${session.uniqueId}/preparation`)
    } else if (session.status == "completed") {
        navigate(`/osce-practice/session/${session.uniqueId}/result`)
    } else {
        navigate(`/osce-practice/session/${session.uniqueId}/practice`)
    }
  }

  const getTextLabel = (session) => {
    const label = {
        created: "Mulai kerjakan",
        expired: "Selesai dan lihat hasil",
        started: "Lanjutkan",
        completed: "Lihat hasil"
    }
    return label[session.status]
  }

  const getStatusText = (status) => {
    const statusText = {
      created: "Belum Dimulai",
      started: "Sedang Berlangsung",
      completed: "Selesai",
      expired: "Kadaluarsa"
    }
    return statusText[status] || status
  }

  const getButtonVariant = (status) => {
    const variants = {
      created: "primary",
      started: "success",
      completed: "secondary",
      expired: "primary"
    }
    return variants[status] || "secondary"
  }
  
  const topicTags = session.tags?.filter(tag => tag.tagGroup?.name === 'topic') || []
  const batchTags = session.tags?.filter(tag => tag.tagGroup?.name === 'batch') || []

  return (
    <Card>
      {/* Title */}
      <TopicTitle>{session.topicTitle || 'Untitled Topic'}</TopicTitle>

      {/* Status Badge */}
      <StatusBadge status={session.status}>
        {getStatusText(session.status)}
      </StatusBadge>

      {topicTags.length > 0 && (
        <InfoRow>
          <InfoLabel>Topik :</InfoLabel>
          <InfoValue>{topicTags.map(tag => tag.name).join(', ')}</InfoValue>
        </InfoRow>
      )}

      {batchTags.length > 0 && (
        <InfoRow>
          <InfoLabel>Batch :</InfoLabel>
          <InfoValue>{batchTags.map(tag => tag.name).join(', ')}</InfoValue>
        </InfoRow>
      )}

      {/* Score and Time Row */}
      {session.timeTaken > 0 && session.totalScore !== null && session.totalScore !== undefined && (
      <ScoreTimeRow>
        {session.totalScore !== null && session.totalScore !== undefined && (
          <ScoreItem>
            ⭐ {session.totalScore}{session.maxScore && ` / ${session.maxScore}`}
          </ScoreItem>
        )}
        {session.timeTaken > 0 && (
          <ScoreItem>
            🕐 {formatTimeTaken(session.timeTaken)}
          </ScoreItem>
        )}
      </ScoreTimeRow>
      )}
      <div style={{flex: 1}}></div>

      {/* Action Button */}
      <CardActions>
        <Button variant={getButtonVariant(session.status)} fullWidth onClick={() => onViewSession(session)}>
          {getTextLabel(session)}
        </Button>
      </CardActions>
    </Card>
  )
}

export default SessionCard
