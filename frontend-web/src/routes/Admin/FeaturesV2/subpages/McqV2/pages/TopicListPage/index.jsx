import McqSettingsModal from '@routes/Admin/Features/subpages/MultipleChoice/components/McqSettingsModal'
import NodeFormModal from '@routes/Admin/FeaturesV2/subpages/FlashcardV2/components/NodeFormModal'
import TopicListHeader from './components/TopicListHeader'
import TopicFilterRow from './components/TopicFilterRow'
import TopicsTable from './components/TopicsTable'
import { useTopicListPage } from './hooks/useTopicListPage'
import { Container } from '../../McqV2.styles'

export default function TopicListPage({ onBack, onSelectNode, onViewUnlinked }) {
  const {
    modal, setModal,
    settingsOpen, setSettingsOpen,
    handleModalSuccess, handleDelete,
  } = useTopicListPage()

  return (
    <Container>
      <TopicListHeader
        onBack={onBack}
        onViewUnlinked={onViewUnlinked}
        onOpenSettings={() => setSettingsOpen(true)}
        onAddTopic={() => setModal({ open: true, node: null })}
      />

      <TopicFilterRow />

      <TopicsTable
        onSelectNode={onSelectNode}
        onEditNode={(node) => setModal({ open: true, node })}
        onDeleteNode={handleDelete}
      />

      {modal.open && (
        <NodeFormModal
          layer={1}
          node={modal.node}
          onClose={() => setModal({ open: false, node: null })}
          onSuccess={handleModalSuccess}
        />
      )}

      {settingsOpen && <McqSettingsModal onClose={() => setSettingsOpen(false)} />}
    </Container>
  )
}
