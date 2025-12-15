import { useSelector } from 'react-redux'
import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  ActionButton,
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
  CardActionButton,
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
      <EmptyState>
        <EmptyStateIcon>📝</EmptyStateIcon>
        <EmptyStateText>No MCQ topics found</EmptyStateText>
        {onCreateFirst && (
          <ActionButton onClick={onCreateFirst}>
            Create Your First Topic
          </ActionButton>
        )}
      </EmptyState>
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

          <div style={{flex: "1"}}></div>

          <TopicStats>
            <StatItem>
              <StatLabel>Questions</StatLabel>
              <StatValue>{topic.question_count || 0}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Time Limit</StatLabel>
              <StatValue>
                {topic.quiz_time_limit ? `${topic.quiz_time_limit}m` : 'No limit'}
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Pass Score</StatLabel>
              <StatValue>{topic.passing_score}%</StatValue>
            </StatItem>
          </TopicStats>

          <CardActions>
            <CardActionButton onClick={() => onEdit(topic)}>
              Edit
            </CardActionButton>
            <CardActionButton
              danger
              onClick={() => onDelete(topic)}
              disabled={loading?.isDeletingTopic}
            >
              Delete
            </CardActionButton>
          </CardActions>
        </TopicCard>
      ))}
    </TopicsGrid>
  )
}

export default TopicList
