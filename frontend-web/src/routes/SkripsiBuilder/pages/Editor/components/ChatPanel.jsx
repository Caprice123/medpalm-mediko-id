import React, { useState, useRef, useEffect, memo, useCallback } from 'react'
import { useAppDispatch } from '@store/store'
import { sendMessage, loadOlderMessages, stopStreaming } from '@store/skripsi/action'
import { actions } from '@store/skripsi/reducer'
import { FaPaperPlane, FaStop } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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

// Memoized message component - only rerenders when its own content changes
const ChatMessage = memo(({ message, formatTime }) => (
  <Message $sender={message.senderType}>
    <MessageBubble $sender={message.senderType}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {message.content}
      </ReactMarkdown>
    </MessageBubble>
    <MessageTime>{formatTime(message.createdAt)}</MessageTime>
  </Message>
), (prevProps, nextProps) => {
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

const ChatPanel = memo(({ currentTab, isSendingMessage }) => {
  const dispatch = useAppDispatch()
  const chatMessagesRef = useRef(null)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const previousScrollHeight = useRef(0)

  // Local streaming state for AI message only
  const [streamingMessage, setStreamingMessage] = useState(null)
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)

  // Scroll to bottom when new messages arrive or tab changes
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [currentTab?.messages?.length, currentTab?.id])

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
      const messages = currentTab.messages || []
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
  }, [currentTab, hasMore, isLoadingOlder, dispatch])

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = useCallback(async (userMessageText) => {
    if (!currentTab) return

    try {
      // Create and immediately show user message in Redux
      const tempUserMsg = {
        id: `temp-user-${Date.now()}`,
        sender_type: 'user',
        content: userMessageText,
        created_at: new Date().toISOString()
      }

      // Add user message to Redux immediately so it shows right away
      dispatch(actions.addMessage({ tabId: currentTab.id, message: tempUserMsg }))

      // Show waiting indicator
      setIsWaitingForResponse(true)

      // Prepare temp AI message for streaming
      const tempAiMsg = {
        id: `temp-ai-${Date.now()}`,
        sender_type: 'ai',
        content: '',
        created_at: new Date().toISOString()
      }

      let firstChunkReceived = false

      // Callback for streaming updates - updates local state only
      const handleStreamUpdate = (content) => {
        // Show AI message on first chunk (response started)
        if (!firstChunkReceived) {
          firstChunkReceived = true
          setIsWaitingForResponse(false) // Hide waiting indicator
          setStreamingMessage({ ...tempAiMsg, content })
        } else {
          // Update AI message content for subsequent chunks
          setStreamingMessage(prev => prev ? { ...prev, content } : null)
        }
      }

      // Wait for streaming to complete (including typing animation)
      const finalData = await dispatch(sendMessage(currentTab.id, userMessageText, handleStreamUpdate))

      // Clear local streaming state
      setStreamingMessage(null)

      // Remove temp user message and add final messages from server
      if (finalData) {
        // Remove the temp user message we added
        dispatch(actions.removeMessage({ tabId: currentTab.id, messageId: tempUserMsg.id }))

        // Add final messages with real IDs from server
        if (finalData.userMessage) {
          dispatch(actions.addMessage({ tabId: currentTab.id, message: finalData.userMessage }))
        }
        if (finalData.aiMessage) {
          dispatch(actions.addMessage({ tabId: currentTab.id, message: finalData.aiMessage }))
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setIsWaitingForResponse(false)
      setStreamingMessage(null)
      alert('Gagal mengirim pesan')
    }
  }, [currentTab, dispatch])

  const handleStopStreaming = useCallback(async () => {
    if (!currentTab || !streamingMessage) return

    try {
      // Stop the stream and save partial content
      const savedMessage = await dispatch(stopStreaming(currentTab.id, streamingMessage.content))

      // Add the saved message to Redux with real ID from backend
      if (savedMessage) {
        dispatch(actions.addMessage({
          tabId: currentTab.id,
          message: {
            id: savedMessage.id,
            sender_type: savedMessage.sender_type,
            content: savedMessage.content,
            created_at: savedMessage.created_at
          }
        }))
      }

      // Clear streaming state
      setStreamingMessage(null)
      setIsWaitingForResponse(false)
    } catch (error) {
      console.error('Failed to stop streaming:', error)
    }
  }, [currentTab, streamingMessage, dispatch])

  return (
    <StyledChatPanel>
      <ChatMessages ref={chatMessagesRef} onScroll={handleScroll}>
        {isLoadingOlder && hasMore && (
          <div style={{ textAlign: 'center', padding: '10px', color: '#9ca3af', fontSize: '13px' }}>
            Memuat pesan lama...
          </div>
        )}
        {currentTab?.messages?.length === 0 && !streamingMessage ? (
          <EmptyMessages>
            Belum ada percakapan. Mulai chat dengan AI untuk mendapatkan bantuan!
          </EmptyMessages>
        ) : (
          <>
            {currentTab?.messages?.map((msg, idx) => (
              <ChatMessage
                key={msg.id || idx}
                message={msg}
                formatTime={formatTime}
              />
            ))}
            {isWaitingForResponse && (
              <Message $sender="ai">
                <MessageBubble $sender="ai">
                  <TypingIndicator>
                    <TypingDot delay="0s" />
                    <TypingDot delay="0.2s" />
                    <TypingDot delay="0.4s" />
                  </TypingIndicator>
                </MessageBubble>
              </Message>
            )}
            {streamingMessage && (
              <ChatMessage
                key={streamingMessage.id}
                message={streamingMessage}
                formatTime={formatTime}
              />
            )}
          </>
        )}
      </ChatMessages>

      <ChatInputSection
        key={currentTab?.id} // Reset input when tab changes
        onSendMessage={handleSendMessage}
        onStopStreaming={handleStopStreaming}
        isSendingMessage={isSendingMessage}
        isStreaming={!!streamingMessage}
      />
    </StyledChatPanel>
  )
})

ChatPanel.displayName = 'ChatPanel'

export default ChatPanel
