import { memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
import CustomMarkdownRenderer from '@components/common/CustomMarkdownRenderer/CustomMarkdownRenderer'
import { isAwaitingReply } from '../../utils/sessionState'
import { useMessageStream } from './hooks/useMessageStream'
import { List, Turn, Bubble, Speaker, Notice, OlderNotice, Typing } from './MessageStream.styles'

// One turn. Memoised on content and id because a streaming reply re-renders its own bubble
// many times a second, and the turns above it must not re-render with it.
const MessageTurn = memo(function MessageTurn({ message, speaker, isStreaming }) {
  const isUser = !!message.isUser

  return (
    <Turn $isUser={isUser}>
      <Bubble $isUser={isUser}>
        <Speaker $isUser={isUser}>{isUser ? 'Anda' : speaker}</Speaker>
        <CustomMarkdownRenderer
          item={message.content || message.text || ''}
          isStreaming={isStreaming}
        />
      </Bubble>
    </Turn>
  )
}, (previous, next) => (
  previous.message.content === next.message.content
  && previous.message.id === next.message.id
  && previous.isStreaming === next.isStreaming
))

function MessageStream({ isPhysicalExam }) {
  // Both transcripts are selected unconditionally and the mode picks between them. V1 put a
  // `useSelector` behind a `||`, which makes the hook order depend on a prop.
  const conversationMessages = useSelector((state) => state.oscePractice.sessionMessages)
  const physicalExamMessages = useSelector((state) => state.oscePractice.physicalExamMessages)
  const loading = useSelector((state) => state.oscePractice.loading)
  const conversationPagination = useSelector((state) => state.oscePractice.messagesPagination)
  const physicalExamPagination = useSelector((state) => state.oscePractice.physicalExamMessagesPagination)

  const allMessages = isPhysicalExam ? physicalExamMessages : conversationMessages
  const pagination = isPhysicalExam ? physicalExamPagination : conversationPagination

  // The streaming action puts an empty assistant message into the store the moment a reply is
  // requested, then types into it character by character. Empty, it is a placeholder rather
  // than a turn — rendering it draws a nameplate with nothing under it, above the dots bubble
  // that is already saying the same thing. It becomes a real turn as soon as it has text.
  // Memoised: this array is a dependency of the scrolling effects below, and a fresh
  // identity on every render would re-run them on every streamed character.
  const messages = useMemo(
    () => allMessages.filter(
      (message) => message.isUser || !!(message.content || message.text || '').trim(),
    ),
    [allMessages],
  )

  const isLoading = isPhysicalExam
    ? loading.isLoadingPhysicalExamMessages
    : loading.isLoadingSessionMessages
  const isLoadingOlder = isPhysicalExam
    ? loading.isLoadingMorePhysicalExamMessages
    : loading.isLoadingMoreMessages
  const isAnswering = isPhysicalExam
    ? loading.isSendingPhysicalExamMessage || loading.isPhysicalExamAssistantTyping
    : loading.isSendingMessage || loading.isAssistantTyping
  const isTyping = isPhysicalExam
    ? loading.isPhysicalExamAssistantTyping
    : loading.isAssistantTyping

  const { listRef, bottomRef } = useMessageStream({ messages, isPhysicalExam, isLoading, pagination })

  const speaker = isPhysicalExam ? 'Temuan fisik' : 'Pasien'
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null
  const lastId = lastMessage?.id ?? null

  // The dots mean "nothing has arrived yet". Once the reply has text, that text is the
  // progress, so a separate dots bubble beside it is a second speaker that does not exist.
  const showTypingBubble = isAwaitingReply(messages, isAnswering)

  return (
    <List ref={listRef}>
      {isLoading ? (
        <Notice>Memuat riwayat percakapan...</Notice>
      ) : messages.length === 0 ? (
        <Notice>
          {isPhysicalExam
            ? 'Tuliskan pemeriksaan yang ingin kamu lakukan, misalnya auskultasi paru atau periksa tanda vital. Sistem hanya mengembalikan temuan objektif.'
            : 'Mulai anamnesis dengan mengetik pertanyaan atau merekam suara. Pasien menjawab seperti pasien, bukan seperti buku teks.'}
        </Notice>
      ) : (
        <>
          {isLoadingOlder && <OlderNotice>Memuat pesan lama...</OlderNotice>}

          {messages.map((message) => (
            <MessageTurn
              key={message.id}
              message={message}
              speaker={speaker}
              // Only the final assistant turn streams; marking any other would re-render the
              // whole transcript on every token.
              isStreaming={!message.isUser && message.id === lastId && isTyping}
            />
          ))}

          {showTypingBubble && (
            <Turn $isUser={false}>
              <Bubble $isUser={false}>
                <Speaker $isUser={false}>{speaker}</Speaker>
                <Typing aria-label="Sedang menjawab"><i /><i /><i /></Typing>
              </Bubble>
            </Turn>
          )}

          <div ref={bottomRef} />
        </>
      )}
    </List>
  )
}

export default MessageStream
