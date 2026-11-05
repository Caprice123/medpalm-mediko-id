import { useEffect, useMemo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTags } from '@store/tags/userAction'
import { actions as tagActions } from '@store/tags/reducer'
import { actions } from '@store/oscePractice/v2/reducer'
import { fetchOsceStations, loadMoreOsceStations } from '@store/oscePractice/v2/userAction'

// The station panel's own controls: the search box, the two tag selects, and load-more.
//
// Search is held locally until it is submitted — filtering on every keystroke would fire a
// request per letter against a list the student is reading, and the backend is the only thing
// that filters here (never the loaded page).
export const useStationPanel = () => {
  const dispatch = useDispatch()
  const { tags } = useSelector((state) => state.tags)
  const filter = useSelector((state) => state.oscePracticeV2.filter)
  const [searchDraft, setSearchDraft] = useState(filter.search)

  useEffect(() => {
    dispatch(tagActions.updateFilter({ key: 'tagGroupNames', value: ['topic', 'batch'] }))
    dispatch(fetchTags())
  }, [dispatch])

  // The rail can change the topic filter too, so the box follows the store rather than owning
  // the truth: clearing a filter from the rail must empty the box here.
  useEffect(() => {
    setSearchDraft(filter.search)
  }, [filter.search])

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

  const submitSearch = useCallback((event) => {
    event?.preventDefault()
    applyFilter('search', searchDraft)
  }, [applyFilter, searchDraft])

  const loadMore = useCallback(() => dispatch(loadMoreOsceStations()), [dispatch])

  return {
    searchDraft,
    setSearchDraft,
    submitSearch,
    topicOptions,
    batchOptions,
    applyFilter,
    loadMore,
  }
}
