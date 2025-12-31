import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/flashcard/reducer'
import { fetchFlashcardDecks } from '@store/flashcard/action'

const bundleTypeOptions = [
    {
        label: "Semua",
        value: ""
    }, {
        label: "Subsciption",
        value: "subscription"
    }, {
        label: "Credits",
        value: "credits"
    }, {
        label: "Subscription + Credits",
        value: "subscription_and_credits"
    }
]

const statusOptions = [
    {
        label: "pending",
        value: "pending",
    }, {
        label: "completed",
        value: "completed"
    }, {
        label: "failed",
        value: "failed"
    }
]

export const Filter = () => {
  const dispatch = useDispatch()
  const { filters } = useSelector(state => state.credit)

  const onSearch = () => {
    dispatch(fetchFlashcardDecks())
  }

  const onChangeFilter = (key, value) => {
    dispatch(actions.updateFilter({ key: key, value: value })) 
    dispatch(actions.setPage(1)) 
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
            <FilterComponent.Label>Kode</FilterComponent.Label>
            <TextInput
              placeholder="Cari transaksi berdasarkan kode..."
              value={filters.code || ''}
              onChange={(e) => onChangeFilter("search", e.target.value )}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  onSearch()
                }
              }}
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Tipe</FilterComponent.Label>
            <Dropdown
              option={bundleTypeOptions}
              value={filters.type ? bundleTypeOptions.find(t => t.value === filters.type) : null}
              onChange={(option) => onChangeFilter(" ", option?.value || "")}
              placeholder="Filter berdasarkan tipe..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Status</FilterComponent.Label>
            <Dropdown
              options={statusOptions}
              value={filters.status ? statusOptions.find(t => t.value === filters.status) : null}
              onChange={(option) => onChangeFilter("status", option?.value || "")}
              placeholder="Filter berdasarkan status..."
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
