import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFilteredNodes } from '@store/featureNodes'
import {
  fetchAtlasModelRelations,
  addAtlasModelRelation,
  removeAtlasModelRelation,
  fetchAtlasModelsForNode,
} from '@store/nodeAtlas/adminAction'

export function useAtlasLinkModal(atlas) {
  const dispatch = useDispatch()

  const [prevRelation, setPrevRelation] = useState(null)
  const [nextRelation, setNextRelation] = useState(null)
  const [loadingRelations, setLoadingRelations] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // picker state
  const [activeSide, setActiveSide] = useState(null) // 'prev' | 'next' | null
  const [level, setLevel] = useState('topics')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [nodes, setNodes] = useState([])
  const [loadingNodes, setLoadingNodes] = useState(false)

  const loadRelations = async () => {
    setLoadingRelations(true)
    try {
      const data = await dispatch(fetchAtlasModelRelations(atlas.uniqueId))
      const atlasRels = data.filter(r => r.targetType === 'atlas_model')
      setPrevRelation(atlasRels.find(r => r.relationType === 'prev') ?? null)
      setNextRelation(atlasRels.find(r => r.relationType === 'next') ?? null)
    } finally {
      setLoadingRelations(false)
    }
  }

  useEffect(() => { loadRelations() }, [])

  const loadPickerLevel = async (lvl, nodeId = null) => {
    setLoadingNodes(true)
    try {
      if (lvl === 'topics') {
        const data = await dispatch(fetchFilteredNodes({ layer: '1', visibility: 'general', nodeType: 'topic' }))
        setNodes(data)
      } else if (lvl === 'modules') {
        const data = await dispatch(fetchFilteredNodes({ layer: '2', visibility: 'general', nodeType: 'module', parentId: nodeId }))
        setNodes(data)
      } else if (lvl === 'models') {
        const data = await dispatch(fetchAtlasModelsForNode(nodeId))
        setNodes(data)
      }
    } finally {
      setLoadingNodes(false)
    }
  }

  const openPicker = (side) => {
    setActiveSide(side)
    setLevel('topics')
    setSelectedTopic(null)
    setSelectedModule(null)
    loadPickerLevel('topics')
  }

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic)
    setSelectedModule(null)
    setLevel('modules')
    loadPickerLevel('modules', topic.id)
  }

  const handleModuleClick = (mod) => {
    setSelectedModule(mod)
    setLevel('models')
    loadPickerLevel('models', mod.id)
  }

  const handleBackToTopics = () => {
    setSelectedTopic(null)
    setSelectedModule(null)
    setLevel('topics')
    loadPickerLevel('topics')
  }

  const handleBackToModules = () => {
    setSelectedModule(null)
    setLevel('modules')
    loadPickerLevel('modules', selectedTopic.id)
  }

  const handleLinkModel = async (model) => {
    if (!activeSide) return
    setIsSaving(true)
    try {
      await dispatch(addAtlasModelRelation(atlas.uniqueId, model.uniqueId, activeSide))
      await loadRelations()
      setActiveSide(null)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUnlink = async (side) => {
    const relation = side === 'prev' ? prevRelation : nextRelation
    if (!relation) return
    setIsSaving(true)
    try {
      await dispatch(removeAtlasModelRelation(atlas.uniqueId, relation.id))
      if (side === 'prev') setPrevRelation(null)
      else setNextRelation(null)
      if (activeSide === side) setActiveSide(null)
    } finally {
      setIsSaving(false)
    }
  }

  const isSelf = (node) => node.uniqueId === atlas.uniqueId
  const isOtherSlot = (node) => {
    if (activeSide === 'prev') return nextRelation?.targetUniqueId === node.uniqueId
    return prevRelation?.targetUniqueId === node.uniqueId
  }

  return {
    prevRelation, nextRelation, loadingRelations, isSaving,
    activeSide, level, selectedTopic, selectedModule, nodes, loadingNodes,
    openPicker, handleTopicClick, handleModuleClick, handleBackToTopics, handleBackToModules,
    handleLinkModel, handleUnlink, isSelf, isOtherSlot,
  }
}
