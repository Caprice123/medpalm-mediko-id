import { useEffect, useState, useRef, useCallback, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSessionMessages, loadMoreMessages } from '@store/oscePractice/userAction'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import CustomMarkdownRenderer from '@components/common/CustomMarkdownRenderer/CustomMarkdownRenderer'
import Button from '@components/common/Button'
import {
  Sidebar,
  MainContent,
  GuideSection,
  GuideTitle,
  GuideText,
  TaskSection,
  TaskHeader,
  TaskContent,
  MessageList,
  Message,
  MessageAuthor,
  MessageText,
  EmptyState,
} from '../../../../SessionPractice/SessionPractice.styles'
import {
  Container,
  AttachmentContainer,
  MessagesWrapper,
} from './styles'

function ChatsTab({ sessionId }) {
  const dispatch = useDispatch()
  const { sessionMessages, sessionDetail, loading, messagesPagination } = useSelector(state => state.oscePractice)
  const [isGuideVisible, setIsGuideVisible] = useState(true)
  const [isShowAttachment, setIsShowAttachment] = useState(false)
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0)
  const messageListRef = useRef(null)
  const messagesEndRef = useRef(null)
  const isLoadingMoreRef = useRef(false)

  useEffect(() => {
    if (sessionId) {
      console.log('[ChatsTab] Fetching messages for sessionId:', sessionId)
      dispatch(fetchSessionMessages(sessionId))
    }
  }, [sessionId, dispatch])

  // Debug: log when sessionMessages updates
  useEffect(() => {
    console.log('[ChatsTab] sessionMessages:', sessionMessages.length, sessionMessages)
  }, [sessionMessages])

  // Auto-scroll to bottom when messages load
  useEffect(() => {
    if (!loading.isLoadingSessionMessages && sessionMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
    }
  }, [loading.isLoadingSessionMessages, sessionMessages.length])

  const attachments = sessionDetail?.topic?.attachments || []

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
      messagesPagination?.hasMore &&
      !isLoadingMoreRef.current &&
      !loading.isLoadingSessionMessages &&
      messagesPagination?.nextCursor
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
  }, [sessionId, dispatch, messagesPagination, loading.isLoadingSessionMessages])

  // Add scroll listener
  useEffect(() => {
    const container = messageListRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  if (loading.isLoadingSessionMessages) {
    return (
      <Container>
        <EmptyState>
          Memuat riwayat percakapan...
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      {/* Left Sidebar */}
      <Sidebar>
        {/* Task Section */}
        {sessionDetail?.topic?.scenario && (
          <TaskSection>
            <TaskContent>
              <TaskHeader>Tugas</TaskHeader>
              <CustomMarkdownRenderer item={sessionDetail.topic.scenario.replace(/\\n/g, '\n\n')} />
            </TaskContent>
          </TaskSection>
        )}

        {/* Attachment Section */}
        {attachments.length > 0 && (
          <PhotoProvider
            visible={isShowAttachment}
            onVisibleChange={setIsShowAttachment}
            index={currentSliderIndex}
            onIndexChange={setCurrentSliderIndex}
          >
            <div style={{ padding: '0 1rem 1rem 1rem' }}>
              <AttachmentContainer>
                <Button variant="primary" onClick={() => setIsShowAttachment(true)}>
                  👁️ Gambar Kasus ({attachments.length})
                </Button>
                {attachments.map((img, i) => (
                  <PhotoView key={i} src={img.url}>
                    <img src={img.url} alt="" style={{ display: 'none' }} />
                  </PhotoView>
                ))}
              </AttachmentContainer>
            </div>
          </PhotoProvider>
        )}
      </Sidebar>

      {/* Right Main Content - Messages */}
      <MainContent>
        <MessagesWrapper>
          {/* Guide Section */}
          {sessionDetail?.topic?.guide && (
            <GuideSection>
              <GuideTitle onClick={() => setIsGuideVisible(!isGuideVisible)}>
                <span>{isGuideVisible ? '▼' : '▶'}</span>
                Panduan
              </GuideTitle>
              {isGuideVisible && (
                <GuideText>
                  {sessionDetail.topic.guide}
                </GuideText>
              )}
            </GuideSection>
          )}

          <MessageList ref={messageListRef} style={{
            flex: 1,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}>
            {sessionMessages.length === 0 ? (
              <EmptyState>
                💬 Belum ada percakapan dalam sesi ini.
              </EmptyState>
            ) : (
              <>
                {/* Loading indicator at top when loading more messages */}
                {loading.isLoadingMoreMessages && (
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

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </>
            )}
          </MessageList>
        </MessagesWrapper>
      </MainContent>
    </Container>
  )
}

const MessageComponent = memo(function MessageComponent({ message }) {
  const isUser = message.senderType === 'user' || message.isUser

  return (
    <Message isUser={isUser}>
      <MessageAuthor>
        {isUser ? 'Anda' : 'AI Pasien'}
      </MessageAuthor>
      <MessageText>
        <CustomMarkdownRenderer item={message.content || message.text || ''} />
      </MessageText>
    </Message>
  )
}, (prev, next) => {
  // Only rerender if content or id changes
  return prev.message.content === next.message.content &&
         prev.message.id === next.message.id
})

export default ChatsTab
