import { Filter } from './components/Filter'
import TopicList from './components/TopicList'
import { useExerciseList } from './hooks/useExerciseList'
import Pagination from '@components/Pagination'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/exercise/reducer'
import { fetchExerciseTopics } from '@store/exercise/action'
import {
  Container,
  TopicSelectionContainer
} from './List.styles'

function ExerciseListPage() {
  useExerciseList()
  const dispatch = useDispatch()
  const { pagination, loading, topics } = useSelector(state => state.exercise)

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchExerciseTopics())
  }

  const hasMorePages = !pagination.isLastPage || pagination.page > 1

  return (
    <Container>
      <TopicSelectionContainer>
        <Filter />

        <TopicList />

        {!loading.isTopicsLoading && topics.length > 0 && hasMorePages && (
          <Pagination
            currentPage={pagination.page}
            isLastPage={pagination.isLastPage}
            onPageChange={handlePageChange}
            isLoading={loading.isTopicsLoading}
            variant="admin"
            language="id"
          />
        )}
      </TopicSelectionContainer>
    </Container>
  )
}

export default ExerciseListPage
