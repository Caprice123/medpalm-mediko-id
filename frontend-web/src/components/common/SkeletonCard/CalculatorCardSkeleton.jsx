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
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

/**
 * Skeleton for Calculator Card
 */
export function CalculatorCardSkeleton() {
  return (
    <SkeletonWrapper>
      <Card>
        {/* Title */}
        <Skeleton
          height={22}
          width="75%"
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />

        {/* Description - 2 lines */}
        <Skeleton
          count={2}
          height={14}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
          style={{ marginBottom: '0.25rem' }}
        />

        {/* Kategori Tags */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Skeleton width={140} height={26} borderRadius={12} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
        </div>

        <div style={{ flex: 1, minHeight: '0.5rem' }} />

        {/* Stats Row - 2 items */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div>
            <Skeleton height={12} width={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" style={{ marginBottom: '0.25rem' }} />
            <Skeleton height={16} width={30} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          </div>
          <div>
            <Skeleton height={12} width={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" style={{ marginBottom: '0.25rem' }} />
            <Skeleton height={16} width={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          </div>
        </div>

        {/* Action Button */}
        <Skeleton
          height={40}
          borderRadius={8}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />
      </Card>
    </SkeletonWrapper>
  )
}

/**
 * Grid of Calculator skeleton cards
 */
export function CalculatorSkeletonGrid({ count = 6 }) {
  const CalculatorGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  `

  return (
    <CalculatorGrid>
      {Array.from({ length: count }).map((_, index) => (
        <CalculatorCardSkeleton key={index} />
      ))}
    </CalculatorGrid>
  )
}
