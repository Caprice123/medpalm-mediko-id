import React, { useState, useRef, useEffect, memo, useCallback } from 'react'
import { useAppDispatch } from '@store/store'
import { sendMessage, loadOlderMessages, stopStreaming } from '@store/skripsi/action'
import { selectMessagesForActiveTab, selectLoadingForActiveTab } from '@store/skripsi/reducer'
import { FaPaperPlane, FaStop } from 'react-icons/fa'
import { ChatbotLoadingIndicator, ChatbotMessagesSkeleton } from '@components/common/SkeletonCard'
import CustomMarkdownRenderer from '@components/common/CustomMarkdownRenderer/CustomMarkdownRenderer'
import {
  ChatPanel as StyledChatPanel,
  ChatHeader,
  ChatTitle,
  ChatMessages,
  Message,
  MessageBubble,
  MessageTime,
  ChatInputArea,
  ChatInputWrapper,
  ChatInput,
  SendButton,
  EmptyMessages,
  TypingIndicator,
  TypingDot
} from '../Editor.styles'
import { useSelector } from 'react-redux'

// Memoized message component - only rerenders when its own content changes
const ChatMessage = memo(({ message, formatTime }) => {
  // Check if this message is currently streaming (temp ID starting with 'streaming-')
  const isStreaming = message.id && message.id.toString().startsWith('streaming-')

  return (
    <Message $sender={message.senderType}>
      <MessageBubble $sender={message.senderType}>
        <CustomMarkdownRenderer item={message.content} isStreaming={isStreaming} />
      </MessageBubble>
      <MessageTime>{formatTime(message.createdAt)}</MessageTime>
    </Message>
  )
}, (prevProps, nextProps) => {
  // Only rerender if content or id changes
  return prevProps.message.content === nextProps.message.content &&
         prevProps.message.id === nextProps.message.id
})

// Memoized input section - manages its own state, isolated from parent
const ChatInputSection = memo(({
  onSendMessage,
  onStopStreaming,
  isSendingMessage,
  isStreaming
}) => {
  const [chatInput, setChatInput] = useState('')

  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    const message = chatInput.trim()
    setChatInput('')
    onSendMessage(message)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <ChatInputArea>
      <ChatInputWrapper>
        <ChatInput
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan... (Enter untuk kirim, Shift+Enter untuk baris baru)"
          disabled={isSendingMessage}
        />
        {isStreaming ? (
          <SendButton
            onClick={onStopStreaming}
            style={{ background: '#ef4444' }}
            title="Stop streaming"
          >
            <FaStop />
          </SendButton>
        ) : (
          <SendButton
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || isSendingMessage}
          >
            <FaPaperPlane />
          </SendButton>
        )}
      </ChatInputWrapper>
    </ChatInputArea>
  )
}, (prevProps, nextProps) => {
  // Only rerender if sending state or streaming state changes
  return prevProps.isSendingMessage === nextProps.isSendingMessage &&
         prevProps.isStreaming === nextProps.isStreaming
})

