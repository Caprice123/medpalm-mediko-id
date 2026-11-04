import { PiMagnifyingGlass } from 'react-icons/pi'
import Button from '@components/common/Button'
import { useWebinarFilters } from './hooks/useWebinarFilters'
import { FilterStrip, FilterTab, SearchForm, SearchField } from './WebinarFilters.styles'

const REGISTRATION_FILTERS = [
  { key: 'open', label: 'Pendaftaran aktif' },
  { key: 'upcoming', label: 'Akan dibuka' },
  { key: 'closed', label: 'Sudah selesai' },
  { key: 'all', label: 'Semua' },
]

function WebinarFilters({ onStatusChange, onSearchSubmit }) {
  const { draft, setDraft, activeStatus, handleSubmit } = useWebinarFilters({ onSearchSubmit })

  return (
    <FilterStrip>
      {REGISTRATION_FILTERS.map(({ key, label }) => (
        <FilterTab
          key={key}
          type="button"
          $active={activeStatus === key}
          aria-pressed={activeStatus === key}
          onClick={() => onStatusChange(key)}
        >
          {label}
        </FilterTab>
      ))}

      <SearchForm onSubmit={handleSubmit} role="search">
        <SearchField>
          <PiMagnifyingGlass size={16} aria-hidden="true" />
          <input
            type="search"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Cari judul webinar…"
            aria-label="Cari judul webinar"
          />
        </SearchField>
        <Button variant="secondary" type="submit">Cari</Button>
      </SearchForm>
    </FilterStrip>
  )
}

export default WebinarFilters
