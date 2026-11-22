import { useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchSet, fetchSetCitations, openTab } from '@store/skripsi/v2'

// Loads the open set and keeps track of which tab is showing.
//
// The reducer picks the first tab when a set arrives, so there is no separate
// "no tab selected" state to render around.
export const useEditorSet = () => {
  const { setId } = useParams()
  const dispatch = useDispatch()

  const currentSet = useSelector(state => state.skripsiV2.currentSet, shallowEqual)
  const activeTabId = useSelector(state => state.skripsiV2.activeTabId)
  const isFetchingSet = useSelector(state => state.skripsiV2.loading.isFetchingSet)

  useEffect(() => {
    if (!setId) return

    // One request: the set brings its tabs, sections and group with it.
    dispatch(fetchSet(setId))
    // The kept sources are read here rather than by the Referensi panel: the
    // Searcher marks a result as already saved, so both ends of the editor
    // need the list from the moment the report opens.
    dispatch(fetchSetCitations(setId))
  }, [setId, dispatch])

  const tabs = currentSet?.tabs || []
  const activeTab = tabs.find(tab => tab.id === activeTabId) || null

  // Loads that tab's messages unless they are already cached.
  useEffect(() => {
    if (!activeTabId) return

    dispatch(openTab(activeTabId))
  }, [activeTabId, dispatch])

  return {
    currentSet,
    tabs,
    activeTab,
    activeTabId,
    isFetchingSet,
    switchTab: (tabId) => dispatch(openTab(tabId)),
  }
}
