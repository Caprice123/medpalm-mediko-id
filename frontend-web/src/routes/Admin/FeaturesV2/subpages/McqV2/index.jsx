import TopicDetailPage from './pages/TopicDetailPage'
import UnlinkedQuestionsPage from './pages/UnlinkedQuestionsPage'
import TopicListPage from './pages/TopicListPage'
import { useMcqV2Admin } from './hooks/useMcqV2Admin'

function McqV2({ onBack }) {
  const {
    selectedNode, setSelectedNode,
    view,
    handleBack, handleViewUnlinked, handleViewTopics,
  } = useMcqV2Admin()

  if (selectedNode) {
    return <TopicDetailPage parentNode={selectedNode} onBack={handleBack} />
  }

  if (view === 'unlinked') {
    return <UnlinkedQuestionsPage onBack={handleViewTopics} />
  }

  return (
    <TopicListPage
      onBack={onBack}
      onSelectNode={setSelectedNode}
      onViewUnlinked={handleViewUnlinked}
    />
  )
}

export default McqV2
