import { memo, useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import CustomMarkdownRenderer from '@components/common/CustomMarkdownRenderer/CustomMarkdownRenderer'
import {
  Container,
  MessageBubble,
  UserMessage,
  AIMessage,
  MessageContent,
  MessageFooter,
  Timestamp,
  ModeBadge,
  SourcesSection,
  SourceItem,
  TypingIndicator,
  TypingDot,
  EmptyState
} from './MessageList.styles'

// Memoized individual message component - only re-renders when its own data changes
const MessageItem = memo(({ message, formatTime, getModeInfo, processContentWithCitations }) => {
    if (!message.content) return null
    return (
    <MessageBubble key={message.id} isUser={message.senderType === 'user'}>
      {message.senderType === 'user' ? (
        <UserMessage>
          <MessageContent>
            <CustomMarkdownRenderer item={message.content} />
          </MessageContent>
          <MessageFooter>
            <Timestamp>{formatTime(message.createdAt)}</Timestamp>
          </MessageFooter>
        </UserMessage>
      ) : (
        <AIMessage>
          <MessageContent>
            <CustomMarkdownRenderer item={processContentWithCitations(message.content, message.sources)} />
          </MessageContent>

          {message.sources && message.sources.length > 0 && (
            <SourcesSection>
              <div className="sources-title">📚 Sumber:</div>
              {message.sources.map((source, index) => (
                <>
                    <SourceItem href={source.url} key={index} target='_blank'>
                    [{index + 1}] {source.title || source.url}
                    </SourceItem>
                    <br />
                </>
              ))}
            </SourcesSection>
          )}

          <MessageFooter>
            <ModeBadge mode={message.modeType}>
              <span>{getModeInfo(message.modeType).icon}</span>
              <span>{getModeInfo(message.modeType).label}</span>
            </ModeBadge>
            <Timestamp>{formatTime(message.createdAt)}</Timestamp>
          </MessageFooter>
        </AIMessage>
      )}
    </MessageBubble>
  )
}, (prevProps, nextProps) => {
  // Return true to SKIP re-render, false to re-render
  const prev = prevProps.message
  const next = nextProps.message

  // If ID changed, it's a different message - re-render
  if (prev.id !== next.id) return false

  // If content changed - re-render
  if (prev.content !== next.content) return false

  // Deep compare sources array
  if (prev.sources?.length !== next.sources?.length) return false

  // If both have sources, compare URLs (shallow check is enough for streaming)
  if (prev.sources && next.sources && prev.sources.length > 0) {
    for (let i = 0; i < prev.sources.length; i++) {
      if (prev.sources[i]?.url !== next.sources[i]?.url) return false
    }
  }

  // Props are the same - skip re-render
  return true
})

function MessageList({ isLoading, isSending }) {
  // Subscribe to messages directly in MessageList to prevent parent re-renders
  const messages = useSelector(state => state.chatbot.messages)
  const messagesEndRef = useRef(null)

  // Auto scroll to bottom when messages change or when sending
  useEffect(() => {
    if (messages.length > 0 || isSending) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [messages, isSending])

  // Memoize helper functions to prevent unnecessary re-renders
  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }, [])

  const getModeInfo = useCallback((mode) => {
    switch (mode) {
      case 'normal':
        return { icon: '🤖', label: 'Normal Mode' }
      case 'validated':
        return { icon: '📚', label: 'Validated' }
      case 'research':
        return { icon: '🔍', label: 'Research Mode' }
      default:
        return { icon: '💬', label: 'Unknown' }
    }
  }, [])

  // Process content to add inline citation links
  const processContentWithCitations = useCallback((content, sources) => {
    if (!sources || sources.length === 0) {
      return content
    }

    // Replace [1], [2], etc. with clickable links
    // Use [[1]] as link text so brackets are visible
    let processed = content
    sources.forEach((source, index) => {
      const citationNumber = index + 1
      const citationPattern = new RegExp(`\\[${citationNumber}\\]`, 'g')
      const citationLink = `[[${citationNumber}]](${source.url})`
      processed = processed.replace(citationPattern, citationLink)
    })

    return processed
  }, [])

  if (isLoading) {
    return (
      <EmptyState>
        <div>⏳</div>
        <div>Memuat pesan...</div>
      </EmptyState>
    )
  }

  if (!messages || messages.length === 0) {
    return (
      <EmptyState>
        <div>💬</div>
        <div>Mulai percakapan dengan mengetik pesan</div>
      </EmptyState>
    )
  }

  return (
    <Container>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          formatTime={formatTime}
          getModeInfo={getModeInfo}
          processContentWithCitations={processContentWithCitations}
        />
      ))}

      {isSending && (
        <MessageBubble isUser={false}>
          <AIMessage>
            <TypingIndicator>
              <TypingDot delay="0s" />
              <TypingDot delay="0.2s" />
              <TypingDot delay="0.4s" />
            </TypingIndicator>
          </AIMessage>
        </MessageBubble>
      )}

      {/* Scroll anchor - moved inside MessageList */}
      <div ref={messagesEndRef} />
    </Container>
  )
}

export default memo(MessageList)
