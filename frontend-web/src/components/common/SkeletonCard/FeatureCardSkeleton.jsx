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

const CardBodyContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const SkeletonSpacer = styled.div`
  flex: 1;
  min-height: 1rem;
`

const SkeletonFooter = styled.div`
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
`

/**
 * Skeleton loader for feature cards (Dashboard)
 */
export function FeatureCardSkeleton() {
  return (
    <SkeletonWrapper>
      <Card shadow hoverable>
        <CardBody>
          <CardBodyContent>
            {/* Icon skeleton */}
            <Skeleton
              width={60}
              height={60}
              borderRadius={12}
              style={{ marginBottom: '1rem' }}
            />

            {/* Title skeleton */}
            <Skeleton
              height={24}
              width="70%"
              style={{ marginBottom: '0.5rem' }}
            />

            {/* Description skeleton - 2 lines */}
            <Skeleton
              count={2}
              height={14}
              style={{ marginBottom: '1rem' }}
            />

            {/* Spacer - matches flex: 1 in real card */}
            <SkeletonSpacer />

            {/* Badge skeleton */}
            <Skeleton
              width={120}
              height={28}
              borderRadius={8}
              style={{ marginBottom: '1rem' }}
            />

            {/* Requirements skeleton - 2 items */}
            <div style={{ marginBottom: '1rem' }}>
              <Skeleton
                height={16}
                width="85%"
                style={{ marginBottom: '0.375rem' }}
              />
              <Skeleton
                height={16}
                width="80%"
              />
            </div>

            {/* Footer with button */}
            <SkeletonFooter>
              <Skeleton
                height={40}
                borderRadius={8}
              />
            </SkeletonFooter>
          </CardBodyContent>
        </CardBody>
      </Card>
    </SkeletonWrapper>
  )
}

/**
 * Grid of feature skeleton cards
 */
export function FeatureCardSkeletonGrid({ count = 6 }) {
  const SkeletonGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  `

  return (
    <SkeletonGrid>
      {Array.from({ length: count }).map((_, index) => (
        <FeatureCardSkeleton key={index} />
      ))}
    </SkeletonGrid>
  )
}
