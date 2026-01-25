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

  const getStatusIcon = (status) => {
    const icons = {
      created: "⏳",
      started: "▶️",
      completed: "✓",
      expired: "⏰"
    }
    return icons[status] || "•"
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
      <CardHeader>
        <TopicInfo>
          <TopicTitle>{session.topicTitle || 'Untitled Topic'}</TopicTitle>
          {session.topicDescription && (
            <TopicDescription>{session.topicDescription}</TopicDescription>
          )}
        </TopicInfo>
        <DateBadge>{formatDate(session.createdAt)}</DateBadge>
      </CardHeader>

      <div style={{flex: 1}}></div>

      {/* University Tags */}
      {topicTags.length > 0 && (
        <TagList>
          {topicTags.map((tag) => (
            <Tag key={tag.id} university>
              🏛️ {tag.name}
            </Tag>
          ))}
        </TagList>
      )}

      {/* Semester Tags */}
      {batchTags.length > 0 && (
        <TagList>
          {batchTags.map((tag) => (
            <Tag key={tag.id} semester>
              📚 {tag.name}
            </Tag>
          ))}
        </TagList>
      )}

      <StatsRow>
        <StatItem>
          <StatLabel>Status</StatLabel>
          <StatusBadge status={session.status}>
            {getStatusIcon(session.status)} {getStatusText(session.status)}
          </StatusBadge>
        </StatItem>
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
        <Button variant={getButtonVariant(session.status)} fullWidth onClick={() => onViewSession(session)}>
          {getTextLabel(session)}
        </Button>
      </CardActions>
    </Card>
  )
}

export default SessionCard
