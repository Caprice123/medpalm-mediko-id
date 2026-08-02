import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFilteredNodes } from '@store/featureNodes'
import {
  fetchQuizRelations,
  addQuizRelation,
  removeQuizRelation,
  fetchQuizzesForNode,
} from '@store/nodeAnatomy/adminAction'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import {
  Layout, Slots, SlotRow, SlotLabel, SlotValue, SlotEmpty, SlotActions,
  Divider, PickerHeader, PickerFor,
  Nav, NavLink, NavCurrent, NavSep,
  FolderList, FolderRow, FolderIcon, FolderName, Chevron, EmptyState,
} from './QuizLinkModal.styles'

export default function QuizLinkModal({ quiz, onClose }) {
  const dispatch = useDispatch()

  const [prevRelation, setPrevRelation] = useState(null)
  const [nextRelation, setNextRelation] = useState(null)
  const [loadingRelations, setLoadingRelations] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [activeSide, setActiveSide] = useState(null)
  const [level, setLevel] = useState('topics')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [nodes, setNodes] = useState([])
  const [loadingNodes, setLoadingNodes] = useState(false)

  const loadRelations = async () => {
    setLoadingRelations(true)
    try {
      const data = await dispatch(fetchQuizRelations(quiz.uniqueId))
      const quizRels = data.filter(r => r.targetType === 'anatomy_quiz')
      setPrevRelation(quizRels.find(r => r.relationType === 'prev') ?? null)
      setNextRelation(quizRels.find(r => r.relationType === 'next') ?? null)
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

  const handleLinkQuiz = async (item) => {
    if (!activeSide) return
    setIsSaving(true)
    try {
      await dispatch(addQuizRelation(quiz.uniqueId, item.uniqueId, activeSide))
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
      await dispatch(removeQuizRelation(quiz.uniqueId, relation.id))
      if (side === 'prev') setPrevRelation(null)
      else setNextRelation(null)
      if (activeSide === side) setActiveSide(null)
    } finally {
      setIsSaving(false)
    }
  }

  const isSelf = (node) => node.uniqueId === quiz.uniqueId
  const isOtherSlot = (node) => {
    if (activeSide === 'prev') return nextRelation?.targetUniqueId === node.uniqueId
    return prevRelation?.targetUniqueId === node.uniqueId
  }

  const isLeaf = level === 'quizzes'

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Link Quiz Anatomi — ${quiz.title}`}
      size="medium"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
        </div>
      }
    >
      <Layout>
        <Slots>
          <SlotRow>
            <SlotLabel>◀ Sebelum</SlotLabel>
            {loadingRelations ? <SlotEmpty>Memuat...</SlotEmpty>
              : prevRelation ? <SlotValue>{prevRelation.targetTitle}</SlotValue>
              : <SlotEmpty>Belum diatur</SlotEmpty>}
            <SlotActions>
              <Button size="small" variant="secondary" disabled={isSaving} onClick={() => openPicker('prev')}>
                {activeSide === 'prev' ? 'Sedang memilih...' : 'Atur'}
              </Button>
              {prevRelation && (
                <Button size="small" variant="danger" disabled={isSaving} onClick={() => handleUnlink('prev')}>Hapus</Button>
              )}
            </SlotActions>
          </SlotRow>

          <SlotRow>
            <SlotLabel>Sesudah ▶</SlotLabel>
            {loadingRelations ? <SlotEmpty>Memuat...</SlotEmpty>
              : nextRelation ? <SlotValue>{nextRelation.targetTitle}</SlotValue>
              : <SlotEmpty>Belum diatur</SlotEmpty>}
            <SlotActions>
              <Button size="small" variant="secondary" disabled={isSaving} onClick={() => openPicker('next')}>
                {activeSide === 'next' ? 'Sedang memilih...' : 'Atur'}
              </Button>
              {nextRelation && (
                <Button size="small" variant="danger" disabled={isSaving} onClick={() => handleUnlink('next')}>Hapus</Button>
              )}
            </SlotActions>
          </SlotRow>
        </Slots>

        {activeSide && (
          <>
            <Divider />
            <PickerHeader>
              Pilih Quiz Anatomi — <PickerFor>{activeSide === 'prev' ? 'Sebelum' : 'Sesudah'}</PickerFor>
            </PickerHeader>

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
                  const disabled = isLeaf && (isSelf(node) || isOtherSlot(node) || isSaving)

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
                        {isLeaf && isSelf(node) && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>(ini)</span>}
                        {isLeaf && isOtherSlot(node) && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>(sudah di slot lain)</span>}
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
