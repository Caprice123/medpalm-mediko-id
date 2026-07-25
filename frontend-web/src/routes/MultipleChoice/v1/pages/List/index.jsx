import { Container, Content } from './List.styles'
import { useMultipleChoiceList } from './useMultipleChoiceList'
import { Filter } from './components/Filter'
import TopicList from './components/TopicList'
import Pagination from '@components/Pagination'

const List = () => {
  const {
    filteredTopics,
    loading,
    pagination,
    handlePageChange
  } = useMultipleChoiceList()

  return (
    <Container>
      <Content>
        <Filter />
        <TopicList topics={filteredTopics} />
        {!loading.isTopicsLoading && filteredTopics.length > 0 && (pagination.page > 1 || (pagination.page === 1 && !pagination.isLastPage)) && (
          <Pagination
            currentPage={pagination.page}
            isLastPage={pagination.isLastPage}
            onPageChange={handlePageChange}
            isLoading={loading.isTopicsLoading}
            variant="admin"
            language="id"
          />
        )}
      </Content>
    </Container>
  )
}

export default List
