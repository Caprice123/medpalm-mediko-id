import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { formatLocalTime } from '@utils/dateUtils'
import { ChatbotMessagesSkeleton } from '@components/common/SkeletonCard'
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
  EmptyState,
} from './MessageList.styles'

const MODE_LABELS = {
  normal: { icon: '🤖', label: 'Normal Mode' },
  validated: { icon: '📚', label: 'Validated' },
  research: { icon: '🔍', label: 'Research Mode' },
}

const UNKNOWN_MODE = { icon: '💬', label: 'Unknown' }

const modeInfo = (mode) => MODE_LABELS[mode] || UNKNOWN_MODE

// Turns the bare citation markers the model writes — [1], [2] — into links to
// the matching source, so a claim can be checked without scrolling to the
// source list. The marker number is the source's 1-based position.
const linkCitations = (content, sources) => {
  if (!sources?.length) return content

  return sources.reduce((text, source, index) => {
    const number = index + 1
    // [[1]](url) rather than [1](url): the extra pair keeps the brackets
    // visible in the rendered output, the way a citation is normally written.
    return text.replace(new RegExp(`\\[${number}\\]`, 'g'), `[[${number}]](${source.url})`)
  }, content)
}

const isPlaceholder = (id) => Boolean(id) && id.toString().startsWith('streaming-')

const MessageItem = memo(({ message }) => {
  if (!message.content) return null

  if (message.senderType === 'user') {
    return (
      <MessageBubble $isUser>
        <UserMessage>
          <MessageContent>
            <CustomMarkdownRenderer item={message.content} isStreaming={false} />
          </MessageContent>
          <MessageFooter>
            <Timestamp>{formatLocalTime(message.createdAt)}</Timestamp>
          </MessageFooter>
        </UserMessage>
      </MessageBubble>
    )
  }

  const mode = modeInfo(message.modeType)

  return (
    <MessageBubble $isUser={false}>
      <AIMessage>
        <MessageContent>
          <CustomMarkdownRenderer
            item={linkCitations(message.content, message.sources)}
            isStreaming={isPlaceholder(message.id)}
          />
        </MessageContent>

        {message.sources?.length > 0 && (
          <SourcesSection>
            <div className="sources-title">📚 Sumber:</div>
            {message.sources.map((source, index) => (
              <React.Fragment key={source.url || index}>
                <SourceItem href={source.url} target="_blank" rel="noopener noreferrer">
                  [{index + 1}] {source.title || source.url}
                </SourceItem>
                <br />
              </React.Fragment>
            ))}
          </SourcesSection>
        )}

        <MessageFooter>
          <ModeBadge $mode={message.modeType}>
            <span>{mode.icon}</span>
            <span>{mode.label}</span>
          </ModeBadge>
          <Timestamp>{formatLocalTime(message.createdAt)}</Timestamp>
        </MessageFooter>
      </AIMessage>
    </MessageBubble>
  )
}, (prev, next) => {
  const a = prev.message
  const b = next.message

  // A streaming message changes content on every tick, so this comparison is
  // what keeps the rest of the thread from re-rendering with it.
  if (a.id !== b.id) return false
  if (a.content !== b.content) return false
  if (a.sources?.length !== b.sources?.length) return false
  if (a.status !== b.status) return false

  return (a.sources || []).every((source, index) => source?.url === b.sources?.[index]?.url)
})

const MessageList = ({ conversationId, isLoading, isStreaming }) => {
  const messages = useSelector(state => state.chatbotV2.messagesByConversation[conversationId] || [])

  if (isLoading) {
    return <ChatbotMessagesSkeleton messageCount={6} />
  }

  if (!messages.length) {
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
        <MessageItem key={message.id} message={message} />
      ))}

      {isStreaming && (
        <MessageBubble $isUser={false}>
          <AIMessage>
            <TypingIndicator>
              <TypingDot $delay="0s" />
              <TypingDot $delay="0.2s" />
              <TypingDot $delay="0.4s" />
            </TypingIndicator>
          </AIMessage>
        </MessageBubble>
      )}
    </Container>
  )
}

export default memo(MessageList)
