import { useSelector } from 'react-redux'
import TopicCard from '../TopicCard'
import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  TopicsGrid
} from './TopicsList.styles'
import Button from '@components/common/Button'

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
          <Button variant="primary" onClick={onCreateFirst}>
            Buat Topic Pertama
          </Button>
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
