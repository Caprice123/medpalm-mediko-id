import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'
import { Card, CardBody } from '@components/common/Card'

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

/**
 * Skeleton for Learning Content Cards (MCQ, Flashcard, Exercise, Anatomy Quiz)
 * @param {boolean} hasTwoButtons - Whether to show 2 buttons (for MCQ mode selection)
 * @param {number} statsCount - Number of stat items (2 or 3)
 */
export function LearningContentCardSkeleton({ hasTwoButtons = false, statsCount = 2 }) {
  return (
    <SkeletonWrapper>
      <Card shadow hoverable>
        <CardBody>
          {/* Title */}
          <Skeleton
            height={20}
            width="80%"
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
            style={{ marginBottom: '1rem' }}
          />

          {/* Description - 2 lines */}
          <Skeleton
            count={2}
            height={14}
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
            style={{ marginBottom: '0.75rem' }}
          />

          <div style={{ flex: 1, minHeight: '0.5rem' }} />

          {/* University Tags */}
          <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <Skeleton width={130} height={24} borderRadius={4} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
            <Skeleton width={110} height={24} borderRadius={4} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          </div>

          {/* Semester Tags */}
          <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <Skeleton width={120} height={24} borderRadius={4} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${statsCount}, 1fr)`,
            gap: '1rem',
            marginBottom: '1rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            {Array.from({ length: statsCount }).map((_, index) => (
              <div key={index}>
                <Skeleton height={12} width={50} baseColor="#e5e7eb" highlightColor="#f3f4f6" style={{ marginBottom: '0.25rem' }} />
                <Skeleton height={16} width={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
              </div>
            ))}
          </div>

          {/* Action Button(s) */}
          {hasTwoButtons ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Skeleton
                height={40}
                borderRadius={8}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
                style={{ flex: 1 }}
              />
              <Skeleton
                height={40}
                borderRadius={8}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
                style={{ flex: 1 }}
              />
            </div>
          ) : (
            <Skeleton
              height={40}
              borderRadius={8}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />
          )}
        </CardBody>
      </Card>
    </SkeletonWrapper>
  )
}

/**
 * Grid of Learning Content skeleton cards
 */
export function LearningContentSkeletonGrid({ count = 6, hasTwoButtons = false, statsCount = 2 }) {
  const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.25rem;
  `

  return (
    <ContentGrid>
      {Array.from({ length: count }).map((_, index) => (
        <LearningContentCardSkeleton key={index} hasTwoButtons={hasTwoButtons} statsCount={statsCount} />
      ))}
    </ContentGrid>
  )
}
