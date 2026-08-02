import NodeDetailPage from './pages/NodeDetailPage'
import UnlinkedCardsPage from './pages/UnlinkedCardsPage'
import TopicListPage from './pages/TopicListPage'
import { useFlashcardAdmin } from './hooks/useFlashcardAdmin'

function FlashcardV2({ onBack }) {
  const {
    selectedNode, setSelectedNode,
    view,
    handleBack, handleViewUnlinked, handleViewTopics,
  } = useFlashcardAdmin()

  if (selectedNode) {
    return <NodeDetailPage parentNode={selectedNode} onBack={handleBack} />
  }

  if (view === 'unlinked') {
    return <UnlinkedCardsPage onBack={handleViewTopics} />
  }

  return (
    <TopicListPage
      onBack={onBack}
      onSelectNode={setSelectedNode}
      onViewUnlinked={handleViewUnlinked}
    />
  )
}

export default FlashcardV2
