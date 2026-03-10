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
} from './QuizList.styles'
import QuizTagList from '../../../../components/QuizTagList'
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

            <QuizTagList tags={quiz.anatomyTopicTags} type="anatomy_topic" />
            <QuizTagList type={quiz.mediaType === '3d' ? 'media_3d' : 'media_2d'} />
            
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
