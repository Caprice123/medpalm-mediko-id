import { useEffect } from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { fetchAdminTags } from '@store/tags/adminAction'
import { useCreateTag } from "./subhooks/useCreateTag"
import { useUpdateTag } from "./subhooks/useUpdateTag"

export const useTagSection = () => {
    const [uiState, setUiState] = useState({
        isTagModalOpen: false,
        mode: null
    })
    const [expandedGroups, setExpandedGroups] = useState({})

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAdminTags())
    }, [dispatch])

    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }))
    }

    return {
        uiState,
        setUiState,
        expandedGroups,
        toggleGroup,
        useCreateTag: useCreateTag(setUiState),
        useUpdateTag: useUpdateTag(setUiState),
    }
}
