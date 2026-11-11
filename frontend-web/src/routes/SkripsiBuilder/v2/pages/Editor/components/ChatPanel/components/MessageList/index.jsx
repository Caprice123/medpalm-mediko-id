import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { formatLocalTime } from '@utils/dateUtils'
import { ChatbotMessagesSkeleton, ChatbotLoadingIndicator } from '@components/common/SkeletonCard'
import CustomMarkdownRenderer from '@components/common/CustomMarkdownRenderer/CustomMarkdownRenderer'
import { selectMessagesForTab } from '@store/skripsi/v2/reducer'
import {
  Message,
  UserMessage,
  AIMessage,
  MessageContent,
  MessageFooter,
  Timestamp,
  ModeBadge,
  SourcesSection,
  SourceItem,
  EmptyMessages,
  TypingIndicator,
  TypingDot,
} from './MessageList.styles'

const MODE_LABELS = {
  research: { icon: '🔍', label: 'Research Mode' },
  validated: { icon: '📚', label: 'Validated' },
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

const ChatMessage = memo(({ message }) => {
  if (!message.content) return null

  if (message.senderType === 'user') {
    return (
      <Message $sender="user">
        <UserMessage>
          <MessageContent>
            <CustomMarkdownRenderer item={message.content} isStreaming={false} />
          </MessageContent>
          <MessageFooter>
            <Timestamp>{formatLocalTime(message.createdAt)}</Timestamp>
          </MessageFooter>
        </UserMessage>
      </Message>
    )
  }

  const streaming = isPlaceholder(message.id)
  const mode = modeInfo(message.modeType)

  return (
    <Message $sender="ai">
      <AIMessage>
        <MessageContent>
          <CustomMarkdownRenderer
            item={streaming ? message.content : linkCitations(message.content, message.sources)}
            isStreaming={streaming}
          />
        </MessageContent>

        {!streaming && message.sources?.length > 0 && (
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

        {/* The footer is held back while streaming: a mode badge and timestamp
            under a half-written answer read as though it had finished. */}
        {!streaming && (
          <MessageFooter>
            <ModeBadge $mode={message.modeType}>
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </ModeBadge>
            <Timestamp>{formatLocalTime(message.createdAt)}</Timestamp>
          </MessageFooter>
        )}
      </AIMessage>
    </Message>
  )
}, (prev, next) => {
  const a = prev.message
  const b = next.message

  // A streaming message changes content on every tick, so this comparison is
  // what keeps the rest of the thread from re-rendering with it.
  if (a.id !== b.id) return false
  if (a.content !== b.content) return false
  if (a.modeType !== b.modeType) return false
  if (a.sources?.length !== b.sources?.length) return false

  return (a.sources || []).every((source, index) => source?.url === b.sources?.[index]?.url)
})

ChatMessage.displayName = 'ChatMessage'

const MessageList = ({ tabId, isLoading, isLoadingOlder, isStreaming }) => {
  const messages = useSelector(state => selectMessagesForTab(state, tabId))

  if (isLoading && messages.length === 0) {
    return <ChatbotMessagesSkeleton messageCount={4} />
  }

  if (messages.length === 0) {
    return (
      <EmptyMessages>
        Belum ada percakapan. Mulai chat dengan AI untuk mendapatkan bantuan!
      </EmptyMessages>
    )
  }

  return (
    <>
      {isLoadingOlder && <ChatbotLoadingIndicator variant="spinner" />}

      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {isStreaming && (
        <Message $sender="ai">
          <AIMessage>
            <TypingIndicator>
              <TypingDot $delay="0s" />
              <TypingDot $delay="0.2s" />
              <TypingDot $delay="0.4s" />
            </TypingIndicator>
          </AIMessage>
        </Message>
      )}
    </>
  )
}

export default memo(MessageList)
