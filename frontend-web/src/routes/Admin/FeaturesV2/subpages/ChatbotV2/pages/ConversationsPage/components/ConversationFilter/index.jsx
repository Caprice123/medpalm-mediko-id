import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { useConversationFilter } from './hooks/useConversationFilter'
import { FilterCard, FilterActions } from './ConversationFilter.styles'

// Filtering is server-side: the values go to the API as query params and the
// list is refetched from page 1 when the admin asks, not on every keystroke.
const ConversationFilter = () => {
  const { search, userId, setSearch, setUserId, applyFilters, isFetching } = useConversationFilter()

  return (
    <FilterCard
      onSubmit={(event) => {
        event.preventDefault()
        applyFilters()
      }}
    >
      <FilterComponent>
        <FilterComponent.Group>
          <FilterComponent.Label>Topik, nama, atau email</FilterComponent.Label>
          <TextInput
            placeholder="Cari percakapan, nama, atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FilterComponent.Group>

        <FilterComponent.Group>
          <FilterComponent.Label>User ID</FilterComponent.Label>
          <TextInput
            type="number"
            placeholder="Filter berdasarkan User ID..."
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </FilterComponent.Group>
      </FilterComponent>

      <FilterActions>
        <Button variant="primary" type="submit" disabled={isFetching}>
          🔍 Cari
        </Button>
      </FilterActions>
    </FilterCard>
  )
}

export default ConversationFilter
