import { useEffect } from 'react'
import {
  Container,
  Content,
} from './DiagnosticQuiz.styles'
import { fetchDiagnosticQuizzes } from '@store/diagnostic/userAction'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTags } from '@store/tags/userAction'
import { actions as tagActions } from '@store/tags/reducer'
import { DiagnosticQuizRoute } from '../../routes'
import { Filter } from './components/Filter'
import { actions } from "@store/diagnostic/reducer"
import QuizList from './components/QuizList'
import Pagination from '@components/Pagination'

function DiagnosticQuizPage() {
  const dispatch = useDispatch()
  const { loading, pagination, quizzes } = useSelector(state => state.diagnostic)

  // Fetch quizzes on mount
  useEffect(() => {
    dispatch(fetchDiagnosticQuizzes())
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["university", "semester", "diagnostic_topic"]}))
    dispatch(fetchTags())
  }, [dispatch])


  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchDiagnosticQuizzes())
  }

    return (
      <Container>
        <Content>
          <Filter />

          <QuizList />

{}
          {!loading.isGetListDiagnosticQuizLoading && quizzes.length > 0 && (pagination.page > 1 || (pagination.page === 1 && !pagination.isLastPage)) && (
            <Pagination
              currentPage={pagination.page}
              isLastPage={pagination.isLastPage}
              onPageChange={handlePageChange}
              isLoading={loading.isGetListDiagnosticQuizLoading}
              variant="admin"
              language="id"
            />
          )}

        </Content>
      </Container>
    )
}

export default DiagnosticQuizPage
