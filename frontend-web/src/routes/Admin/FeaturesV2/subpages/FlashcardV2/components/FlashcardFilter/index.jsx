import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/flashcard/reducer'
import { fetchV2Decks } from '@store/flashcard/v2/adminAction'
import { getWithToken } from '@utils/requestUtils'
import Endpoints from '@config/endpoint'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { FilterWrap, FilterGroup, FilterLabel } from './FlashcardFilter.styles'

export default function FlashcardFilter() {
  const dispatch = useDispatch()
  const { filters } = useSelector(state => state.flashcard)

  const [topicOptions, setTopicOptions] = useState([])
  const [deptOptions, setDeptOptions] = useState([])

  useEffect(() => {
    const fetchOptions = async () => {
      const [topicRes, deptRes] = await Promise.all([
        getWithToken(Endpoints.admin.featureNodes, { nodeType: 'topic' }),
        getWithToken(Endpoints.admin.featureNodes, { nodeType: 'department' }),
      ])
      setTopicOptions((topicRes.data.data || []).map(n => ({ label: n.name, value: n.id })))
      setDeptOptions((deptRes.data.data || []).map(n => ({ label: n.name, value: n.id })))
    }
    fetchOptions()
  }, [])

  const set = (key, value) => {
    dispatch(actions.updateFilter({ key, value }))
    dispatch(actions.setPage(1))
  }

  const setAndFetch = (key, value) => {
    dispatch(actions.updateFilter({ key, value }))
    dispatch(actions.setPage(1))
    dispatch(fetchV2Decks())
  }

  const onSearch = () => dispatch(fetchV2Decks())

  return (
    <FilterWrap onSubmit={e => { e.preventDefault(); onSearch() }}>
      <FilterGroup>
        <FilterLabel>Judul</FilterLabel>
        <TextInput
          placeholder="Cari deck..."
          value={filters.search || ''}
          onChange={e => set('search', e.target.value)}
          onKeyPress={e => e.key === 'Enter' && onSearch()}
        />
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Topik</FilterLabel>
        <Dropdown
          options={topicOptions}
          value={topicOptions.find(o => o.value === filters.topic) || null}
          onChange={opt => setAndFetch('topic', opt?.value || '')}
          placeholder="Semua topik"
        />
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Departemen</FilterLabel>
        <Dropdown
          options={deptOptions}
          value={deptOptions.find(o => o.value === filters.department) || null}
          onChange={opt => setAndFetch('department', opt?.value || '')}
          placeholder="Semua departemen"
        />
      </FilterGroup>

      <Button variant="primary" type="submit">Cari</Button>
    </FilterWrap>
  )
}
