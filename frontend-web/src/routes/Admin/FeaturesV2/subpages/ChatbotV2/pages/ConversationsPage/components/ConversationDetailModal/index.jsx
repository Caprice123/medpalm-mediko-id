import Modal from '@components/common/Modal'
import Loading from '@components/common/Loading'
import EmptyState from '@components/common/EmptyState'
import { formatJakartaDateTimeFull } from '@utils/dateUtils'
import { useConversationDetailModal } from './hooks/useConversationDetailModal'
import {
  ConversationMeta,
  MetaText,
  MessagesScroller,
  MessagesContainer,
  OlderMessagesNote,
  MessageBubble,
  MessageHeader,
  MessageContent,
  MessageMeta,
  ModeBadge,
  SourcesSection,
  SourcesTitle,
  SourceItem,
  SourceTitle,
  SourceUrl,
} from './ConversationDetailModal.styles'

// Read-only transcript of one student's thread, for support and moderation.
const ConversationDetailModal = ({ conversation, isOpen, onClose }) => {
  const { messages, pagination, isFetching, scrollerRef, handleScroll } = useConversationDetailModal({
    conversation,
    isOpen,
  })

  const renderBody = () => {
    if (isFetching && messages.length === 0) {
      return <Loading text="Memuat pesan..." />
    }

    if (messages.length === 0) {
      return <EmptyState icon="💬" title="Belum ada pesan dalam percakapan ini" />
    }

    return (
      <MessagesScroller ref={scrollerRef} onScroll={handleScroll}>
        {isFetching && pagination.page > 1 && (
          <OlderMessagesNote>⏳ Memuat pesan lama...</OlderMessagesNote>
        )}

        <MessagesContainer>
          {messages.map((message) => {
            const isUser = message.senderType === 'user'

            return (
              <MessageBubble key={message.id} $isUser={isUser}>
                <MessageHeader>
                  {isUser ? 'User' : 'AI'}
                  {!isUser && message.modeType && (
                    <ModeBadge $mode={message.modeType}>{message.modeType}</ModeBadge>
                  )}
                </MessageHeader>

                <MessageContent $isUser={isUser}>{message.content}</MessageContent>

                {!isUser && message.sources?.length > 0 && (
                  <SourcesSection>
                    <SourcesTitle>Sumber ({message.sources.length})</SourcesTitle>
                    {message.sources.map((source, index) => (
                      <SourceItem key={source.id ?? index}>
                        <SourceTitle>{source.title || source.sourceType}</SourceTitle>
                        {source.url && (
                          <SourceUrl href={source.url} target="_blank" rel="noopener noreferrer">
                            {source.url}
                          </SourceUrl>
                        )}
                      </SourceItem>
                    ))}
                  </SourcesSection>
                )}

                <MessageMeta>
                  {formatJakartaDateTimeFull(message.createdAt)}
                  {!isUser && message.creditsUsed > 0 && <> • {message.creditsUsed} kredit</>}
                </MessageMeta>
              </MessageBubble>
            )
          })}
        </MessagesContainer>
      </MessagesScroller>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={conversation?.topic || 'Percakapan tanpa judul'}
      size="large"
    >
      <ConversationMeta>
        <MetaText>
          User: {conversation?.user?.name || 'Tidak diketahui'} ({conversation?.user?.email || 'Tanpa email'})
        </MetaText>
        <MetaText>Total pesan: {conversation?.messageCount ?? 0}</MetaText>
      </ConversationMeta>

      {renderBody()}
    </Modal>
  )
}

export default ConversationDetailModal
