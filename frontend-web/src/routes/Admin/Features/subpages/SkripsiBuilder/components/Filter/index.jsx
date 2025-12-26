import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/skripsi/reducer'
import { fetchAdminSets } from '@store/skripsi/action'

export const Filter = () => {
  const dispatch = useDispatch()
  const { filters } = useSelector(state => state.skripsi)

  const onSearch = () => {
    dispatch(fetchAdminSets(filters, 1, 20))
  }

  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    }}>
      <form onSubmit={e => {
        e.preventDefault()
        onSearch()
      }}>
        <FilterComponent>
          <FilterComponent.Group>
            <FilterComponent.Label>Judul/Deskripsi Set</FilterComponent.Label>
            <TextInput
              placeholder="Cari set berdasarkan judul atau deskripsi..."
              value={filters.search || ''}
              onChange={(e) => dispatch(actions.updateFilter({ key: "search", value: e.target.value }))}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  onSearch()
                }
              }}
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>User ID</FilterComponent.Label>
            <TextInput
              type="number"
              placeholder="Filter berdasarkan User ID..."
              value={filters.userId || ''}
              onChange={(e) => dispatch(actions.updateFilter({ key: "userId", value: e.target.value }))}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  onSearch()
                }
              }}
            />
          </FilterComponent.Group>
        </FilterComponent>

        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end',
          marginTop: '1rem'
        }}>
          <Button
            variant="primary"
            type="submit"
            onClick={onSearch}
          >
            🔍 Cari
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Filter
