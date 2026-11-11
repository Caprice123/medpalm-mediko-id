import { useSelector } from 'react-redux'
import EmptyState from '@components/common/EmptyState'
import Loading from '@components/common/Loading'
import Button from '@components/common/Button'
import { formatJakartaDateLong } from '@utils/dateUtils'
import {
  ConversationsGrid as Grid,
  ConversationCard,
  ConversationHeader,
  ConversationTitle,
  UserInfo,
  UserName,
  UserEmail,
  CardSpacer,
  ConversationStats,
  StatItem,
  StatLabel,
  StatValue,
  CardActions,
} from './ConversationsGrid.styles'

const ConversationsGrid = ({ onOpen, onDelete }) => {
  const conversations = useSelector(state => state.chatbotAdminV2.conversations)
  const isFetching = useSelector(state => state.chatbotAdminV2.loading.isFetchingConversations)

  // Only the very first fetch gets the full loading state; later pages keep the
  // rows on screen and show their spinner under the list instead.
  if (isFetching && conversations.length === 0) {
    return <Loading text="Memuat percakapan..." />
  }

  if (conversations.length === 0) {
    return <EmptyState icon="💬" title="Belum ada percakapan" />
  }

  return (
    <Grid>
      {conversations.map((conversation) => (
        <ConversationCard key={conversation.uniqueId} onClick={() => onOpen(conversation)}>
          <ConversationHeader>
            <ConversationTitle>{conversation.topic || 'Percakapan tanpa judul'}</ConversationTitle>
          </ConversationHeader>

          <UserInfo>
            <UserName>{conversation.user?.name || 'Pengguna tidak diketahui'}</UserName>
            <UserEmail>{conversation.user?.email || 'Tanpa email'}</UserEmail>
          </UserInfo>

          <CardSpacer />

          <ConversationStats>
            <StatItem>
              <StatLabel>Pesan</StatLabel>
              <StatValue>{conversation.messageCount ?? 0}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Dibuat</StatLabel>
              <StatValue>{formatJakartaDateLong(conversation.createdAt)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Diperbarui</StatLabel>
              <StatValue>{formatJakartaDateLong(conversation.updatedAt)}</StatValue>
            </StatItem>
          </ConversationStats>

          <CardActions>
            {/* The whole card opens the thread; these stop the click from
                reaching it so each button does only its own job. */}
            <Button
              variant="primary"
              fullWidth
              onClick={(e) => {
                e.stopPropagation()
                onOpen(conversation)
              }}
            >
              Lihat Pesan
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={(e) => {
                e.stopPropagation()
                onDelete(conversation)
              }}
            >
              Hapus
            </Button>
          </CardActions>
        </ConversationCard>
      ))}
    </Grid>
  )
}

export default ConversationsGrid
