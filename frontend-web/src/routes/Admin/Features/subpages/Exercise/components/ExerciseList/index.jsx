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
  TopicType,
  TopicDescription,
  TopicStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
  CardActionButton,
  TagList,
  Tag
} from './ExerciseList.styles'

function ExerciseList({ onEdit, onDelete, onCreateFirst }) {
  const { topics, loading } = useSelector((state) => state.exercise)

  // Loading state
  if (loading?.isTopicsLoading) {
    return <LoadingOverlay>Loading exercise topics...</LoadingOverlay>
  }

  // Empty state
  if (!topics || topics.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>📚</EmptyStateIcon>
        <EmptyStateText>Belum Ada Topik</EmptyStateText>
        {onCreateFirst && (
          <ActionButton onClick={onCreateFirst}>
            Buat Topik Pertama
          </ActionButton>
        )}
      </EmptyState>
    )
  }

  // Data state - render topics grid
  return (
    <TopicsGrid>
      {topics.map(topic => {
        // Filter tags by tag_group
        const universityTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'university') || []
        const semesterTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'semester') || []

        return (
          <TopicCard key={topic.id}>
            <TopicCardHeader>
              <TopicCardTitle>{topic.title}</TopicCardTitle>
              <TopicType type={topic.contentType}>
                {topic.contentType === 'text' ? '📝 Text' : '📄 PDF'}
              </TopicType>
            </TopicCardHeader>

            <TopicDescription>
              {topic.description || 'Tidak ada deskripsi'}
            </TopicDescription>

            {/* University Tags */}
            {universityTags.length > 0 && (
              <TagList>
                {universityTags.map((tag) => (
                  <Tag key={tag.id} university>
                    🏛️ {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            {/* Semester Tags */}
            {semesterTags.length > 0 && (
              <TagList>
                {semesterTags.map((tag) => (
                  <Tag key={tag.id} semester>
                    📚 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            <div style={{flex: "1"}}></div>

            <TopicStats>
              <StatItem>
                <StatLabel>Soal</StatLabel>
                <StatValue>{topic.questionCount || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Created</StatLabel>
                <StatValue>
                  {new Date(topic.createdAt).toLocaleDateString("id-ID")}
                </StatValue>
              </StatItem>
            </TopicStats>

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
          </TopicCard>
        )
      })}
    </TopicsGrid>
  )
}

export default ExerciseList
