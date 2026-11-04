import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

const SkeletonTable = styled.div`
  width: 100%;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  overflow: hidden;
  background: white;
`

const SkeletonHeader = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr 120px 150px 120px 100px;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-gray-50);
  border-bottom: 2px solid var(--color-gray-200);
`

const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr 120px 150px 120px 100px;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-200);

  &:last-child {
    border-bottom: none;
  }
`

const SkeletonCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.$align || 'flex-start'};
`

function TopupTableSkeleton({ rowCount = 5 }) {
  return (
    <SkeletonTable>
      {/* Header */}
      <SkeletonHeader>
        <SkeletonCell>
          <Skeleton width={80} height={16} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
        </SkeletonCell>
        <SkeletonCell>
          <Skeleton width={60} height={16} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
        </SkeletonCell>
        <SkeletonCell $align="center">
          <Skeleton width={50} height={16} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
        </SkeletonCell>
        <SkeletonCell $align="flex-end">
          <Skeleton width={70} height={16} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
        </SkeletonCell>
        <SkeletonCell $align="center">
          <Skeleton width={60} height={16} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
        </SkeletonCell>
        <SkeletonCell $align="center">
          <Skeleton width={50} height={16} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
        </SkeletonCell>
      </SkeletonHeader>

      {/* Rows */}
      {Array.from({ length: rowCount }).map((_, index) => (
        <SkeletonRow key={index}>
          {/* Date column */}
          <SkeletonCell>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
              <Skeleton width="90%" height={14} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
              <Skeleton width="60%" height={12} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
            </div>
          </SkeletonCell>

          {/* Plan Name column */}
          <SkeletonCell>
            <Skeleton width="70%" height={16} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
          </SkeletonCell>

          {/* Type badge column */}
          <SkeletonCell $align="center">
            <Skeleton width={80} height={24} borderRadius={12} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
          </SkeletonCell>

          {/* Amount column */}
          <SkeletonCell $align="flex-end">
            <Skeleton width={100} height={16} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
          </SkeletonCell>

          {/* Status badge column */}
          <SkeletonCell $align="center">
            <Skeleton width={70} height={24} borderRadius={12} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
          </SkeletonCell>

          {/* Action button column */}
          <SkeletonCell $align="center">
            <Skeleton width={60} height={32} borderRadius={6} baseColor="var(--color-gray-200)" highlightColor="var(--color-gray-100)" />
          </SkeletonCell>
        </SkeletonRow>
      ))}
    </SkeletonTable>
  )
}

export default TopupTableSkeleton
