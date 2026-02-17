import React from 'react'
import { formatRelativeTime } from '@utils/dateUtils'
import EmptyState from '@components/common/EmptyState'
import { ConversationListSkeleton } from '@components/common/SkeletonCard'
import {
  Container,
  ConversationItem,
  ConversationHeader,
  ConversationTopic,
  ConversationTime,
  ConversationPreview,
  LoadingContainer,
  LoadingSpinner
} from './ConversationList.styles'

const ConversationList = ({
  conversations = [],
  selectedConversationId = null,
  onConversationSelect,
  isLoading = false
}) => {

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
        <EmptyState
          icon="💬"
          title="Belum ada percakapan"
        />
      </Container>
    )
  }

  return (
    <Container>
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.uniqueId}
          $isSelected={selectedConversationId === conversation.uniqueId}
          onClick={() => onConversationSelect(conversation.uniqueId)}
        >
          <ConversationHeader>
            <ConversationTopic>{conversation.topic}</ConversationTopic>
            <ConversationTime>
              {formatRelativeTime(conversation.updatedAt || conversation.createdAt)}
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
