import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFilteredNodes } from '@store/featureNodes'
import { fetchAtlasModelsForNode, fetchNodeAtlasRelations, addNodeAtlasRelation, removeNodeAtlasRelation } from '@store/nodeAtlas/adminAction'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import {
  LinkedList, LinkedItem, LinkedTitle, EmptyLinked, AddRow,
  Nav, NavLink, NavCurrent, NavSep,
  FolderList, FolderRow, FolderIcon, FolderName, Chevron, EmptyState,
} from './SubtopicAtlasModelModal.styles'

export default function SubtopicAtlasModelModal({ subtopic, onClose }) {
  const dispatch = useDispatch()

  const [linkedModels, setLinkedModels] = useState([])
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
      const data = await dispatch(fetchNodeAtlasRelations(subtopic.slug))
      setLinkedModels(data)
    } finally {
      setLoadingRelations(false)
    }
  }

  useEffect(() => { loadRelations() }, [subtopic.slug])

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
    setIsSaving(true)
    try {
      await dispatch(addNodeAtlasRelation(subtopic.slug, model.uniqueId))
      await loadRelations()
      setPickerOpen(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUnlink = async (relation) => {
    setIsSaving(true)
    try {
      await dispatch(removeNodeAtlasRelation(relation.id))
      setLinkedModels(prev => prev.filter(r => r.id !== relation.id))
    } finally {
      setIsSaving(false)
    }
  }

  const isAlreadyLinked = (node) => linkedModels.some(r => r.targetUniqueId === node.uniqueId)
  const isLeaf = level === 'models'

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Model 3D Atlas — ${subtopic.name}`}
      size="medium"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
        </div>
      }
    >
      <LinkedList>
        {loadingRelations ? (
          <EmptyLinked>Memuat...</EmptyLinked>
        ) : linkedModels.length === 0 ? (
          <EmptyLinked>Belum ada model 3D Atlas yang ditautkan.</EmptyLinked>
        ) : (
          linkedModels.map(rel => (
            <LinkedItem key={rel.id}>
              <LinkedTitle>{rel.targetTitle}</LinkedTitle>
              <Button size="small" variant="danger" disabled={isSaving} onClick={() => handleUnlink(rel)}>Hapus</Button>
            </LinkedItem>
          ))
        )}
      </LinkedList>

      <AddRow>
        <Button size="small" variant="secondary" disabled={isSaving || loadingRelations} onClick={openPicker}>
          + Tambah Model 3D Atlas
        </Button>
      </AddRow>

      {pickerOpen && (
        <Modal
          isOpen
          onClose={() => setPickerOpen(false)}
          title="Pilih Model 3D Atlas"
          size="medium"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setPickerOpen(false)}>Tutup</Button>
            </div>
          }
        >
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
                      else handleLinkModel(node)
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
        </Modal>
      )}
    </Modal>
  )
}
