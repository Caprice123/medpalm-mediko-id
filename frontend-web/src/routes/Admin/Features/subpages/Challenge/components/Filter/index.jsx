import { useMemo } from 'react'
import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/challenge/reducer'
import { fetchAdminChallenges } from '@store/challenge/adminAction'
import { FilterWrapper, FilterActions } from './Filter.styles'

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

const SCORING_OPTIONS = [
  { label: 'Classic', value: 'classic' },
  { label: 'Blitz', value: 'blitz' },
]

export const ChallengeFilter = () => {
  const dispatch = useDispatch()
  const { filter } = useSelector(state => state.challenge)
  const { tags } = useSelector(state => state.tags)

  const universityTags = useMemo(() =>
    tags?.find(tag => tag.name === 'university')?.tags?.map(tag => ({ label: tag.name, value: tag.id })) || []
  , [tags])

  const semesterTags = useMemo(() =>
    tags?.find(tag => tag.name === 'semester')?.tags?.map(tag => ({ label: tag.name, value: tag.id })) || []
  , [tags])

  const onSearch = () => {
    dispatch(actions.setPage(1))
    dispatch(fetchAdminChallenges())
  }

  return (
    <FilterWrapper>
      <form onSubmit={e => { e.preventDefault(); onSearch() }}>
        <FilterComponent>
          <FilterComponent.Group>
            <FilterComponent.Label>Nama</FilterComponent.Label>
            <TextInput
              placeholder="Cari berdasarkan judul..."
              value={filter.search || ''}
              onChange={e => dispatch(actions.updateFilter({ key: 'search', value: e.target.value }))}
              onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault(); onSearch() } }}
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Status</FilterComponent.Label>
            <Dropdown
              options={STATUS_OPTIONS}
              value={filter.status ? STATUS_OPTIONS.find(o => o.value === filter.status) : null}
              onChange={option => dispatch(actions.updateFilter({ key: 'status', value: option?.value || undefined }))}
              placeholder="Semua status"
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Tipe Scoring</FilterComponent.Label>
            <Dropdown
              options={SCORING_OPTIONS}
              value={filter.scoringType ? SCORING_OPTIONS.find(o => o.value === filter.scoringType) : null}
              onChange={option => dispatch(actions.updateFilter({ key: 'scoringType', value: option?.value || undefined }))}
              placeholder="Semua tipe"
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Universitas</FilterComponent.Label>
            <Dropdown
              options={universityTags}
              value={filter.university ? universityTags.find(t => t.value === filter.university) : null}
              onChange={option => dispatch(actions.updateFilter({ key: 'university', value: option?.value || undefined }))}
              placeholder="Semua universitas"
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Semester</FilterComponent.Label>
            <Dropdown
              options={semesterTags}
              value={filter.semester ? semesterTags.find(t => t.value === filter.semester) : null}
              onChange={option => dispatch(actions.updateFilter({ key: 'semester', value: option?.value || undefined }))}
              placeholder="Semua semester"
            />
          </FilterComponent.Group>
        </FilterComponent>

        <FilterActions>
          <Button variant="primary" type="submit">
            🔍 Cari
          </Button>
        </FilterActions>
      </form>
    </FilterWrapper>
  )
}
