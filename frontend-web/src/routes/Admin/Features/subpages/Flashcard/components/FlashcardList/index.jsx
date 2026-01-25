import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
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
} from './FlashcardList.styles'

function FlashcardList({ onEdit, onDelete, onCreateFirst }) { 
  const { decks, loading } = useSelector((state) => state.flashcard)

  // Loading state
  if (loading?.isGetListDecksLoading) {
    return <LoadingOverlay>Loading flashcards...</LoadingOverlay>
  }

  // Empty state
  if (decks.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>📋</EmptyStateIcon>
        <EmptyStateText>No flashcards found</EmptyStateText>
        {onCreateFirst && (
          <Button variant="primary" onClick={onCreateFirst}>
            Create Your First Quiz
          </Button>
        )}
      </EmptyState>
    )
  }

  // Data state - render quiz grid
  return (
    <QuizzesGrid>
      {decks.map(quiz => {
        // Filter tags by tag_group
        const universityTags = quiz.tags?.filter(tag => tag.tagGroup?.name === 'university') || []
        const semesterTags = quiz.tags?.filter(tag => tag.tagGroup?.name === 'semester') || []

        return (
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

          <QuizStats>
            <StatItem>
              <StatLabel>Kartu</StatLabel>
              <StatValue>{quiz.cardCount || 0}</StatValue>
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
              <Button
                variant="danger"
                fullWidth
                onClick={() => onDelete(quiz.id)}
                disabled={loading?.isDeleteAnatomyQuizLoading}
              >
                Delete
              </Button>
            </CardActions>
          </QuizCard>
        )
      })}
    </QuizzesGrid>
  )
}

export default FlashcardList
