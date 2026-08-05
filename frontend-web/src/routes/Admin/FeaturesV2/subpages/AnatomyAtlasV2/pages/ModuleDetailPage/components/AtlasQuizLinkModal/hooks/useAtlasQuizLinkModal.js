import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFilteredNodes } from '@store/featureNodes'
import { fetchQuizzesForNode } from '@store/nodeAnatomy/adminAction'
import {
  fetchAtlasModelQuizRelations,
  addAtlasModelQuizRelation,
  removeAtlasModelQuizRelation,
} from '@store/nodeAtlas/adminAction'

export function useAtlasQuizLinkModal(atlas) {
  const dispatch = useDispatch()

  const [linkedQuizzes, setLinkedQuizzes] = useState([])
  const [loadingRelations, setLoadingRelations] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [pickerOpen, setPickerOpen] = useState(false)
  const [level, setLevel] = useState('topics')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [nodes, setNodes] = useState([])
  const [loadingNodes, setLoadingNodes] = useState(false)

  const loadRelations = async () => {
    setLoadingRelations(true)
    try {
      const data = await dispatch(fetchAtlasModelQuizRelations(atlas.uniqueId))
      setLinkedQuizzes(data)
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
      } else if (lvl === 'quizzes') {
        const data = await dispatch(fetchQuizzesForNode(nodeId))
        setNodes(data)
      }
    } finally {
      setLoadingNodes(false)
    }
  }

  const openPicker = () => {
    setPickerOpen(true)
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
    setLevel('quizzes')
    loadPickerLevel('quizzes', mod.id)
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

  const handleLinkQuiz = async (quiz) => {
    setIsSaving(true)
    try {
      await dispatch(addAtlasModelQuizRelation(atlas.uniqueId, quiz.uniqueId))
      await loadRelations()
      setPickerOpen(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUnlink = async (relation) => {
    setIsSaving(true)
    try {
      await dispatch(removeAtlasModelQuizRelation(atlas.uniqueId, relation.id))
      setLinkedQuizzes(prev => prev.filter(r => r.id !== relation.id))
    } finally {
      setIsSaving(false)
    }
  }

  const isAlreadyLinked = (node) => linkedQuizzes.some(r => r.targetUniqueId === node.uniqueId)
  const isLeaf = level === 'quizzes'

  return {
    linkedQuizzes, loadingRelations, isSaving,
    pickerOpen, level, selectedTopic, selectedModule, nodes, loadingNodes, isLeaf,
    openPicker, handleTopicClick, handleModuleClick, handleBackToTopics, handleBackToModules,
    handleLinkQuiz, handleUnlink, isAlreadyLinked,
  }
}