const ChatPanel = memo(({ currentTab, style }) => {
  const dispatch = useAppDispatch()
  const chatMessagesRef = useRef(null)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const previousScrollHeight = useRef(0)
  const previousMessageCountRef = useRef(0)
  const previousTabIdRef = useRef(null)

  // Get messages from cache using selector
  const messages = useSelector(selectMessagesForActiveTab)
  // Get per-tab loading state
  const tabLoading = useSelector(selectLoadingForActiveTab)
  const isSendingMessage = tabLoading.isSendingMessage || false
  const isInitialLoading = tabLoading.isMessagesLoading || false

  // Get streaming state from Redux (same pattern as chatbot)
  const streamingStateByTab = useSelector(state => state.skripsi.streamingStateByTab)
  const tabStreamingState = currentTab?.id ? (streamingStateByTab[currentTab.id] || null) : null

  // Check if currently streaming using Redux state
  const isStreaming = !!(tabStreamingState?.isSending || tabStreamingState?.isTyping)

  // Debug streaming state changes
  useEffect(() => {
    console.log(`🔄 Streaming state for tab ${currentTab?.id}:`, isStreaming, tabStreamingState)
  }, [isStreaming, currentTab?.id, tabStreamingState])

  // Only scroll to bottom when a NEW message is added or tab changes
  useEffect(() => {
    const currentMessageCount = messages.length
    const currentTabId = currentTab?.id

    // Scroll when:
    // 1. Tab changes (switching to a different tab)
    // 2. Message count increases (new message sent/received)
    if (currentTabId !== previousTabIdRef.current ||
        currentMessageCount > previousMessageCountRef.current) {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
      }
    }

    previousMessageCountRef.current = currentMessageCount
    previousTabIdRef.current = currentTabId
  }, [messages.length, currentTab?.id])

  // Reset hasMore when tab changes
  useEffect(() => {
    setHasMore(true)
  }, [currentTab?.id])

  // Handle scroll to detect when user scrolls to top
  const handleScroll = useCallback(async () => {
    if (!chatMessagesRef.current || !currentTab || !hasMore || isLoadingOlder) return

    const { scrollTop } = chatMessagesRef.current

    // If scrolled near the top (within 100px)
    if (scrollTop < 100) {
      if (messages.length === 0) return

      const oldestMessageId = messages[0]?.id
      if (!oldestMessageId) return

      try {
        setIsLoadingOlder(true)
        previousScrollHeight.current = chatMessagesRef.current.scrollHeight

        const result = await dispatch(loadOlderMessages(currentTab.id, oldestMessageId))

        setHasMore(result.hasMore)

        // Restore scroll position after loading
        if (chatMessagesRef.current) {
          const newScrollHeight = chatMessagesRef.current.scrollHeight
          const scrollDiff = newScrollHeight - previousScrollHeight.current
          chatMessagesRef.current.scrollTop = scrollTop + scrollDiff
        }
      } catch (error) {
        console.error('Failed to load older messages:', error)
      } finally {
        setIsLoadingOlder(false)
      }
    }
  }, [currentTab, messages, hasMore, isLoadingOlder, dispatch])

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = useCallback(async (userMessageText) => {
    if (!currentTab) return
    if (!userMessageText) return

    try {
      // Wait for streaming to complete (everything handled in Redux)
      console.log('📨 Sending message...')
      await dispatch(sendMessage(currentTab.id, userMessageText))
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [currentTab, dispatch])

  const handleStopStreaming = useCallback(async () => {
    if (!currentTab) return

    try {
      console.log('⏹️ User clicked stop button')
      await dispatch(stopStreaming(currentTab.id))
    } catch (error) {
      console.error('Failed to stop streaming:', error)
    }
  }, [currentTab, dispatch])

  return (
    <StyledChatPanel style={style}>
      <ChatMessages ref={chatMessagesRef} onScroll={handleScroll}>
        {isLoadingOlder && hasMore && (
          <ChatbotLoadingIndicator variant="spinner" />
        )}
        {isInitialLoading && messages.length === 0 ? (
          <ChatbotMessagesSkeleton messageCount={4} />
        ) : messages.length === 0 ? (
          <EmptyMessages>
            Belum ada percakapan. Mulai chat dengan AI untuk mendapatkan bantuan!
          </EmptyMessages>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <ChatMessage
                key={msg.id || idx}
                message={msg}
                formatTime={formatTime}
              />
            ))}
          </>
        )}
      </ChatMessages>

      <ChatInputSection
        key={currentTab?.id} // Reset input when tab changes
        onSendMessage={handleSendMessage}
        onStopStreaming={handleStopStreaming}
        isSendingMessage={isSendingMessage}
        isStreaming={isStreaming}
      />
    </StyledChatPanel>
  )
})

ChatPanel.displayName = 'ChatPanel'
ChatInputSection.displayName = 'ChatInputSection'
ChatMessage.displayName = 'ChatMessage'

export default ChatPanel
