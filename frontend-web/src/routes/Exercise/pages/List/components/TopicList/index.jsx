import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import { ExerciseRoute } from '../../../../routes'
import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  TopicGrid,
  TopicDescription,
  TagList,
  Tag,
  TopicStats,
  StatItem,
  StatLabel,
  StatValue
} from './TopicList.styles'

function TopicList() {
  const { topics, loading } = useSelector(state => state.exercise)
  const { tags } = useSelector(state => state.tags)
  const navigate = useNavigate()

  // Get tag group IDs
  const universityGroupId = useMemo(() => {
    return tags?.find(tag => tag.name === 'university')?.id
  }, [tags])

  const semesterGroupId = useMemo(() => {
    return tags?.find(tag => tag.name === 'semester')?.id
  }, [tags])

  // Loading state
  if (loading.isTopicsLoading) {
    return <LoadingOverlay>Memuat topik latihan...</LoadingOverlay>
  }

  // Empty state
  if (topics.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>📝</EmptyStateIcon>
        <EmptyStateText>Tidak ada topik latihan ditemukan</EmptyStateText>
      </EmptyState>
    )
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  // Data state - render topic grid
  return (
    <TopicGrid>
      {topics.map((topic) => {
        // Get tag groups using tagGroupId
        const universityTags = topic.tags?.filter(tag => tag.tagGroupId === universityGroupId) || []
        const semesterTags = topic.tags?.filter(tag => tag.tagGroupId === semesterGroupId) || []

        return (
          <Card key={topic.id} shadow hoverable>
            <CardHeader title={topic.title} divider={false} />

            <CardBody padding="0 1.25rem 1.25rem 1.25rem">
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

              <TopicStats>
                <StatItem>
                  <StatLabel>Soal</StatLabel>
                  <StatValue>{topic.questionCount || topic.questions?.length || 0}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Diperbarui</StatLabel>
                  <StatValue>{formatDate(topic.updatedAt || topic.updatedAt)}</StatValue>
                </StatItem>
              </TopicStats>

              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(generatePath(ExerciseRoute.detailRoute, { id: topic.id }))}
              >
                Mulai Latihan
              </Button>
            </CardBody>
          </Card>
        )
      })}
    </TopicGrid>
  )
}

export default TopicList
