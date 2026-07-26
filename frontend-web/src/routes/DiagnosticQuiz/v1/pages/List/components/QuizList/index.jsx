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
  TagList,
  Tag
} from './QuizList.styles'
import { generatePath, useNavigate } from 'react-router-dom'
import { DiagnosticQuizRoute } from '../../../../../routes'

function QuizList() {
  const { quizzes, loading } = useSelector((state) => state.diagnostic)
  const navigate = useNavigate()

  if (loading?.isGetListDiagnosticQuizLoading || (quizzes.length === 0 && loading?.isGetListDiagnosticQuizLoading !== false)) {
    return <LearningContentSkeletonGrid count={6} statsCount={2} />
  }

  if (quizzes.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No quizzes found"
      />
    )
  }

  return (
    <QuizzesGrid>
      {quizzes.map(quiz => (
        <Card key={quiz.uniqueId} shadow hoverable>
          <CardHeader title={quiz.title} divider={false} />

          <CardBody padding="0 1.25rem 1.25rem 1.25rem">
            <QuizDescription>
              {quiz.description || 'Tidak ada deskripsi'}
            </QuizDescription>

            {quiz.universityTags && quiz.universityTags.length > 0 && (
              <TagList>
                {quiz.universityTags.map((tag) => (
                  <Tag key={tag.id} university>
                    🏛️ {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            {quiz.semesterTags && quiz.semesterTags.length > 0 && (
              <TagList>
                {quiz.semesterTags.map((tag) => (
                  <Tag key={tag.id} semester>
                    📚 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            {quiz.diagnosticTopicTags && quiz.diagnosticTopicTags.length > 0 && (
              <TagList>
                {quiz.diagnosticTopicTags.map((tag) => (
                  <Tag key={tag.id} topic>
                    🏷️ {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            <div style={{ flex: 1 }}></div>

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
              onClick={() => navigate(generatePath(DiagnosticQuizRoute.detailRoute, { id: quiz.uniqueId }))}
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
