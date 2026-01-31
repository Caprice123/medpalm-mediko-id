import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

const SkeletonWrapper = styled.div`
  .react-loading-skeleton {
    --base-color: #e5e7eb;
    --highlight-color: #f3f4f6;
    line-height: 1;
  }

  span.react-loading-skeleton {
    display: inline-block;
  }
`

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

/**
 * Skeleton for OSCE Session/History Card
 */
export function OsceSessionCardSkeleton() {
  return (
    <SkeletonWrapper>
      <Card>
        {/* Topic Title */}
        <Skeleton
          height={24}
          width="80%"
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />

        {/* Status Badge */}
        <Skeleton
          width={140}
          height={24}
          borderRadius={12}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />

        {/* Topic tags row */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
          <Skeleton width={60} height={16} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          <Skeleton width={120} height={16} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
        </div>

        {/* Batch tags row */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Skeleton width={60} height={16} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          <Skeleton width={100} height={16} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
        </div>

        {/* Score and time row */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <Skeleton width={80} height={18} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          <Skeleton width={90} height={18} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
        </div>

        <div style={{ flex: 1 }} />

        {/* Action Button */}
        <Skeleton
          height={40}
          borderRadius={8}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
          style={{ marginTop: '0.5rem' }}
        />
      </Card>
    </SkeletonWrapper>
  )
}

/**
 * Grid of OSCE Session skeleton cards
 */
export function OsceSessionSkeletonGrid({ count = 6 }) {
  const SessionsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.25rem;
  `

  return (
    <SessionsGrid>
      {Array.from({ length: count }).map((_, index) => (
        <OsceSessionCardSkeleton key={index} />
      ))}
    </SessionsGrid>
  )
}
