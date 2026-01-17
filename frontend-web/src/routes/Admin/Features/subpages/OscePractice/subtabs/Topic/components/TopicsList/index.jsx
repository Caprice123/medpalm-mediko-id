import { useSelector } from 'react-redux'
import TopicCard from '../TopicCard'
import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  ActionButton,
  TopicsGrid
} from './TopicsList.styles'

function TopicsList({ onEdit, onDelete, onCreateFirst }) {
  const { topics, loading } = useSelector((state) => state.oscePractice)

  // Loading state
  if (loading?.isGetListTopicsLoading) {
    return <LoadingOverlay>Loading topics...</LoadingOverlay>
  }

  // Empty state
  if (topics.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>🏥</EmptyStateIcon>
        <EmptyStateText>Belum ada topic OSCE</EmptyStateText>
        {onCreateFirst && (
          <ActionButton onClick={onCreateFirst}>
            Buat Topic Pertama
          </ActionButton>
        )}
      </EmptyState>
    )
  }

  // Data state - render topics grid
  return (
    <TopicsGrid>
      {topics.map(topic => (
        <TopicCard
          key={topic.id}
          topic={topic}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </TopicsGrid>
  )
}

export default TopicsList
