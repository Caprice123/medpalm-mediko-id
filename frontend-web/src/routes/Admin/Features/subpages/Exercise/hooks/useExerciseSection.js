import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchTags } from '@store/tags/action'
import { actions } from "@store/tags/reducer"
import { fetchAdminExerciseTopics } from '@store/exercise/adminAction'

export const useExerciseSection = () => {
    const dispatch = useDispatch()
    const [uiState, setUiState] = useState({
        isTopicModalOpen: false,
        isFeatureSettingOpen: false,
        isConfirmationCloseOpen: false,
        mode: null,
        selectedTopic: null,
    })

    useEffect(() => {
        dispatch(fetchAdminExerciseTopics({}))
        dispatch(actions.updateFilter({ key: "tagGroupNames", value: ["topic", "department", "university", "semester"]}))
        dispatch(fetchTags())
    }, [dispatch])

    return {
        uiState,
        setUiState,
    }
}
