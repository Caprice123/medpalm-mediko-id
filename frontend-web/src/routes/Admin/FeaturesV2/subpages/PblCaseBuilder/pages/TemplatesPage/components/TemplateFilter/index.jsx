import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { useTemplateFilter } from './hooks/useTemplateFilter'
import { FilterCard, FilterActions } from './TemplateFilter.styles'

// Searching is server-side: the value goes to the API as a query param and the
// list is refetched from page 1 when the admin asks, not on every keystroke.
const TemplateFilter = () => {
  const { search, setSearch, applyFilters, isFetching } = useTemplateFilter()

  return (
    <FilterCard
      onSubmit={(event) => {
        event.preventDefault()
        applyFilters()
      }}
    >
      <FilterComponent>
        <FilterComponent.Group>
          <FilterComponent.Label>Nama template</FilterComponent.Label>
          <TextInput
            placeholder="Cari nama template..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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

export default TemplateFilter
