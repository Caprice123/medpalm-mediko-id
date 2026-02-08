import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/summaryNotes/reducer'
import { useMemo } from 'react'
import { fetchAdminSummaryNotes } from '@store/summaryNotes/action'

export const Filter = () => {
  const dispatch = useDispatch()
  const { filters } = useSelector(state => state.summaryNotes)
  const { tags } = useSelector(state => state.tags)

  const onSearch = () => {
    dispatch(fetchAdminSummaryNotes())
  }

  const universityTags = useMemo(() => {
    return tags?.find(tag => tag.name === "university")?.tags?.map((tag) => ({ label: tag.name, value: tag.name })) || []
  }, [tags])

  const semesterTags = useMemo(() => {
    return tags?.find(tag => tag.name === "semester")?.tags?.map((tag) => ({ label: tag.name, value: tag.name })) || []
  }, [tags])

  const topicTags = useMemo(() => {
    return tags?.find(tag => tag.name === "topic")?.tags?.map((tag) => ({ label: tag.name, value: tag.name })) || []
  }, [tags])

  const departmentTags = useMemo(() => {
    return tags?.find(tag => tag.name === "department")?.tags?.map((tag) => ({ label: tag.name, value: tag.name })) || []
  }, [tags])

  const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' }
  ]

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
        {/* Row 1: Name Search */}
        <div style={{ marginBottom: '1rem' }}>
          <FilterComponent>
            <FilterComponent.Group>
              <FilterComponent.Label>Judul</FilterComponent.Label>
              <TextInput
                placeholder="Cari ringkasan berdasarkan judul..."
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
          </FilterComponent>
        </div>

        {/* Row 2: Filters */}
        <FilterComponent>
          <FilterComponent.Group>
            <FilterComponent.Label>Universitas</FilterComponent.Label>
            <Dropdown
              options={universityTags}
              value={filters.university ? universityTags.find(t => t.value === filters.university) : null}
              onChange={(option) => dispatch(actions.updateFilter({ key: "university", value: option?.value || "" }))}
              placeholder="Filter berdasarkan universitas..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Semester</FilterComponent.Label>
            <Dropdown
              options={semesterTags}
              value={filters.semester ? semesterTags.find(t => t.value === filters.semester) : null}
              onChange={(option) => dispatch(actions.updateFilter({ key: "semester", value: option?.value || "" }))}
              placeholder="Filter berdasarkan semester..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Topik</FilterComponent.Label>
            <Dropdown
              options={topicTags}
              value={filters.topic ? topicTags.find(t => t.value === filters.topic) : null}
              onChange={(option) => dispatch(actions.updateFilter({ key: "topic", value: option?.value || "" }))}
              placeholder="Filter berdasarkan topik..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Departemen</FilterComponent.Label>
            <Dropdown
              options={departmentTags}
              value={filters.department ? departmentTags.find(t => t.value === filters.department) : null}
              onChange={(option) => dispatch(actions.updateFilter({ key: "department", value: option?.value || "" }))}
              placeholder="Filter berdasarkan departemen..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Status</FilterComponent.Label>
            <Dropdown
              options={statusOptions}
              value={filters.status ? statusOptions.find(t => t.value === filters.status) : null}
              onChange={(option) => dispatch(actions.updateFilter({ key: "status", value: option?.value || "" }))}
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
