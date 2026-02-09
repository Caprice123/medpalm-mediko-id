import { Filter } from './components/Filter'
import DeckList from './components/DeckList'
import { useFlashcardList } from './hooks/useFlashcardList'
import Pagination from '@components/Pagination'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/flashcard/reducer'
import { fetchFlashcardDecks } from '@store/flashcard/action'
import {
  Container,
  DeckSelectionContainer
} from './List.styles'

function FlashcardListPage() {
  useFlashcardList()
  const dispatch = useDispatch()
  const { pagination, loading, decks } = useSelector(state => state.flashcard)

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchFlashcardDecks())
  }

  return (
    <Container>
      <DeckSelectionContainer>
        <Filter />

        <DeckList />

        {!loading.isGetListDecksLoading && decks.length > 0 && (pagination.page > 1 || (pagination.page === 1 && !pagination.isLastPage)) && (
          <Pagination
            currentPage={pagination.page}
            isLastPage={pagination.isLastPage}
            onPageChange={handlePageChange}
            isLoading={loading.isGetListDecksLoading}
            variant="admin"
            language="id"
          />
        )}
      </DeckSelectionContainer>
    </Container>
  )
}

export default FlashcardListPage
