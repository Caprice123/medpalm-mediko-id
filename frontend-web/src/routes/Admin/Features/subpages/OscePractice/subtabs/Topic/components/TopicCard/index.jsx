import { useSelector } from 'react-redux'
import { formatLocalDate } from '@utils/dateUtils'
import {
  Card,
  CardHeader,
  CardTitle,
  StatusBadge,
  CardDescription,
  InfoSection,
  InfoRow,
  InfoLabel,
  InfoValue,
  ModelBadge,
  TagList,
  Tag,
  CardStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
  CardActionButton
} from './TopicCard.styles'
import Button from '@components/common/Button'

function TopicCard({ topic, onEdit, onDelete }) {
  const { loading } = useSelector((state) => state.oscePractice)

  // Filter tags by tag_group
  const topicTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'topic') || []
  const batchTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'batch') || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>{topic.title}</CardTitle>
        <StatusBadge published={topic.status === 'published'}>
          {topic.status === 'published' ? 'Published' : 'Draft'}
        </StatusBadge>
      </CardHeader>

      <CardDescription>
        {topic.description || 'Tidak ada deskripsi'}
      </CardDescription>


      <div style={{ flex: "1" }}></div>

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


      <CardStats>
        <StatItem>
          <StatLabel>Created</StatLabel>
          <StatValue>
            {formatLocalDate(topic.createdAt)}
          </StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Durasi</StatLabel>
          <StatValue>
            {topic.durationMinutes} minutes
          </StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Updated</StatLabel>
          <StatValue>
            {formatLocalDate(topic.updatedAt)}
          </StatValue>
        </StatItem>
      </CardStats>

      <CardActions>
        <Button variant="secondary" fullWidth onClick={() => onEdit(topic)}>
          Edit
        </Button>
        <Button
          variant="danger"
          fullWidth
          onClick={() => onDelete(topic.id)}
          disabled={loading?.isDeletingTopic}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  )
}

export default TopicCard
