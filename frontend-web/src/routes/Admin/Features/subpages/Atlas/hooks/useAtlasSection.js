import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchAdminAtlasModels } from '@store/atlas/adminAction'
import { fetchAdminTags } from '@store/tags/adminAction'
import { actions } from '@store/tags/reducer'

export const useAtlasSection = () => {
  const dispatch = useDispatch()
  const [uiState, setUiState] = useState({
    isModalOpen: false,
    isSettingsModalOpen: false,
    mode: null,
  })

  useEffect(() => {
    dispatch(fetchAdminAtlasModels())
    dispatch(actions.updateFilter({ key: 'tagGroupNames', value: ['atlas_topic', 'atlas_subtopic'] }))
    dispatch(fetchAdminTags())
  }, [dispatch])

  return {
    uiState,
    setUiState,
  }
}
