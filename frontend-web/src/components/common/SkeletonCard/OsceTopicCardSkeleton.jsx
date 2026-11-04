import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

const SkeletonWrapper = styled.div`
  .react-loading-skeleton {
    --base-color: var(--color-gray-200);
    --highlight-color: var(--color-gray-100);
    line-height: 1;
  }

  span.react-loading-skeleton {
    display: inline-block;
  }
`

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 320px;
`

/**
 * Skeleton for OSCE Topic Card
 */
export function OsceTopicCardSkeleton() {
  return (
    <SkeletonWrapper>
      <Card>
        {/* Card Title */}
        <Skeleton
          height={24}
          width="85%"
          baseColor="var(--color-gray-200)"
          highlightColor="var(--color-gray-100)"
        />

        {/* Description - 2 lines */}
        <Skeleton
          count={2}
          height={14}
          baseColor="var(--color-gray-200)"
          highlightColor="var(--color-gray-100)"
          style={{ marginBottom: '0.25rem' }}
        />

        <div style={{ flex: 1 }} />

        {/* Topic Tags */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Skeleton width={130} height={26} borderRadius={12} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
          <Skeleton width={110} height={26} borderRadius={12} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
        </div>

        {/* Batch Tags */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Skeleton width={120} height={26} borderRadius={12} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
        </div>

        {/* Stats Row - 3 items */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginTop: '0.5rem'
        }}>
          <div>
            <Skeleton height={12} width={50} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" style={{ marginBottom: '0.25rem' }} />
            <Skeleton height={14} width={70} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
          </div>
          <div>
            <Skeleton height={12} width={50} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" style={{ marginBottom: '0.25rem' }} />
            <Skeleton height={14} width={60} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
          </div>
          <div>
            <Skeleton height={12} width={50} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" style={{ marginBottom: '0.25rem' }} />
            <Skeleton height={14} width={70} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
          </div>
        </div>

        {/* Action Button */}
        <Skeleton
          height={40}
          borderRadius={8}
          baseColor="var(--color-gray-200)"
          highlightColor="var(--color-gray-100)"
        />
      </Card>
    </SkeletonWrapper>
  )
}

/**
 * Grid of OSCE Topic skeleton cards
 */
export function OsceTopicSkeletonGrid({ count = 6 }) {
  const TopicsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  `

  return (
    <TopicsGrid>
      {Array.from({ length: count }).map((_, index) => (
        <OsceTopicCardSkeleton key={index} />
      ))}
    </TopicsGrid>
  )
}
