import { useEffect } from 'react'
import {
  Container,
  Content,
} from './AnatomyQuiz.styles'
import { fetchAnatomyQuizzes } from '@store/anatomy/action'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTags } from '@store/tags/action'
import { actions as tagActions } from '@store/tags/reducer'
import { AnatomyQuizRoute } from '../../routes'
import { Filter } from './components/Filter'
import { actions } from "@store/anatomy/reducer"
import { fetchAdminAnatomyQuizzes } from '@store/anatomy/adminAction'
import QuizList from './components/QuizList'
import Pagination from '@components/Pagination'

function AnatomyQuizPage() {
  const dispatch = useDispatch()
  const { loading, pagination } = useSelector(state => state.anatomy)

  // Fetch quizzes on mount
  useEffect(() => {
    dispatch(fetchAnatomyQuizzes())
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["university", "semester"]}))
    dispatch(fetchTags())
  }, [dispatch])

  
  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminAnatomyQuizzes())
  }


    return (
      <Container>
        <Content>
          <Filter />

          <QuizList />

          {!loading.isGetListAnatomyQuizLoading && (
            <Pagination
              currentPage={pagination.page}
              isLastPage={pagination.isLastPage}
              onPageChange={handlePageChange}
              isLoading={loading.isGetListAnatomyQuizLoading}
              variant="admin"
              language="id"
            />
          )}

        </Content>
      </Container>
    )
}

export default AnatomyQuizPage
