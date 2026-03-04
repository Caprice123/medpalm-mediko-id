import FilterComponent from '@components/common/Filter'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from "@store/anatomy/reducer"
import { useMemo } from 'react'
import { fetchAnatomyQuizzes } from '@store/anatomy/userAction'

export const Filter = () => {
    const dispatch = useDispatch()
    const { filter } = useSelector(state => state.anatomy)
    const { tags } = useSelector(state => state.tags)

    const onSearch = () => {
        dispatch(fetchAnatomyQuizzes())
    }

    const anatomyTopicTags = useMemo(() => {
        return tags?.find(tag => tag.name == "anatomy_topic")?.tags?.map((tag) => ({ label: tag.name, value: tag.id })) || []
    }, [tags])

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
                        <FilterComponent.Label>Nama quiz</FilterComponent.Label>
                        <TextInput
                            placeholder="Cari quiz berdasarkan nama..."
                            value={filter.name || ''}
                            onChange={(e) => dispatch(actions.updateFilter({ key: "name", value: e.target.value }))}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    onSearch()
                                }
                            }}
                        />
                    </FilterComponent.Group>

                    <FilterComponent.Group>
                        <FilterComponent.Label>Topik Anatomi</FilterComponent.Label>
                        <Dropdown
                            options={anatomyTopicTags}
                            value={filter.topic ? anatomyTopicTags.find(t => t.value === filter.topic) : null}
                            onChange={(option) => dispatch(actions.updateFilter({ key: "topic", value: option?.value || "" }))}
                            placeholder="Filter berdasarkan topik..."
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
