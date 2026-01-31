import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'
import { Card, CardBody } from '@components/common/Card'

const SkeletonWrapper = styled.div`
  .react-loading-skeleton {
    --base-color: #e5e7eb;
    --highlight-color: #f3f4f6;
  }
`

/**
 * Skeleton for Summary Notes card (List view)
 */
export function SummaryNoteCardSkeleton() {
  return (
    <SkeletonWrapper>
      <Card shadow hoverable>
        <CardBody>
          {/* Title */}
          <Skeleton
            height={20}
            width="75%"
            style={{ marginBottom: '1rem' }}
          />

          {/* Description - 2 lines */}
          <Skeleton
            count={2}
            height={14}
            style={{ marginBottom: '0.75rem' }}
          />

          {/* University Tags */}
          <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.5rem' }}>
            <Skeleton width={120} height={24} borderRadius={4} />
            <Skeleton width={100} height={24} borderRadius={4} />
          </div>

          {/* Semester Tags */}
          <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.5rem' }}>
            <Skeleton width={110} height={24} borderRadius={4} />
          </div>

          {/* Updated text */}
          <Skeleton
            height={12}
            width="60%"
            style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
          />

          {/* Button */}
          <Skeleton
            height={40}
            borderRadius={8}
            style={{ marginTop: '0.5rem' }}
          />
        </CardBody>
      </Card>
    </SkeletonWrapper>
  )
}

/**
 * Grid of Summary Note skeleton cards
 */
export function SummaryNoteSkeletonGrid({ count = 6 }) {
  const NotesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.25rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `

  return (
    <NotesGrid>
      {Array.from({ length: count }).map((_, index) => (
        <SummaryNoteCardSkeleton key={index} />
      ))}
    </NotesGrid>
  )
}
