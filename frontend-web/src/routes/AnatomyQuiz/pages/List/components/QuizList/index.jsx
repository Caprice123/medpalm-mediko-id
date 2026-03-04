import { useSelector } from 'react-redux'
import { formatLocalDate } from '@utils/dateUtils'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import { LearningContentSkeletonGrid } from '@components/common/SkeletonCard'
import {
  QuizzesGrid,
  QuizDescription,
  QuizStats,
  StatItem,
  StatLabel,
  StatValue,
  EmbedBadge,
  ImageBadge,
  TagList,
  Tag
} from './QuizList.styles'
import { generatePath, useNavigate } from 'react-router-dom'
import { AnatomyQuizRoute } from '../../../../routes'

function QuizList() { 
  const { quizzes, loading } = useSelector((state) => state.anatomy)
  const navigate = useNavigate()

  // Loading state - show skeleton when loading OR when we don't know loading state yet
  if (loading?.isGetListAnatomyQuizLoading || (quizzes.length === 0 && loading?.isGetListAnatomyQuizLoading !== false)) {
    return <LearningContentSkeletonGrid count={6} statsCount={2} />
  }

  // Empty state - only show when we're sure loading is complete
  if (quizzes.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No quizzes found"
      />
    )
  }

  // Data state - render quiz grid
  return (
    <QuizzesGrid>
      {quizzes.map(quiz => (
        <Card key={quiz.uniqueId} shadow hoverable>
          <CardHeader title={quiz.title} divider={false} />

          <CardBody padding="0 1.25rem 1.25rem 1.25rem">
            <QuizDescription>
              {quiz.description || 'Tidak ada deskripsi'}
            </QuizDescription>

            {/* Anatomy Topic Tags */}
            {quiz.anatomyTopicTags && quiz.anatomyTopicTags.length > 0 && (
              <TagList>
                {quiz.anatomyTopicTags.map((tag) => (
                  <Tag key={tag.id}>
                    🫀 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            {/* Media type badge — own row */}
            <TagList>
              {quiz.mediaType === '3d'
                ? <EmbedBadge>🔗 3D Interactive</EmbedBadge>
                : <ImageBadge>🖼️ 2D Image</ImageBadge>
              }
            </TagList>
            
            <div style={{ flex: 1}}></div>


            <QuizStats>
              <StatItem>
                <StatLabel>Questions</StatLabel>
                <StatValue>{quiz.questionCount || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Terakhir Diperbaharui</StatLabel>
                <StatValue>
                  {formatLocalDate(quiz.updatedAt)}
                </StatValue>
              </StatItem>
            </QuizStats>

            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate(generatePath(AnatomyQuizRoute.detailRoute, { id: quiz.uniqueId }))}
            >
              Select
            </Button>
          </CardBody>
        </Card>
      ))}
    </QuizzesGrid>
  )
}

export default QuizList
