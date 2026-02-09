import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminConversationMessages } from '@store/chatbot/action'
import { actions } from '@store/chatbot/reducer'
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  HeaderContent,
  ModalTitle,
  UserInfo,
  UserText,
  CloseButton,
  ModalBody,
  LoadingState,
  EmptyState,
  MessagesContainer,
  MessageBubble,
  MessageHeader,
  MessageContent,
  MessageMeta,
  ModeBadge,
  SourcesSection,
  SourcesTitle,
  SourceItem,
  SourceTitle,
  SourceUrl
} from './ConversationDetailModal.styles'

function ConversationDetailModal({ conversation, isOpen, onClose }) {
  const dispatch = useDispatch()
  const { messages, loading, pagination } = useSelector(state => state.chatbot)

  const [currentPage, setCurrentPage] = useState(1)
  const messagesEndRef = useRef(null)
  const modalBodyRef = useRef(null)
  const previousScrollHeight = useRef(0)
  const isInitialScrollRef = useRef(false)

  const scrollToBottom = () => {
    // Try multiple methods to ensure scroll happens
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTop = modalBodyRef.current.scrollHeight
    }
  }

  useEffect(() => {
    if (isOpen && conversation?.uniqueId) {
      // Reset state when opening modal
      dispatch(actions.resetMessages())
      setCurrentPage(1)
      previousScrollHeight.current = 0
      isInitialScrollRef.current = true

      // Fetch initial messages
      dispatch(fetchAdminConversationMessages({
        conversationId: conversation.uniqueId,
        page: 1,
        perPage: 50,
        prepend: false
      })).then(() => {
        // Scroll to bottom after messages are loaded
        setTimeout(() => {
          scrollToBottom()
          // Allow scroll handling after initial scroll completes
          setTimeout(() => {
            isInitialScrollRef.current = false
          }, 1000)
        }, 200)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, conversation?.uniqueId, dispatch])

  useEffect(() => {
    // Auto scroll to bottom for page 1 (initial load)
    if (currentPage === 1 && messages.length > 0 && !loading.isMessagesLoading) {
      // Force scroll to bottom
      scrollToBottom()
    }
  }, [messages.length, currentPage, loading.isMessagesLoading])

  useEffect(() => {
    // Restore scroll position after loading older messages (page 2+)
    if (currentPage > 1 && modalBodyRef.current && previousScrollHeight.current > 0) {
      const newScrollHeight = modalBodyRef.current.scrollHeight
      const scrollDiff = newScrollHeight - previousScrollHeight.current
      modalBodyRef.current.scrollTop = scrollDiff
    }
  }, [messages, currentPage])

  const handleScroll = (e) => {
    const { scrollTop } = e.target

    // Don't load more during initial scroll or if already loading
    if (isInitialScrollRef.current || loading.isMessagesLoading || pagination.isLastPage) {
      return
    }

    // Load more when scrolled near top
    if (scrollTop < 100) {
      loadMoreMessages()
    }
  }

  const loadMoreMessages = async () => {
    if (modalBodyRef.current) {
      previousScrollHeight.current = modalBodyRef.current.scrollHeight
    }

    const nextPage = currentPage + 1
    setCurrentPage(nextPage)

    await dispatch(fetchAdminConversationMessages({
      conversationId: conversation.uniqueId,
      page: nextPage,
      perPage: 50,
      prepend: true // Signal to prepend instead of replace
    }))
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <ModalTitle>{conversation.topic || 'Untitled Conversation'}</ModalTitle>
            <UserInfo>
              <UserText>User: {conversation.user?.name || 'Unknown'} ({conversation.user?.email || 'No email'})</UserText>
              <UserText>Total Pesan: {conversation.messageCount || 0}</UserText>
            </UserInfo>
          </HeaderContent>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <ModalBody ref={modalBodyRef} onScroll={handleScroll}>
          {!pagination.isLastPage && (
            <div style={{ textAlign: 'center', padding: '10px', color: '#6b7280', fontSize: '13px' }}>
              {loading.isMessagesLoading && currentPage > 1 ? '⏳ Memuat pesan lama...' : ''}
            </div>
          )}

          {loading?.isMessagesLoading && currentPage === 1 ? (
            <LoadingState>Memuat pesan...</LoadingState>
          ) : messages.length === 0 ? (
            <EmptyState>Belum ada pesan dalam percakapan ini</EmptyState>
          ) : (
            <MessagesContainer>
              {messages.map((message) => {
                const isUser = message.senderType === 'user'
                return (
                  <MessageBubble key={message.id} isUser={isUser}>
                    <MessageHeader>
                      {isUser ? 'User' : 'AI'}
                      {!isUser && message.modeType && (
                        <>
                          {' • '}
                          <ModeBadge mode={message.modeType}>
                            {message.modeType}
                          </ModeBadge>
                        </>
                      )}
                    </MessageHeader>

                    <MessageContent isUser={isUser}>
                      {message.content}
                    </MessageContent>

                    {!isUser && message.sources && message.sources.length > 0 && (
                      <SourcesSection isUser={isUser}>
                        <SourcesTitle isUser={isUser}>
                          Sumber ({message.sources.length})
                        </SourcesTitle>
                        {message.sources.map((source, idx) => (
                          <SourceItem key={source.id || idx} isUser={isUser}>
                            <SourceTitle isUser={isUser}>
                              {source.title || source.sourceType}
                            </SourceTitle>
                            {source.url && (
                              <SourceUrl
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                isUser={isUser}
                              >
                                {source.url}
                              </SourceUrl>
                            )}
                          </SourceItem>
                        ))}
                      </SourcesSection>
                    )}

                    <MessageMeta>
                      {new Date(message.createdAt).toLocaleString('id-ID')}
                      {!isUser && message.creditsUsed > 0 && (
                        <> • {message.creditsUsed} kredit</>
                      )}
                    </MessageMeta>
                  </MessageBubble>
                )
              })}
              <div ref={messagesEndRef} />
            </MessagesContainer>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default ConversationDetailModal
