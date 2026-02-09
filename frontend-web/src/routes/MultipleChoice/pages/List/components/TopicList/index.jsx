import { useSelector } from 'react-redux'
import { generatePath, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import { LearningContentSkeletonGrid } from '@components/common/SkeletonCard'
import { MultipleChoiceRoute } from '../../../../routes'
import {
  TopicsGrid,
  TopicDescription,
  TopicStats,
  StatItem,
  StatLabel,
  StatValue,
  TagList,
  Tag,
  ModeButtonContainer
} from './TopicList.styles'

function TopicList() {
  const { topics, loading } = useSelector((state) => state.mcq)
  const navigate = useNavigate()

  const handleSelectMode = (topicId, mode) => {
    navigate(`${generatePath(MultipleChoiceRoute.detailRoute, { id: topicId })}?mode=${mode}`)
  }

  // Loading state
  if (loading?.isTopicsLoading) {
    return <LearningContentSkeletonGrid count={6} hasTwoButtons={true} statsCount={3} />
  }

  // Empty state
  if (topics.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="Tidak ada topik ditemukan"
      />
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
          <Card key={topic.id} shadow hoverable>
            <CardHeader title={topic.title} divider={false} />

            <CardBody padding="0 1.25rem 1.25rem 1.25rem">
              <TopicDescription>
                {topic.description || 'Tidak ada deskripsi'}
              </TopicDescription>
              
              <div style={{ flex: 1 }}></div>

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


              <TopicStats>
                <StatItem>
                  <StatLabel>Soal</StatLabel>
                  <StatValue>{topic.questionCount || 0}</StatValue>
                </StatItem>
                {topic.quizTimeLimit > 0 && (
                  <StatItem>
                    <StatLabel>Waktu</StatLabel>
                    <StatValue>{topic.quizTimeLimit} menit</StatValue>
                  </StatItem>
                )}
                <StatItem>
                  <StatLabel>Passing</StatLabel>
                  <StatValue>{topic.passingScore}%</StatValue>
                </StatItem>
              </TopicStats>

              <ModeButtonContainer>
                <Button variant="secondary" onClick={() => handleSelectMode(topic.uniqueId, 'learning')} style={{ flex: 1 }}>
                  📖 Learning
                </Button>
                <Button variant="primary" onClick={() => handleSelectMode(topic.uniqueId, 'quiz')} style={{ flex: 1 }}>
                  ⏱️ Quiz
                </Button>
              </ModeButtonContainer>
            </CardBody>
          </Card>
        )
      })}
    </TopicsGrid>
  )
}

export default TopicList
