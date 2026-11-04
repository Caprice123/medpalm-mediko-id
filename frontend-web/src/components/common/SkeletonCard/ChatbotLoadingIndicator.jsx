import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  gap: 0.75rem;
`

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-gray-200);
  border-top-color: var(--color-brand-blue);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const LoadingText = styled.div`
  color: var(--color-gray-500);
  font-size: 0.875rem;
  animation: ${pulse} 1.5s ease-in-out infinite;
`

const CompactMessageSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  width: 100%;
`

const MessageRow = styled.div`
  display: flex;
  justify-content: ${props => props.$align || 'flex-start'};
`

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 0.75rem;
  background: ${props => props.$isUser ? 'var(--color-gray-100)' : '#ffffff'};
  border-radius: 8px;
  border: 1px solid var(--color-gray-200);
`

function ChatbotLoadingIndicator({ variant = 'spinner' }) {
  if (variant === 'skeleton') {
    // Compact skeleton showing 1-2 message bubbles
    return (
      <CompactMessageSkeleton>
        <MessageRow $align="flex-start">
          <MessageBubble $isUser={false}>
            <Skeleton
              count={1}
              height={14}
              baseColor="var(--color-gray-200)"
              highlightColor="var(--color-gray-100)"
            />
          </MessageBubble>
        </MessageRow>
        <MessageRow $align="flex-end">
          <MessageBubble $isUser={true}>
            <Skeleton
              count={1}
              height={14}
              baseColor="var(--color-gray-200)"
              highlightColor="var(--color-gray-100)"
            />
          </MessageBubble>
        </MessageRow>
      </CompactMessageSkeleton>
    )
  }

  // Default: spinner with text
  return (
    <LoadingContainer>
      <Spinner />
      <LoadingText>Memuat pesan lama...</LoadingText>
    </LoadingContainer>
  )
}

export default ChatbotLoadingIndicator
