import { useState } from 'react'

export function useAnatomyAtlasV2Admin() {
  const [view, setView] = useState('tree') // 'tree' | 'unlinkedAtlas' | 'unlinkedAnatomy'
  const [path, setPath] = useState([])
  const [nodeModal, setNodeModal] = useState({ open: false, node: null })
  const [settingsOpen, setSettingsOpen] = useState(false)

  const currentLayer = path.length + 1
  const parentNode = path.length > 0 ? path[path.length - 1] : null
  const isModuleDetail = path.length === 2

  const navigateInto = (node) => setPath(prev => [...prev, node])
  const navigateTo = (index) => setPath(prev => prev.slice(0, index))
  const navigateToRoot = () => setPath([])
  const handleViewUnlinkedAtlas = () => setView('unlinkedAtlas')
  const handleViewUnlinkedAnatomy = () => setView('unlinkedAnatomy')
  const handleViewTree = () => setView('tree')

  return {
    view, path, currentLayer, parentNode, isModuleDetail,
    navigateInto, navigateTo, navigateToRoot,
    handleViewUnlinkedAtlas, handleViewUnlinkedAnatomy, handleViewTree,
    nodeModal, setNodeModal,
    settingsOpen, setSettingsOpen,
  }
}
