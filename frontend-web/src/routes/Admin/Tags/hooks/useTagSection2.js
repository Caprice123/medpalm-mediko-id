import { useEffect } from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTags, createTag, updateTagAction, deleteTag } from '@store/tags/action'

export const useTagSection = () => {
    const [uiState, setUiState] = useState({
        isTagGroupModalOpen: false,
        isTagModalOpen: false,
    })
    const dispatch = useDispatch()
    const { tags, loading } = useSelector(state => state.tags)

    const [expandedGroups, setExpandedGroups] = useState({})
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
    const [isTagModalOpen, setIsTagModalOpen] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectedTag, setSelectedTag] = useState(null)

    useEffect(() => {
        dispatch(fetchTags())
    }, [dispatch])

    // Group tags by type
    const groupedTags = tags.reduce((acc, tag) => {
        if (!acc[tag.type]) {
        acc[tag.type] = []
        }
        acc[tag.type].push(tag)
        return acc
    }, {})

    const groupNames = Object.keys(groupedTags).sort()

    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }))
    }

    const handleCreateGroup = () => {
        setSelectedGroup(null)
        setIsGroupModalOpen(true)
    }

    const handleAddTagToGroup = (groupName) => {
        setSelectedGroup(groupName)
        setSelectedTag(null)
        setIsTagModalOpen(true)
    }

    const handleEditTag = (tag) => {
        setSelectedTag(tag)
        setSelectedGroup(tag.type)
        setIsTagModalOpen(true)
    }

    const handleGroupModalSuccess = () => {
        setIsGroupModalOpen(false)
        dispatch(fetchTags())
    }

    const handleTagModalSuccess = () => {
        setIsTagModalOpen(false)
        dispatch(fetchTags())
    }
}