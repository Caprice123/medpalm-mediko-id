import { memo, useRef, useEffect, useCallback } from 'react'
import {
  MessageList,
  Message,
  MessageAuthor,
  MessageText,
  EmptyState,
  TypingIndicator,
  TypingDot,
  StreamingCursor,
} from '../../../../SessionPractice.styles'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { loadMoreMessages } from '../../../../../../../store/oscePractice/userAction'

const MessageListComponent = () => {
  const { sessionId } = useParams()
  const dispatch = useDispatch()
  const sessionMessages = useSelector(state => state.oscePractice.sessionMessages)
  const isLoadingMessage = useSelector(state => state.oscePractice.loading.isLoadingSessionMessages)
  const isLoadingMoreMessages = useSelector(state => state.oscePractice.loading.isLoadingMoreMessages)
  const isSendingMessage = useSelector(state => state.oscePractice.loading.isSendingMessage)
  const messagesPagination = useSelector(state => state.oscePractice.messagesPagination)
  const messagesEndRef = useRef(null)
  const messageListRef = useRef(null)
  const prevMessagesLengthRef = useRef(0)
  const prevLastMessageContentRef = useRef('')
  const wasLoadingRef = useRef(false)
  const isLoadingMoreRef = useRef(false)

  // Check if there's a streaming message
  const hasStreamingMessage = sessionMessages.some(msg =>
    msg.id && msg.id.toString().startsWith('streaming-')
  )

  // Show typing indicator if sending but no streaming message yet (waiting for AI to start)
  const showTypingIndicator = isSendingMessage && !hasStreamingMessage

  // Instant scroll to bottom when loading completes (tab switch)
  useEffect(() => {
    // When loading finishes (was loading, now not loading)
    if (wasLoadingRef.current && !isLoadingMessage && sessionMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
      prevMessagesLengthRef.current = sessionMessages.length
      prevLastMessageContentRef.current = sessionMessages[sessionMessages.length - 1]?.content || ''
    }

    // Track loading state
    wasLoadingRef.current = isLoadingMessage
  }, [isLoadingMessage, sessionMessages])

  // Smooth scroll when new messages arrive or streaming updates
  useEffect(() => {
    // Don't scroll if currently loading
    if (isLoadingMessage) return

    const lastMessage = sessionMessages[sessionMessages.length - 1]
    const currentLastMessageContent = lastMessage?.content || ''

    // Smooth scroll if:
    // 1. New message was added (length increased)
    // 2. Last message content changed (streaming update)
    const shouldScroll =
      sessionMessages.length > prevMessagesLengthRef.current ||
      currentLastMessageContent !== prevLastMessageContentRef.current

    if (shouldScroll) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }

    // Update refs
    prevMessagesLengthRef.current = sessionMessages.length
    prevLastMessageContentRef.current = currentLastMessageContent
  }, [sessionMessages, isLoadingMessage])

  // Infinite scroll: load more messages when scrolling near top
  const handleScroll = useCallback(async () => {
    const container = messageListRef.current
    if (!container) return

    // Check if scrolled near top (within 200px)
    const threshold = 200
    const isNearTop = container.scrollTop < threshold

    // Load more if:
    // 1. Near top
    // 2. Has more messages
    // 3. Not currently loading
    // 4. Not loading initial messages
    if (
      isNearTop &&
      messagesPagination.hasMore &&
      !isLoadingMoreRef.current &&
      !isLoadingMessage &&
      messagesPagination.nextCursor
    ) {
      isLoadingMoreRef.current = true

      // Save current scroll position
      const previousScrollHeight = container.scrollHeight
      const previousScrollTop = container.scrollTop

      try {
        const loadedCount = await dispatch(loadMoreMessages(sessionId, messagesPagination.nextCursor))

        // Restore scroll position after loading (so user stays in same place)
        if (loadedCount > 0) {
          setTimeout(() => {
            const newScrollHeight = container.scrollHeight
            const heightDifference = newScrollHeight - previousScrollHeight
            container.scrollTop = previousScrollTop + heightDifference
          }, 50)
        }
      } catch (error) {
        console.error('Error loading more messages:', error)
      } finally {
        isLoadingMoreRef.current = false
      }
    }
  }, [sessionId, dispatch, messagesPagination, isLoadingMessage])

  // Add scroll listener
  useEffect(() => {
    const container = messageListRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <MessageList ref={messageListRef}>
      {isLoadingMessage ? (
        <EmptyState>
          Memuat riwayat percakapan...
        </EmptyState>
      ) : sessionMessages.length === 0 ? (
        <EmptyState>
          Mulai percakapan dengan mengetik pesan atau merekam audio
        </EmptyState>
      ) : (
        <>
          {/* Loading indicator at top when loading more messages */}
          {isLoadingMoreMessages && (
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              color: '#9ca3af',
              fontSize: '0.875rem'
            }}>
              Memuat pesan lama...
            </div>
          )}

          {sessionMessages.map(message => (
            <MessageComponent key={message.id} message={message} />
          ))}

          {showTypingIndicator && (
            <Message isUser={false}>
              <MessageAuthor>AI Pasien</MessageAuthor>
              <MessageText>
                <TypingIndicator>
                  <TypingDot delay="0s" />
                  <TypingDot delay="0.2s" />
                  <TypingDot delay="0.4s" />
                </TypingIndicator>
              </MessageText>
            </Message>
          )}

          {/* Scroll anchor - inside MessageList for proper scrolling */}
          <div ref={messagesEndRef} />
        </>
      )}
    </MessageList>
  )
}

const MessageComponent = memo(function MessageComponent({ message }) {
  return (
    <Message isUser={message.isUser}>
      <MessageAuthor>
        {message.isUser ? 'Anda' : 'AI Pasien'}
      </MessageAuthor>
      <MessageText>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content || message.text || ''}
        </ReactMarkdown>
        {message.id && message.id.toString().startsWith('streaming-') && (
          <StreamingCursor>▊</StreamingCursor>
        )}
      </MessageText>
    </Message>
  )
}, (prev, next) => {
  // Only rerender if content or id changes
  return prev.message.content === next.message.content &&
         prev.message.id === next.message.id
})

export default MessageListComponent
