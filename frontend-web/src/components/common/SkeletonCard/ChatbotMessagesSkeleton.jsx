import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  width: 100%;
`

const MessageBubbleContainer = styled.div`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  width: 100%;
`

const MessageBubbleSkeleton = styled.div`
  max-width: 70%;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: ${props => props.$isUser ? 'var(--color-gray-100)' : '#ffffff'};
  border-radius: 12px;
  border: 1px solid var(--color-gray-200);
`

const MessageFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
`

function ChatbotMessagesSkeleton({ messageCount = 4 }) {
  // Create alternating pattern of user and AI messages
  const messages = Array.from({ length: messageCount }).map((_, index) => ({
    isUser: index % 2 === 0
  }))

  return (
    <SkeletonContainer>
      {messages.map((message, index) => (
        <MessageBubbleContainer key={index} $isUser={message.isUser}>
          <MessageBubbleSkeleton $isUser={message.isUser}>
            {/* Message Content */}
            <Skeleton
              count={message.isUser ? 1 : 2}
              height={16}
              baseColor="var(--color-gray-200)"
              highlightColor="var(--color-gray-100)"
            />

            {/* Footer with timestamp and mode badge (only for AI messages) */}
            <MessageFooter>
              {!message.isUser && (
                <Skeleton
                  width={100}
                  height={20}
                  borderRadius={12}
                  baseColor="var(--color-gray-200)"
                  highlightColor="var(--color-gray-100)"
                />
              )}
              <Skeleton
                width={60}
                height={14}
                baseColor="var(--color-gray-200)"
                highlightColor="var(--color-gray-100)"
                style={{ marginLeft: 'auto' }}
              />
            </MessageFooter>

            {/* Sources section (occasionally for AI messages) */}
            {!message.isUser && index % 3 === 0 && (
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-gray-200)' }}>
                <Skeleton
                  width={80}
                  height={14}
                  baseColor="var(--color-gray-200)"
                  highlightColor="var(--color-gray-100)"
                  style={{ marginBottom: '0.5rem' }}
                />
                <Skeleton
                  count={2}
                  height={12}
                  baseColor="var(--color-gray-200)"
                  highlightColor="var(--color-gray-100)"
                />
              </div>
            )}
          </MessageBubbleSkeleton>
        </MessageBubbleContainer>
      ))}
    </SkeletonContainer>
  )
}

export default ChatbotMessagesSkeleton
