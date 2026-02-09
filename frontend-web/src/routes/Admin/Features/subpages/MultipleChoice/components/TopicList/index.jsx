import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import {
  LoadingOverlay,
  TopicsGrid,
  TopicCard,
  TopicCardHeader,
  TopicCardTitle,
  StatusBadge,
  TopicDescription,
  TopicStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
  TagList,
  Tag
} from './TopicList.styles'

function TopicList({ onEdit, onDelete, onCreateFirst }) {
  const { topics, loading } = useSelector((state) => state.mcq)

  // Loading state
  if (loading?.isTopicsLoading) {
    return <LoadingOverlay>Loading topics...</LoadingOverlay>
  }

  // Empty state
  if (topics.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="No MCQ topics found"
        actionLabel={onCreateFirst && "Create Your First Topic"}
        onAction={onCreateFirst}
        actionVariant="primary"
      />
    )
  }

  // Data state - render topic grid
  return (
    <TopicsGrid>
      {topics.map(topic => (
        <TopicCard key={topic.id}>
          <TopicCardHeader>
            <TopicCardTitle>{topic.title}</TopicCardTitle>
            <StatusBadge published={topic.status === 'published'}>
              {topic.status === 'published' ? 'Published' : 'Draft'}
            </StatusBadge>
          </TopicCardHeader>

          <TopicDescription>
            {topic.description || 'Tidak ada deskripsi'}
          </TopicDescription>

          <div style={{flex: "1"}}></div>

          {/* University Tags */}
          {topic.universityTags && topic.universityTags.length > 0 && (
            <TagList>
              {topic.universityTags.map((tag) => (
                <Tag key={tag.id} university>
                  🏛️ {tag.name}
                </Tag>
              ))}
            </TagList>
          )}

          {/* Semester Tags */}
          {topic.semesterTags && topic.semesterTags.length > 0 && (
            <TagList>
              {topic.semesterTags.map((tag) => (
                <Tag key={tag.id} semester>
                  📚 {tag.name}
                </Tag>
              ))}
            </TagList>
          )}

          <TopicStats>
            <StatItem>
              <StatLabel>Questions</StatLabel>
              <StatValue>{topic.questionCount || 0}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Time Limit</StatLabel>
              <StatValue>
                {topic.quizTimeLimit ? `${topic.quizTimeLimit}m` : 'No limit'}
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Pass Score</StatLabel>
              <StatValue>{topic.passingScore}%</StatValue>
            </StatItem>
          </TopicStats>

          <CardActions>
            <Button variant="secondary" fullWidth onClick={() => onEdit(topic)}>
              Edit
            </Button>
            {/* <Button
              variant="danger"
              fullWidth
              onClick={() => onDelete(topic)}
              disabled={loading?.isDeletingTopic}
            >
              Delete
            </Button> */}
          </CardActions>
        </TopicCard>
      ))}
    </TopicsGrid>
  )
}

export default TopicList
