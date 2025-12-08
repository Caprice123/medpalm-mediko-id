import { useEffect } from 'react'
import {
  Container,
  Content,
  QuizzesList,
  QuizCard,
  QuizImageContainer,
  QuizImage,
  QuizCardContent,
  QuizTitle,
  QuizDescription,
  TagContainer,
  Tag,
  QuestionCount,
  LoadingSpinner,
  EmptyState,
  EmptyIcon,
  EmptyText
} from './AnatomyQuiz.styles'
import { fetchAnatomyQuizzes } from '@store/anatomy/action'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTags } from '@store/tags/action'
import { actions as tagActions } from '@store/tags/reducer'
import { generatePath, useNavigate } from 'react-router-dom'
import { AnatomyQuizRoute } from '../../routes'
import { Filter } from './components/Filter'

function AnatomyQuizPage() {
  const dispatch = useDispatch()
  const { quizzes, loading } = useSelector(state => state.anatomy)
  const navigate = useNavigate()

  // Fetch quizzes on mount
  useEffect(() => {
    dispatch(fetchAnatomyQuizzes())
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["university", "semester"]}))
    dispatch(fetchTags())
  }, [dispatch])

  const handleSelectQuiz = (quiz) => {
    navigate(generatePath(AnatomyQuizRoute.detailRoute, { id: quiz.id }))
  }


    return (
      <Container>
        <Content>
          <Filter />

          {loading.isQuizzesLoading ? (
            <EmptyState>
              <LoadingSpinner style={{ margin: '0 auto' }} />
              <p>Memuat quiz...</p>
            </EmptyState>
          ) : quizzes.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🫀</EmptyIcon>
              <EmptyText>
                Tidak ada quiz anatomi yang tersedia saat ini
              </EmptyText>
            </EmptyState>
          ) : (
            <>
              <QuizzesList>
                {quizzes.map(quiz => (
                  <QuizCard
                    key={quiz.id}
                    onClick={() => handleSelectQuiz(quiz)}
                  >
                    <QuizImageContainer>
                      {quiz.image_url ? (
                        <QuizImage src={quiz.image_url} alt={quiz.title} />
                      ) : (
                        <span style={{ color: '#9ca3af' }}>No Image</span>
                      )}
                    </QuizImageContainer>
                    <QuizCardContent>
                      <QuizTitle>{quiz.title}</QuizTitle>
                      <QuizDescription>
                        {quiz.description || 'Quiz anatomi untuk membantu Anda belajar'}
                      </QuizDescription>
                      {quiz.tags && quiz.tags.length > 0 && (
                        <TagContainer>
                          {quiz.tags.map((qt, index) => (
                            <Tag key={index}>
                              {qt.tag?.name}
                            </Tag>
                          ))}
                        </TagContainer>
                      )}
                      <QuestionCount>
                        {quiz.questionCount || 0} pertanyaan
                      </QuestionCount>
                    </QuizCardContent>
                  </QuizCard>
                ))}
              </QuizzesList>
            </>
          )}
        </Content>
      </Container>
    )
}

export default AnatomyQuizPage
