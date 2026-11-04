import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ConversationItemSkeleton = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-200);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: white;

  &:hover {
    background: var(--color-gray-50);
  }
`

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

function ConversationListSkeleton({ count = 8 }) {
  return (
    <SkeletonContainer>
      {Array.from({ length: count }).map((_, index) => (
        <ConversationItemSkeleton key={index}>
          {/* Header with topic and time */}
          <HeaderRow>
            {/* Topic */}
            <Skeleton
              width={150}
              height={18}
              baseColor="var(--color-gray-200)"
              highlightColor="var(--color-gray-100)"
            />
            {/* Time */}
            <Skeleton
              width={80}
              height={14}
              baseColor="var(--color-gray-200)"
              highlightColor="var(--color-gray-100)"
            />
          </HeaderRow>

          {/* Last message preview */}
          <Skeleton
            width="85%"
            height={14}
            baseColor="var(--color-gray-200)"
            highlightColor="var(--color-gray-100)"
          />
        </ConversationItemSkeleton>
      ))}
    </SkeletonContainer>
  )
}

export default ConversationListSkeleton
