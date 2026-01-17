import FilterComponent from '@components/common/Filter'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/oscePractice/reducer'
import { fetchAdminOsceTopics } from '@store/oscePractice/adminAction'
import { useEffect, useMemo } from 'react'
import { fetchTags } from '@store/tags/action'
import { actions as tagActions } from '@store/tags/reducer'

function Filter() {
  const dispatch = useDispatch()
  const { filters } = useSelector(state => state.oscePractice)
  const { tags } = useSelector(state => state.tags)

  useEffect(() => {
      dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["topic", "batch"]}))
      dispatch(fetchTags())
  }, [dispatch])

  const onSearch = () => {
    dispatch(actions.setPage(1))
    dispatch(fetchAdminOsceTopics())
  }

  const topicTags = useMemo(() => {
    return tags?.find(tag => tag.name === "topic")?.tags?.map((tag) => ({ label: tag.name, value: tag.id })) || []
  }, [tags])

  const batchTags = useMemo(() => {
    return tags?.find(tag => tag.name === "batch")?.tags?.map((tag) => ({ label: tag.name, value: tag.id })) || []
  }, [tags])

  const statusOptions = [
    { label: 'All Status', value: '' },
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' }
  ]

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
            <FilterComponent.Label>Topik</FilterComponent.Label>
            <Dropdown
              options={topicTags}
              value={filters.topic ? topicTags.find(t => t.value === filters.topic) : null}
              onChange={(option) => onChangeFilter("topic", option?.value || "")}
              placeholder="Filter berdasarkan universitas..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Batch</FilterComponent.Label>
            <Dropdown
              options={batchTags}
              value={filters.batch ? batchTags.find(t => t.value === filters.batch) : null}
              onChange={(option) => onChangeFilter("batch", option?.value || "")}
              placeholder="Filter berdasarkan batch..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Status</FilterComponent.Label>
            <Dropdown
              options={statusOptions}
              value={filters.status ? statusOptions.find(s => s.value === filters.status) : statusOptions[0]}
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

export default Filter
