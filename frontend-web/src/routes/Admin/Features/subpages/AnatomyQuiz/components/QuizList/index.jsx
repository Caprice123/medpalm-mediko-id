import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  ActionButton,
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
  CardActionButton,
  TagList,
  Tag
} from './QuizList.styles'

function QuizList({ quizzes, loading, onEdit, onDelete, onCreateFirst }) {
  // Loading state
  if (loading?.isQuizzesLoading) {
    return <LoadingOverlay>Loading quizzes...</LoadingOverlay>
  }

  // Empty state
  if (quizzes.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>📋</EmptyStateIcon>
        <EmptyStateText>No quizzes found</EmptyStateText>
        {onCreateFirst && (
          <ActionButton onClick={onCreateFirst}>
            Create Your First Quiz
          </ActionButton>
        )}
      </EmptyState>
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
            {quiz.image_url ? (
              <QuizImage src={quiz.image_url} alt={quiz.title} />
            ) : (
              <span style={{ color: '#9ca3af' }}>No Image</span>
            )}
          </QuizImageContainer> */}

          <QuizDescription>
            {quiz.description || 'Tidak ada deskripsi'}
          </QuizDescription>

          {quiz.tags && quiz.tags.length > 0 && (
            <TagList>
              {quiz.tags.map((qt, index) => (
                <Tag key={index}>
                  {/* {getTagName(qt.tag_id)} */}
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
              <StatLabel>Tags</StatLabel>
              <StatValue>{quiz.tags?.length || 0}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Created</StatLabel>
              <StatValue>
                {new Date(quiz.created_at).toLocaleDateString()}
              </StatValue>
            </StatItem>
          </QuizStats>

          <CardActions>
            <CardActionButton onClick={() => onEdit(quiz)}>
              Edit
            </CardActionButton>
            <CardActionButton
              danger
              onClick={() => onDelete(quiz.id)}
              disabled={loading?.isDeletingQuiz}
            >
              Delete
            </CardActionButton>
          </CardActions>
        </QuizCard>
      ))}
    </QuizzesGrid>
  )
}

export default QuizList
