import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/atlas/reducer'
import { useMemo } from 'react'
import { fetchAdminAtlasModels } from '@store/atlas/adminAction'
import { FilterWrapper, FilterActions } from './Filter.styles'

export const Filter = () => {
  const dispatch = useDispatch()
  const { filter } = useSelector(state => state.atlas)
  const { tags } = useSelector(state => state.tags)

  const onSearch = () => {
    dispatch(fetchAdminAtlasModels())
  }

  const topicTags = useMemo(() => {
    return tags?.find(tag => tag.name === 'atlas_topic')?.tags?.map(tag => ({
      label: tag.name,
      value: tag.id
    })) || []
  }, [tags])

  const subtopicTags = useMemo(() => {
    return tags?.find(tag => tag.name === 'atlas_subtopic')?.tags?.map(tag => ({
      label: tag.name,
      value: tag.id
    })) || []
  }, [tags])

  const statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ]

  return (
    <FilterWrapper>
      <form onSubmit={e => { e.preventDefault(); onSearch() }}>
        <FilterComponent>
          <FilterComponent.Group>
            <FilterComponent.Label>Nama model</FilterComponent.Label>
            <TextInput
              placeholder="Cari model berdasarkan nama..."
              value={filter.search || ''}
              onChange={e => dispatch(actions.updateFilter({ key: 'search', value: e.target.value }))}
              onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault(); onSearch() } }}
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Atlas Topik</FilterComponent.Label>
            <Dropdown
              options={topicTags}
              value={filter.topic ? topicTags.find(t => t.value === filter.topic) : null}
              onChange={option => dispatch(actions.updateFilter({ key: 'topic', value: option?.value || '' }))}
              placeholder="Filter berdasarkan topik..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Atlas Subtopik</FilterComponent.Label>
            <Dropdown
              options={subtopicTags}
              value={filter.subtopic ? subtopicTags.find(t => t.value === filter.subtopic) : null}
              onChange={option => dispatch(actions.updateFilter({ key: 'subtopic', value: option?.value || '' }))}
              placeholder="Filter berdasarkan subtopik..."
            />
          </FilterComponent.Group>

          <FilterComponent.Group>
            <FilterComponent.Label>Status</FilterComponent.Label>
            <Dropdown
              options={statusOptions}
              value={filter.status ? statusOptions.find(t => t.value === filter.status) : null}
              onChange={option => dispatch(actions.updateFilter({ key: 'status', value: option?.value || '' }))}
              placeholder="Filter berdasarkan status..."
            />
          </FilterComponent.Group>
        </FilterComponent>

        <FilterActions>
          <Button variant="primary" type="submit" onClick={onSearch}>
            Cari
          </Button>
        </FilterActions>
      </form>
    </FilterWrapper>
  )
}
