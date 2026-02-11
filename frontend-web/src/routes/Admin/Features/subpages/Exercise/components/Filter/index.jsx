import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminExerciseTopics } from '@store/exercise/adminAction'
import { useMemo } from 'react'
import { actions } from '@store/exercise/reducer'

const {
  setFilters,
} = actions


export const Filter = () => {
  const dispatch = useDispatch()
  const { filters } = useSelector(state => state.exercise)
  const { tags } = useSelector(state => state.tags)

  const onSearch = () => {
    dispatch(fetchAdminExerciseTopics(filters))
  }

  const topicTags = useMemo(() => {
    return tags?.find(tag => tag.name === "topic")?.tags?.map((tag) => ({ label: tag.name, value: tag.id })) || []
  }, [tags])

  const departmentTags = useMemo(() => {
    return tags?.find(tag => tag.name === "department")?.tags?.map((tag) => ({ label: tag.name, value: tag.id })) || []
  }, [tags])

  const universityTags = useMemo(() => {
    return tags?.find(tag => tag.name === "university")?.tags?.map((tag) => ({ label: tag.name, value: tag.id })) || []
  }, [tags])

  const semesterTags = useMemo(() => {
    return tags?.find(tag => tag.name === "semester")?.tags?.map((tag) => ({ label: tag.name, value: tag.id })) || []
  }, [tags])

  const onChangeFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    dispatch(setFilters(newFilters))
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
            <FilterComponent.Label>Judul</FilterComponent.Label>
            <TextInput
              placeholder="Cari topik berdasarkan judul..."
              value={filters.search || ''}
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
            <FilterComponent.Label>Topik</FilterComponent.Label>
            <Dropdown
              options={topicTags}
              value={filters.topic ? topicTags.find(t => t.value === parseInt(filters.topic)) : null}
              onChange={(option) => onChangeFilter("topic", option?.value || "")}
              placeholder="Filter berdasarkan topik..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Departemen</FilterComponent.Label>
            <Dropdown
              options={departmentTags}
              value={filters.department ? departmentTags.find(t => t.value === parseInt(filters.department)) : null}
              onChange={(option) => onChangeFilter("department", option?.value || "")}
              placeholder="Filter berdasarkan departemen..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Universitas</FilterComponent.Label>
            <Dropdown
              options={universityTags}
              value={filters.university ? universityTags.find(t => t.value === parseInt(filters.university)) : null}
              onChange={(option) => onChangeFilter("university", option?.value || "")}
              placeholder="Filter berdasarkan universitas..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Semester</FilterComponent.Label>
            <Dropdown
              options={semesterTags}
              value={filters.semester ? semesterTags.find(t => t.value === parseInt(filters.semester)) : null}
              onChange={(option) => onChangeFilter("semester", option?.value || "")}
              placeholder="Filter berdasarkan semester..."
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
