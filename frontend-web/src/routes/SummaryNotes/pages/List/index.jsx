import {
  Container,
  Content
} from './SummaryNotes.styles'
import { Filter } from './components/Filter'
import NotesList from './components/NotesList'
import Pagination from '@components/Pagination'
import { useSummaryNotesList } from './hooks/useSummaryNotesList'

function SummaryNotesPage() {
  const { loading, pagination, notes, handlePageChange } = useSummaryNotesList()

  return (
    <Container>
      <Content>
        <Filter />

        <NotesList />

        {!loading.isNotesLoading && notes.length > 0 && (pagination.page > 1 || !pagination.isLastPage) && (
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
