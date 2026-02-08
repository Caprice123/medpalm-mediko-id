import { useEffect } from 'react'
import {
  Container,
  Content
} from './SummaryNotes.styles'
import { fetchSummaryNotes } from '@store/summaryNotes/action'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTags } from '@store/tags/action'
import { actions as tagActions } from '@store/tags/reducer'
import { Filter } from './components/Filter'
import { actions } from "@store/summaryNotes/reducer"
import NotesList from './components/NotesList'
import Pagination from '@components/Pagination'

function SummaryNotesPage() {
  const dispatch = useDispatch()
  const { loading, pagination, notes } = useSelector(state => state.summaryNotes)

  // Fetch notes on mount
  useEffect(() => {
    dispatch(fetchSummaryNotes())
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["university", "semester", "topic", "department"]}))
    dispatch(fetchTags())
  }, [dispatch])

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchSummaryNotes())
  }

  const hasMorePages = !pagination.isLastPage || pagination.page > 1

  return (
    <Container>
      <Content>
        <Filter />

        <NotesList />

        {!loading.isNotesLoading && notes.length > 0 && hasMorePages && (
          <Pagination
            currentPage={pagination.page}
            isLastPage={pagination.isLastPage}
            onPageChange={handlePageChange}
            isLoading={loading.isNotesLoading}
            variant="admin"
            language="id"
          />
        )}
      </Content>
    </Container>
  )
}

export default SummaryNotesPage
