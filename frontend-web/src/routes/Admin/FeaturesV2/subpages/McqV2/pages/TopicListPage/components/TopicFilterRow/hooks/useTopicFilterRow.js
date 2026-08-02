import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatureNodes, updateFilter } from '@store/featureNodes'

export function useTopicFilterRow() {
  const dispatch = useDispatch()
  const classification = useSelector(s => s.featureNodes.filter.classification)
  const [search, setSearch] = useState('')

  const handleSearch = () => {
    dispatch(updateFilter({ key: 'search', value: search.trim() }))
    dispatch(fetchFeatureNodes())
  }

  const handleClassificationChange = (opt) => {
    dispatch(updateFilter({ key: 'classification', value: opt?.value ?? '' }))
    dispatch(fetchFeatureNodes())
  }

  return { search, setSearch, classification, handleSearch, handleClassificationChange }
}
