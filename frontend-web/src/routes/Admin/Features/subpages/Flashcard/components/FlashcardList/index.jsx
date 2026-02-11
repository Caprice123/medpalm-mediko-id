import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
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
      <EmptyState
        icon="📋"
        title="No flashcards found"
        actionLabel={onCreateFirst && "Create Your First Quiz"}
        onAction={onCreateFirst}
        actionVariant="primary"
      />
    )
  }

  // Data state - render quiz grid
  return (
    <QuizzesGrid>
      {decks.map(quiz => {
        // Filter tags by tag_group
        const topicTags = quiz.tags?.filter(tag => tag.tagGroup?.name === 'topic') || []
        const departmentTags = quiz.tags?.filter(tag => tag.tagGroup?.name === 'department') || []
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

            {/* Topic Tags */}
            {topicTags.length > 0 && (
              <TagList>
                {topicTags.map((tag) => (
                  <Tag key={tag.id} topic>
                    🏥 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            {/* Department Tags */}
            {departmentTags.length > 0 && (
              <TagList>
                {departmentTags.map((tag) => (
                  <Tag key={tag.id} department>
                    🏨 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

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
              {/* <Button
                variant="danger"
                fullWidth
                onClick={() => onDelete(quiz.uniqueId)}
                disabled={loading?.isDeleteAnatomyQuizLoading}
              >
                Delete
              </Button> */}
            </CardActions>
          </QuizCard>
        )
      })}
    </QuizzesGrid>
  )
}

export default FlashcardList
