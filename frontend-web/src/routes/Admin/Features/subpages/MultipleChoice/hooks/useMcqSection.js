import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchAdminMcqTopics } from '@store/mcq/action'
import { fetchAdminTags } from '@store/tags/action'
import { actions } from "@store/tags/reducer"

export const useMcqSection = () => {
  const dispatch = useDispatch()
  const [uiState, setUiState] = useState({
    isTopicModalOpen: false,
    isConfirmationCloseOpen: false,
    isFeatureSettingModalOpen: false,
    mode: null,
    selectedTopic: null,
  })

  // Fetch topics and tags on mount
  useEffect(() => {
    dispatch(fetchAdminMcqTopics())
    dispatch(actions.updateFilter({ key: "tagGroupNames", value: ["topic", "department", "university", "semester"]}))
    dispatch(fetchAdminTags())
  }, [dispatch])

  return {
    uiState,
    setUiState,
  }
}
