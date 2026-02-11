import { useEffect, useRef, useCallback, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPhysicalExamMessages, loadMorePhysicalExamMessages } from '@store/oscePractice/userAction'
import {
  Sidebar,
  MainContent,
  TaskSection,
  TaskHeader,
  TaskContent,
  MessageList,
  Message,
  MessageAuthor,
  MessageText,
  EmptyState,
} from '../../../../SessionPractice/SessionPractice.styles'
import CustomMarkdownRenderer from '@components/common/CustomMarkdownRenderer/CustomMarkdownRenderer'
import PhysicalExamGuideline from '../../../../SessionPractice/components/PhysicalExaminationTab/subcomponents/PhysicalExamGuideline'
import { Container, MessagesWrapper } from './styles'

function PhysicalExamTab({ sessionId }) {
  const dispatch = useDispatch()
  const { physicalExamMessages, sessionDetail, loading, physicalExamMessagesPagination } = useSelector(state => state.oscePractice)
  const messageListRef = useRef(null)
  const messagesEndRef = useRef(null)
  const isLoadingMoreRef = useRef(false)

  useEffect(() => {
    if (sessionId) {
      console.log('[PhysicalExamTab Result] Fetching messages for sessionId:', sessionId)
      dispatch(fetchPhysicalExamMessages(sessionId))
    }
  }, [sessionId, dispatch])

  // Auto-scroll to bottom when messages load (instant, not smooth)
  useEffect(() => {
    if (!loading.isLoadingPhysicalExamMessages && physicalExamMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' })
    }
  }, [loading.isLoadingPhysicalExamMessages, physicalExamMessages.length])

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
      physicalExamMessagesPagination?.hasMore &&
      !isLoadingMoreRef.current &&
      !loading.isLoadingPhysicalExamMessages &&
      physicalExamMessagesPagination?.nextCursor
    ) {
      isLoadingMoreRef.current = true

      // Save current scroll position
      const previousScrollHeight = container.scrollHeight
      const previousScrollTop = container.scrollTop

      try {
        await dispatch(loadMorePhysicalExamMessages(sessionId, physicalExamMessagesPagination.nextCursor))

        // Restore scroll position after loading (so user stays in same place)
        setTimeout(() => {
          const newScrollHeight = container.scrollHeight
          const heightDifference = newScrollHeight - previousScrollHeight
          container.scrollTop = previousScrollTop + heightDifference
        }, 50)
      } catch (error) {
        console.error('Error loading more messages:', error)
      } finally {
        isLoadingMoreRef.current = false
      }
    }
  }, [sessionId, dispatch, physicalExamMessagesPagination, loading.isLoadingPhysicalExamMessages])

  // Add scroll listener
  useEffect(() => {
    const container = messageListRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  if (loading.isLoadingPhysicalExamMessages) {
    return (
      <Container>
        <EmptyState>
          Memuat riwayat pemeriksaan fisik...
        </EmptyState>
      </Container>
    )
  }

  // Get guideline from topic
  const guideline = sessionDetail?.topic?.physicalExamGuideline

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
      </Sidebar>

      {/* Right Main Content - Messages */}
      <MainContent>
        <MessagesWrapper>
          <PhysicalExamGuideline guideline={guideline} />

          <MessageList ref={messageListRef} style={{
            flex: 1,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}>
            {physicalExamMessages.length === 0 ? (
              <EmptyState>
                🔬 Belum ada pemeriksaan fisik dalam sesi ini.
              </EmptyState>
            ) : (
              <>
                {/* Loading indicator at top when loading more messages */}
                {loading.isLoadingMorePhysicalExamMessages && (
                  <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    color: '#9ca3af',
                    fontSize: '0.875rem'
                  }}>
                    Memuat pesan lama...
                  </div>
                )}

                {physicalExamMessages.map(message => (
                  <PhysicalExamMessageComponent key={message.id} message={message} />
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

const PhysicalExamMessageComponent = memo(function PhysicalExamMessageComponent({ message }) {
  const isUser = message.isUser

  return (
    <Message isUser={isUser}>
      <MessageAuthor>
        {isUser ? 'Anda' : 'Sistem'}
      </MessageAuthor>
      <MessageText>
        <CustomMarkdownRenderer item={message.content || ''} />
      </MessageText>
    </Message>
  )
}, (prev, next) => {
  // Only rerender if content or id changes
  return prev.message.content === next.message.content &&
         prev.message.id === next.message.id
})

export default memo(PhysicalExamTab)
