import UnlinkedQuestionsPage from './pages/UnlinkedQuestionsPage'
import NodeListPage from './pages/NodeListPage'
import QuestionsPage from './pages/QuestionsPage'
import { useDiagnosticV2Admin } from './hooks/useDiagnosticV2Admin'

export default function DiagnosticV2({ onBack }) {
  const {
    path, currentLayer, parentNode, inQuestions, showUnlinked,
    navigate, navigateTo, navigateToRoot, handleViewUnlinked, handleViewTopics,
  } = useDiagnosticV2Admin()

  if (showUnlinked) {
    return <UnlinkedQuestionsPage onBack={handleViewTopics} />
  }

  if (inQuestions) {
    return (
      <QuestionsPage
        path={path}
        parentNode={parentNode}
        onBack={() => navigateTo(path.length - 1)}
        onNavigateRoot={navigateToRoot}
        onNavigateTo={navigateTo}
      />
    )
  }

  return (
    <NodeListPage
      path={path}
      currentLayer={currentLayer}
      parentNode={parentNode}
      onBack={path.length === 0 ? onBack : () => navigateTo(path.length - 1)}
      onNavigateRoot={navigateToRoot}
      onNavigateTo={navigateTo}
      onNavigateInto={navigate}
      onViewUnlinked={handleViewUnlinked}
    />
  )
}
