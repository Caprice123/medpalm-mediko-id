import UnlinkedCasesPage from './pages/UnlinkedCasesPage'
import NodeListPage from './pages/NodeListPage'
import CasesPage from './pages/CasesPage'
import { useDiagnosticV2Admin } from './hooks/useDiagnosticV2Admin'

export default function DiagnosticV2({ onBack }) {
  const {
    path, currentLayer, parentNode, inCases, showUnlinked,
    navigate, navigateTo, navigateToRoot, handleViewUnlinked, handleViewTopics,
  } = useDiagnosticV2Admin()

  if (showUnlinked) {
    return <UnlinkedCasesPage onBack={handleViewTopics} />
  }

  if (inCases) {
    return (
      <CasesPage
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
