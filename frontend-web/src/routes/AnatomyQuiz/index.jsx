import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  fetchAnatomyQuizzes,
} from '@store/anatomy/action'
import { getWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
import {
  Container,
  Header,
  Title,
  Subtitle,
  FilterSection,
  QuizGrid,
  QuizCard,
  QuizImage,
  QuizCardBody,
  QuizTitle,
  QuizDescription,
  QuizMeta,
  QuizMetaItem,
  TagList,
  Tag,
  SubscriptionBadge,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  LoadingOverlay
} from './AnatomyQuiz.styles'

function AnatomyQuiz() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { quizzes, loading, filters } = useSelector(state => state.anatomy)
  const [tags, setTags] = useState([])

  useEffect(() => {
    dispatch(fetchAnatomyQuizzes(filters))
  }, [dispatch, filters])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getWithToken(Endpoints.tags)
        setTags(response.data.data || [])
      } catch (error) {
        console.error('Failed to fetch tags:', error)
      }
    }
    fetchTags()
  }, [])

  const handleQuizClick = (quizId) => {
    navigate(`/anatomy/${quizId}`)
  }

  const getTagName = (tagId) => {
    const tag = tags.find(t => t.id === tagId)
    return tag ? tag.name : ''
  }

  const universityTags = tags.filter(t => t.tag_group_id === 1)
  const semesterTags = tags.filter(t => t.tag_group_id === 2)

  return (
    <Container>
      <Header>
        <Title>Anatomy Quizzes</Title>
        <Subtitle>Test your knowledge on anatomical structures</Subtitle>
      </Header>

      <FilterSection>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
            University
          </label>
          <select
            value={filters.university || ''}
            onChange={(e) => handleFilterChange('university', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem'
            }}
          >
            <option value="">All Universities</option>
            {universityTags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
            Semester
          </label>
          <select
            value={filters.semester || ''}
            onChange={(e) => handleFilterChange('semester', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem'
            }}
          >
            <option value="">All Semesters</option>
            {semesterTags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            onClick={handleClearFilters}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              background: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            Clear Filters
          </button>
        </div>
      </FilterSection>

      {loading.isQuizzesLoading ? (
        <LoadingOverlay>
          <div>Loading quizzes...</div>
        </LoadingOverlay>
      ) : quizzes.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📋</EmptyStateIcon>
          <EmptyStateText>No quizzes available</EmptyStateText>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Check back later for new quizzes
          </p>
        </EmptyState>
      ) : (
        <QuizGrid>
          {quizzes.map(quiz => (
            <QuizCard key={quiz.id} onClick={() => handleQuizClick(quiz.id)}>
              <QuizImage src={quiz.image_url}>
                <SubscriptionBadge>Subscription Only</SubscriptionBadge>
              </QuizImage>
              <QuizCardBody>
                <QuizTitle>{quiz.title}</QuizTitle>
                {quiz.description && (
                  <QuizDescription>
                    {quiz.description.length > 100
                      ? quiz.description.substring(0, 100) + '...'
                      : quiz.description}
                  </QuizDescription>
                )}
                <QuizMeta>
                  <QuizMetaItem>
                    📝 {quiz.questionCount || 0} questions
                  </QuizMetaItem>
                </QuizMeta>
                {quiz.tags && quiz.tags.length > 0 && (
                  <TagList>
                    {quiz.tags.map((qt, index) => (
                      <Tag key={index}>
                        {getTagName(qt.tag_id)}
                      </Tag>
                    ))}
                  </TagList>
                )}
              </QuizCardBody>
            </QuizCard>
          ))}
        </QuizGrid>
      )}
    </Container>
  )
}

export default AnatomyQuiz
