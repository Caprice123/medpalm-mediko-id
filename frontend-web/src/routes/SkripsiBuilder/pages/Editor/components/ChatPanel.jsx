import React, { useState, useRef, useEffect, memo, useCallback } from 'react'
import { useAppDispatch } from '@store/store'
import { sendMessage, loadOlderMessages } from '@store/skripsi/action'
import { FaPaperPlane } from 'react-icons/fa'
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
  EmptyMessages
} from '../Editor.styles'

const ChatPanel = memo(({ currentTab, isSendingMessage }) => {
  const dispatch = useAppDispatch()
  const chatMessagesRef = useRef(null)
  const [chatInput, setChatInput] = useState('')
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const previousScrollHeight = useRef(0)

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

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !currentTab) return

    try {
      await dispatch(sendMessage(currentTab.id, chatInput.trim()))
      setChatInput('')
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Gagal mengirim pesan')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <StyledChatPanel>
      <ChatMessages ref={chatMessagesRef} onScroll={handleScroll}>
        {isLoadingOlder && hasMore && (
          <div style={{ textAlign: 'center', padding: '10px', color: '#9ca3af', fontSize: '13px' }}>
            Memuat pesan lama...
          </div>
        )}
        {currentTab?.messages?.length === 0 ? (
          <EmptyMessages>
            Belum ada percakapan. Mulai chat dengan AI untuk mendapatkan bantuan!
          </EmptyMessages>
        ) : (
          currentTab?.messages?.map((msg, idx) => (
            <Message key={msg.id || idx} $sender={msg.sender_type}>
              <MessageBubble $sender={msg.sender_type}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </MessageBubble>
              <MessageTime>{formatTime(msg.created_at)}</MessageTime>
            </Message>
          ))
        )}
      </ChatMessages>

      <ChatInputArea>
        <ChatInputWrapper>
          <ChatInput
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan... (Enter untuk kirim, Shift+Enter untuk baris baru)"
            disabled={isSendingMessage}
          />
          <SendButton
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || isSendingMessage}
          >
            <FaPaperPlane />
          </SendButton>
        </ChatInputWrapper>
      </ChatInputArea>
    </StyledChatPanel>
  )
})

ChatPanel.displayName = 'ChatPanel'

export default ChatPanel
