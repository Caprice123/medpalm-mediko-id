import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchTags } from '@store/tags/action'
import { actions } from "@store/tags/reducer"
import { fetchAdminFlashcardDecks } from '@/store/flashcard/adminAction'

export const useFlashcardSection = () => {
    const dispatch = useDispatch()
    const [uiState, setUiState] = useState({
        isDeckModalOpen: false,
        isFeatureSettingOpen: false,
        isConfirmationCloseOpen: false,
        mode: null,
        selectedDeck: null,
    })


    useEffect(() => {
        dispatch(fetchAdminFlashcardDecks())
        dispatch(actions.updateFilter({ key: "tagGroupNames", value: ["topic", "department", "university", "semester"]}))
        dispatch(fetchTags())
    }, [dispatch])

    return {
        uiState,
        setUiState,
    }
}
