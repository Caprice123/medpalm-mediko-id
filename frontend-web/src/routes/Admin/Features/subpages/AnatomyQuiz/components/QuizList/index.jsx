import { useSelector } from 'react-redux'
import EmptyState from '@components/common/EmptyState'
import {
  LoadingOverlay,
  QuizzesGrid,
  QuizCard,
  QuizCardHeader,
  QuizCardTitle,
  StatusBadge,
  QuizImageContainer,
  QuizImage,
  QuizDescription,
  QuizStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
  TagList,
  Tag
} from './QuizList.styles'
import Button from '@components/common/Button'

function QuizList({ onEdit, onDelete, onCreateFirst }) { 
  const { quizzes, loading } = useSelector((state) => state.anatomy)

  // Loading state
  if (loading?.isGetListAnatomyQuizLoading) {
    return <LoadingOverlay>Loading quizzes...</LoadingOverlay>
  }

  // Empty state
  if (quizzes.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No quizzes found"
        actionLabel={onCreateFirst && "Create Your First Quiz"}
        onAction={onCreateFirst}
        actionVariant="primary"
      />
    )
  }

  // Data state - render quiz grid
  return (
    <QuizzesGrid>
      {quizzes.map(quiz => (
        <QuizCard key={quiz.id}>
          <QuizCardHeader>
            <QuizCardTitle>{quiz.title}</QuizCardTitle>
            <StatusBadge published={quiz.status === 'published'}>
              {quiz.status === 'published' ? 'Published' : 'Draft'}
            </StatusBadge>
          </QuizCardHeader>

          {/* <QuizImageContainer>
            {quiz.imageUrl ? (
              <QuizImage src={quiz.imageUrl} alt={quiz.title} />
            ) : (
              <span style={{ color: '#9ca3af' }}>No Image</span>
            )}
          </QuizImageContainer> */}

          <QuizDescription>
            {quiz.description || 'Tidak ada deskripsi'}
          </QuizDescription>


          <div style={{flex: "1"}}></div>
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
              <StatLabel>Created</StatLabel>
              <StatValue>
                {new Date(quiz.createdAt).toLocaleDateString("id-ID")}
              </StatValue>
            </StatItem>
          </QuizStats>

          <CardActions>
            <Button variant="secondary" fullWidth onClick={() => onEdit(quiz)}>
              Edit
            </Button>
            {/* <Button
              variant="danger"
              fullWidth
              onClick={() => onDelete(quiz.id)}
              disabled={loading?.isDeleteAnatomyQuizLoading}
            >
              Delete
            </Button> */}
          </CardActions>
        </QuizCard>
      ))}
    </QuizzesGrid>
  )
}

export default QuizList
