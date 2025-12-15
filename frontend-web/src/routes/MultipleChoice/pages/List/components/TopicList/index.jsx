import { useSelector } from 'react-redux'
import { generatePath, useNavigate } from 'react-router-dom'
import { MultipleChoiceRoute } from '../../../../routes'
import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  TopicsGrid,
  TopicCard,
  TopicCardHeader,
  TopicCardTitle,
  TopicDescription,
  TopicStats,
  StatItem,
  StatLabel,
  StatValue,
  TagList,
  Tag,
  ModeButtonContainer,
  ModeButton
} from './TopicList.styles'

function TopicList({ topics }) {
  const { loading } = useSelector((state) => state.mcq)
  const navigate = useNavigate()

  const handleSelectMode = (topicId, mode) => {
    navigate(`${generatePath(MultipleChoiceRoute.detailRoute, { id: topicId })}?mode=${mode}`)
  }

  // Loading state
  if (loading?.isTopicsLoading) {
    return <LoadingOverlay>Memuat topik...</LoadingOverlay>
  }

  // Empty state
  if (topics.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>📝</EmptyStateIcon>
        <EmptyStateText>Tidak ada topik ditemukan</EmptyStateText>
      </EmptyState>
    )
  }

  // Data state - render topic grid
  return (
    <TopicsGrid>
      {topics.map(topic => {
        // Get tag groups
        const universityTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'university') || []
        const semesterTags = topic.tags?.filter(tag => tag.tagGroup?.name === 'semester') || []

        return (
          <TopicCard key={topic.id}>
            <TopicCardHeader>
              <TopicCardTitle>{topic.title}</TopicCardTitle>
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

            <div style={{ flex: '1' }}></div>
            <TopicStats>
              <StatItem>
                <StatLabel>Soal</StatLabel>
                <StatValue>{topic.question_count || 0}</StatValue>
              </StatItem>
              {topic.quiz_time_limit > 0 && (
                <StatItem>
                  <StatLabel>Waktu</StatLabel>
                  <StatValue>{topic.quiz_time_limit} menit</StatValue>
                </StatItem>
              )}
              <StatItem>
                <StatLabel>Passing</StatLabel>
                <StatValue>{topic.passing_score}%</StatValue>
              </StatItem>
            </TopicStats>

            <ModeButtonContainer>
              <ModeButton mode="learning" onClick={() => handleSelectMode(topic.id, 'learning')}>
                📖 Learning
              </ModeButton>
              <ModeButton mode="quiz" onClick={() => handleSelectMode(topic.id, 'quiz')}>
                ⏱️ Quiz
              </ModeButton>
            </ModeButtonContainer>
          </TopicCard>
        )
      })}
    </TopicsGrid>
  )
}

export default TopicList
