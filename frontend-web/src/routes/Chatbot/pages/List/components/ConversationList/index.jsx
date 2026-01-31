import React from 'react'
import { ConversationListSkeleton } from '@components/common/SkeletonCard'
import {
  Container,
  ConversationItem,
  ConversationHeader,
  ConversationTopic,
  ConversationTime,
  ConversationPreview,
  LoadingContainer,
  LoadingSpinner,
  EmptyState,
  EmptyIcon,
  EmptyText
} from './ConversationList.styles'

const ConversationList = ({
  conversations = [],
  selectedConversationId = null,
  onConversationSelect,
  isLoading = false
}) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMinutes < 1) return 'Baru saja'
    if (diffInMinutes < 60) return `${diffInMinutes}m yang lalu`
    if (diffInHours < 24) return `${diffInHours}j yang lalu`
    if (diffInDays < 7) return `${diffInDays}h yang lalu`

    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  if (isLoading) {
    return (
      <Container>
        <ConversationListSkeleton count={8} />
      </Container>
    )
  }

  if (!conversations || conversations.length === 0) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>
          <EmptyText>Belum ada percakapan</EmptyText>
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          $isSelected={selectedConversationId === conversation.id}
          onClick={() => onConversationSelect(conversation.id)}
        >
          <ConversationHeader>
            <ConversationTopic>{conversation.topic}</ConversationTopic>
            <ConversationTime>
              {formatTime(conversation.updatedAt || conversation.createdAt)}
            </ConversationTime>
          </ConversationHeader>
          {conversation.lastMessage && (
            <ConversationPreview>{conversation.lastMessage}</ConversationPreview>
          )}
        </ConversationItem>
      ))}
    </Container>
  )
}

export default ConversationList
