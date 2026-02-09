import { useSelector } from 'react-redux'
import EmptyState from '@components/common/EmptyState'
import {
  LoadingOverlay,
  ConversationsGrid,
  ConversationCard,
  ConversationHeader,
  ConversationTitle,
  UserInfo,
  UserName,
  UserEmail,
  ConversationStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
} from './ConversationsList.styles'
import Button from "@components/common/Button"

function ConversationsList({ onView, onDelete }) {
  const { conversations, loading } = useSelector((state) => state.chatbot)

  // Loading state
  if (loading?.isConversationsLoading) {
    return <LoadingOverlay>Memuat percakapan...</LoadingOverlay>
  }

  // Empty state
  if (conversations.length === 0) {
    return (
      <EmptyState
        icon="💬"
        title="Belum ada percakapan"
      />
    )
  }

  // Data state - render conversations grid
  return (
    <ConversationsGrid>
      {conversations.map(conversation => (
        <ConversationCard key={conversation.uniqueId} onClick={() => onView(conversation)}>
          <ConversationHeader>
            <ConversationTitle>{conversation.topic || 'Untitled Conversation'}</ConversationTitle>
          </ConversationHeader>

          {/* User Info */}
          <UserInfo>
            <UserName>{conversation.user?.name || 'Unknown User'}</UserName>
            <UserEmail>{conversation.user?.email || 'No email'}</UserEmail>
          </UserInfo>

          <div style={{ flex: "1" }}></div>

          <ConversationStats>
            <StatItem>
              <StatLabel>Pesan</StatLabel>
              <StatValue>{conversation.messageCount || 0}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Dibuat</StatLabel>
              <StatValue>
                {new Date(conversation.createdAt).toLocaleDateString("id-ID")}
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Diupdate</StatLabel>
              <StatValue>
                {new Date(conversation.updatedAt).toLocaleDateString("id-ID")}
              </StatValue>
            </StatItem>
          </ConversationStats>

          <CardActions>
            <Button variant="primary" fullWidth onClick={(e) => {
              e.stopPropagation()
              onView(conversation)
            }}>
              Lihat Pesan
            </Button>
            <Button variant="danger" fullWidth onClick={(e) => {
              e.stopPropagation()
              onDelete(conversation)
            }}>
              Hapus
            </Button>
          </CardActions>
        </ConversationCard>
      ))}
    </ConversationsGrid>
  )
}

export default ConversationsList
