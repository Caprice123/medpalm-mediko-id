import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFilteredNodes } from '@store/featureNodes'
import { fetchQuizzesForNode } from '@store/nodeAnatomy/adminAction'
import {
  fetchAtlasModelQuizRelations,
  addAtlasModelQuizRelation,
  removeAtlasModelQuizRelation,
} from '@store/nodeAtlas/adminAction'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import {
  Layout,
  LinkedList, LinkedItem, LinkedTitle, EmptyLinked, AddRow,
  Divider, PickerHeader,
  Nav, NavLink, NavCurrent, NavSep,
  FolderList, FolderRow, FolderIcon, FolderName, Chevron, EmptyState,
} from './AtlasQuizLinkModal.styles'

export default function AtlasQuizLinkModal({ atlas, onClose }) {
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

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Link Quiz Anatomi — ${atlas.title}`}
      size="medium"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
        </div>
      }
    >
      <Layout>
        <LinkedList>
          {loadingRelations ? (
            <EmptyLinked>Memuat...</EmptyLinked>
          ) : linkedQuizzes.length === 0 ? (
            <EmptyLinked>Belum ada quiz yang ditautkan.</EmptyLinked>
          ) : (
            linkedQuizzes.map(rel => (
              <LinkedItem key={rel.id}>
                <LinkedTitle>{rel.targetTitle}</LinkedTitle>
                <Button size="small" variant="danger" disabled={isSaving} onClick={() => handleUnlink(rel)}>Hapus</Button>
              </LinkedItem>
            ))
          )}
        </LinkedList>

        <AddRow>
          <Button size="small" variant="secondary" disabled={isSaving || loadingRelations} onClick={openPicker}>
            + Tambah Quiz
          </Button>
        </AddRow>

        {pickerOpen && (
          <>
            <Divider />
            <PickerHeader>Pilih Quiz Anatomi</PickerHeader>

            <Nav>
              {level === 'topics' ? (
                <NavCurrent>Semua Topik</NavCurrent>
              ) : level === 'modules' ? (
                <><NavLink onClick={handleBackToTopics}>Semua Topik</NavLink><NavSep>›</NavSep><NavCurrent>{selectedTopic?.name}</NavCurrent></>
              ) : (
                <><NavLink onClick={handleBackToTopics}>Semua Topik</NavLink><NavSep>›</NavSep><NavLink onClick={handleBackToModules}>{selectedTopic?.name}</NavLink><NavSep>›</NavSep><NavCurrent>{selectedModule?.name}</NavCurrent></>
              )}
            </Nav>

            <FolderList>
              {loadingNodes ? (
                <EmptyState>Memuat...</EmptyState>
              ) : nodes.length === 0 ? (
                <EmptyState>Tidak ada data</EmptyState>
              ) : (
                nodes.map(node => {
                  const isFolder = !isLeaf
                  const disabled = isLeaf && (isAlreadyLinked(node) || isSaving)

                  return (
                    <FolderRow
                      key={node.id ?? node.uniqueId}
                      $disabled={disabled}
                      onClick={() => {
                        if (disabled) return
                        if (level === 'topics') handleTopicClick(node)
                        else if (level === 'modules') handleModuleClick(node)
                        else handleLinkQuiz(node)
                      }}
                    >
                      <FolderIcon $isFolder={isFolder}>{isFolder ? '▶' : '◆'}</FolderIcon>
                      <FolderName $bold={isFolder}>
                        {node.title ?? node.name}
                        {isLeaf && isAlreadyLinked(node) && (
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>(sudah ditautkan)</span>
                        )}
                      </FolderName>
                      {isFolder && <Chevron>›</Chevron>}
                    </FolderRow>
                  )
                })
              )}
            </FolderList>
          </>
        )}
      </Layout>
    </Modal>
  )
}
