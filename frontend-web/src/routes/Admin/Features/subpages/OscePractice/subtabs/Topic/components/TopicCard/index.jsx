import { useSelector } from 'react-redux'
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
            {new Date(topic.createdAt).toLocaleDateString("id-ID")}
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
            {new Date(topic.updatedAt).toLocaleDateString("id-ID")}
          </StatValue>
        </StatItem>
      </CardStats>

      <CardActions>
        <CardActionButton onClick={() => onEdit(topic)}>
          Edit
        </CardActionButton>
        <CardActionButton
          danger
          onClick={() => onDelete(topic.id)}
          disabled={loading?.isDeletingTopic}
        >
          Delete
        </CardActionButton>
      </CardActions>
    </Card>
  )
}

export default TopicCard
