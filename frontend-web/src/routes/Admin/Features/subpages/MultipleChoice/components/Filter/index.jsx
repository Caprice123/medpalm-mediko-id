import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from "@store/mcq/reducer"
import { useMemo } from 'react'
import { fetchAdminMcqTopics } from '@store/mcq/action'

export const Filter = () => {
    const dispatch = useDispatch()
    const { filter } = useSelector(state => state.mcq)
    const { tags } = useSelector(state => state.tags)

    const onSearch = () => {
        dispatch(fetchAdminMcqTopics())
    }

    const universityTags = useMemo(() => {
        return tags?.find(tag => tag.name == "university")?.tags?.map((tag) => ({ label: tag.name, value: tag.id })) || []
    }, [tags])

    const semesterTags = useMemo(() => {
        return tags?.find(tag => tag.name == "semester")?.tags?.map((tag) => ({ label: tag.name, value: tag.id })) || []
    }, [tags])

    const statusOptions = [
        { label: 'All', value: '' },
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
                <FilterComponent>
                    <FilterComponent.Group>
                        <FilterComponent.Label>Search</FilterComponent.Label>
                        <TextInput
                            placeholder="Cari topik berdasarkan nama..."
                            value={filter.search || ''}
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
                        <FilterComponent.Label>Status</FilterComponent.Label>
                        <Dropdown
                            options={statusOptions}
                            value={filter.status ? statusOptions.find(s => s.value === filter.status) : statusOptions[0]}
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
