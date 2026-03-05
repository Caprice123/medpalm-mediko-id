import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/mcq/reducer'
import { useMemo } from 'react'
import { fetchAdminMcqTopics } from '@store/mcq/adminAction'

export const Filter = () => {
  const dispatch = useDispatch()
  const { filter } = useSelector(state => state.mcq)
  const { tags } = useSelector(state => state.tags)

  const onSearch = () => {
    dispatch(actions.setPage(1))
    dispatch(fetchAdminMcqTopics())
  }

  const universityTags = useMemo(() => {
    return tags?.find(tag => tag.name === 'university')?.tags?.map(tag => ({ label: tag.name, value: tag.id })) || []
  }, [tags])

  const semesterTags = useMemo(() => {
    return tags?.find(tag => tag.name === 'semester')?.tags?.map(tag => ({ label: tag.name, value: tag.id })) || []
  }, [tags])

  const topicTags = useMemo(() => {
    return tags?.find(tag => tag.name === 'topic')?.tags?.map(tag => ({ label: tag.name, value: tag.id })) || []
  }, [tags])

  const departmentTags = useMemo(() => {
    return tags?.find(tag => tag.name === 'department')?.tags?.map(tag => ({ label: tag.name, value: tag.id })) || []
  }, [tags])


  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    }}>
      <form onSubmit={e => { e.preventDefault(); onSearch() }}>
        <div style={{ marginBottom: '1rem' }}>
          <FilterComponent>
            <FilterComponent.Group>
              <FilterComponent.Label>Judul</FilterComponent.Label>
              <TextInput
                placeholder="Cari topik berdasarkan judul..."
                value={filter.search || ''}
                onChange={(e) => dispatch(actions.updateFilter({ key: 'search', value: e.target.value }))}
                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSearch() } }}
              />
            </FilterComponent.Group>
          </FilterComponent>
        </div>

        <FilterComponent>
          <FilterComponent.Group>
            <FilterComponent.Label>Universitas</FilterComponent.Label>
            <Dropdown
              options={universityTags}
              value={filter.university ? universityTags.find(t => t.value === filter.university) : null}
              onChange={(option) => dispatch(actions.updateFilter({ key: 'university', value: option?.value || '' }))}
              placeholder="Filter berdasarkan universitas..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Semester</FilterComponent.Label>
            <Dropdown
              options={semesterTags}
              value={filter.semester ? semesterTags.find(t => t.value === filter.semester) : null}
              onChange={(option) => dispatch(actions.updateFilter({ key: 'semester', value: option?.value || '' }))}
              placeholder="Filter berdasarkan semester..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Topik</FilterComponent.Label>
            <Dropdown
              options={topicTags}
              value={filter.topic ? topicTags.find(t => t.value === filter.topic) : null}
              onChange={(option) => dispatch(actions.updateFilter({ key: 'topic', value: option?.value || '' }))}
              placeholder="Filter berdasarkan topik..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Departemen</FilterComponent.Label>
            <Dropdown
              options={departmentTags}
              value={filter.department ? departmentTags.find(t => t.value === filter.department) : null}
              onChange={(option) => dispatch(actions.updateFilter({ key: 'department', value: option?.value || '' }))}
              placeholder="Filter berdasarkan departemen..."
            />
          </FilterComponent.Group>
        </FilterComponent>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button variant="primary" type="submit">
            🔍 Cari
          </Button>
        </div>
      </form>
    </div>
  )
}
