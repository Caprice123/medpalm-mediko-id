import { useSelector } from 'react-redux'
import { Card, CardHeader, CardBody } from '@components/common/Card'
import Button from '@components/common/Button'
import { LearningContentSkeletonGrid } from '@components/common/SkeletonCard'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  QuizzesGrid,
  QuizDescription,
  QuizStats,
  StatItem,
  StatLabel,
  StatValue,
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
      <EmptyState>
        <EmptyStateIcon>📋</EmptyStateIcon>
        <EmptyStateText>No quizzes found</EmptyStateText>
      </EmptyState>
    )
  }

  // Data state - render quiz grid
  return (
    <QuizzesGrid>
      {quizzes.map(quiz => (
        <Card key={quiz.id} shadow hoverable>
          <CardHeader title={quiz.title} divider={false} />

          <CardBody padding="0 1.25rem 1.25rem 1.25rem">
            <QuizDescription>
              {quiz.description || 'Tidak ada deskripsi'}
            </QuizDescription>

            <div style={{ flex: 1}}></div>

            {/* University Tags */}
            {quiz.universityTags && quiz.universityTags.length > 0 && (
              <TagList>
                {quiz.universityTags.map((tag) => (
                  <Tag key={tag.id} university>
                    🏛️ {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            {/* Semester Tags */}
            {quiz.semesterTags && quiz.semesterTags.length > 0 && (
              <TagList>
                {quiz.semesterTags.map((tag) => (
                  <Tag key={tag.id} semester>
                    📚 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            <QuizStats>
              <StatItem>
                <StatLabel>Questions</StatLabel>
                <StatValue>{quiz.questionCount || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Terakhir Diperbaharui</StatLabel>
                <StatValue>
                  {new Date(quiz.updatedAt).toLocaleDateString("id-ID")}
                </StatValue>
              </StatItem>
            </QuizStats>

            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate(generatePath(AnatomyQuizRoute.detailRoute, { id: quiz.id }))}
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
