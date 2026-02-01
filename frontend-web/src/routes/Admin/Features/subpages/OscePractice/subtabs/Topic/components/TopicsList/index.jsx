import { useSelector } from 'react-redux'
import TopicCard from '../TopicCard'
import EmptyState from '@components/common/EmptyState'
import {
  LoadingOverlay,
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
      <EmptyState
        icon="🏥"
        title="Belum ada topic OSCE"
        actionLabel={onCreateFirst && "Buat Topic Pertama"}
        onAction={onCreateFirst}
        actionVariant="primary"
      />
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
