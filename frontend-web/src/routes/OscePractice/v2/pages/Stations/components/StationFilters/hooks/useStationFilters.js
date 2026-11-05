import { useEffect, useMemo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTags } from '@store/tags/userAction'
import { actions as tagActions } from '@store/tags/reducer'
import { actions } from '@store/oscePractice/v2/reducer'
import { fetchOsceStations } from '@store/oscePractice/v2/userAction'

const FIELDS = ['search', 'topicTag', 'batchTag']

// The bar's own controls: the search box and the two tag selects.
//
// Search is held locally until it is submitted — filtering on every keystroke would fire a
// request per letter against a list the student is reading, and the backend is the only thing
// that filters here (never the loaded page).
export const useStationFilters = () => {
  const dispatch = useDispatch()
  const { tags } = useSelector((state) => state.tags)
  const search = useSelector((state) => state.oscePracticeV2.filter.search)
  const [searchDraft, setSearchDraft] = useState(search)

  useEffect(() => {
    dispatch(tagActions.updateFilter({ key: 'tagGroupNames', value: ['topic', 'batch'] }))
    dispatch(fetchTags())
  }, [dispatch])

  // The box follows the store rather than owning the truth: "Tampilkan semua" clears the search
  // in the slice, and the box has to empty with it.
  useEffect(() => {
    setSearchDraft(search)
  }, [search])

  const toOptions = useCallback((groupName) => (
    tags?.find((group) => group.name === groupName)?.tags
      ?.map((tag) => ({ label: tag.name, value: tag.id })) || []
  ), [tags])

  const topicOptions = useMemo(() => toOptions('topic'), [toOptions])
  const batchOptions = useMemo(() => toOptions('batch'), [toOptions])

  // Every filter change resets to page one before fetching: the thunk only ever reads the page
  // the reducer currently holds, so the reset has to happen here, not as an argument.
  const applyFilter = useCallback((key, value) => {
    dispatch(actions.updateFilter({ key, value }))
    dispatch(actions.setStationsPagination({ page: 1 }))
    dispatch(fetchOsceStations())
  }, [dispatch])

  // All three at once, in one fetch — clearing them through `applyFilter` would fire a request
  // per field and let the list settle on whichever response landed last.
  const clearFilters = useCallback(() => {
    FIELDS.forEach((key) => dispatch(actions.updateFilter({ key, value: '' })))
    dispatch(actions.setStationsPagination({ page: 1 }))
    dispatch(fetchOsceStations())
  }, [dispatch])

  const submitSearch = useCallback((event) => {
    event?.preventDefault()
    applyFilter('search', searchDraft)
  }, [applyFilter, searchDraft])

  return {
    searchDraft,
    setSearchDraft,
    submitSearch,
    topicOptions,
    batchOptions,
    applyFilter,
    clearFilters,
  }
}
