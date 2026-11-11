import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { useSetFilter } from './hooks/useSetFilter'
import { FilterCard, FilterActions } from './SetFilter.styles'

const SetFilter = () => {
  const { search, setSearch, applySearch, isFetching } = useSetFilter()

  return (
    <FilterCard
      onSubmit={(event) => {
        event.preventDefault()
        applySearch()
      }}
    >
      <FilterComponent>
        <FilterComponent.Group>
          <FilterComponent.Label>Judul atau deskripsi</FilterComponent.Label>
          <TextInput
            placeholder="Cari set skripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

export default SetFilter
