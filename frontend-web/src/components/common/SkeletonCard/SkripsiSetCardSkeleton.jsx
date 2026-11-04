import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  width: 100%;
`

const SkeletonCard = styled.div`
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const CardHeader = styled.div`
  padding-bottom: 1rem;
`

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`

const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`

export function SkripsiSetCardSkeleton() {
  return (
    <SkeletonCard>
      {/* Card Header - Title */}
      <CardHeader>
        <Skeleton
          width="70%"
          height={24}
          baseColor="var(--color-gray-200)"
          highlightColor="var(--color-gray-100)"
        />
      </CardHeader>

      {/* Card Body */}
      <CardBody>
        {/* Description */}
        <Skeleton
          count={2}
          height={16}
          baseColor="var(--color-gray-200)"
          highlightColor="var(--color-gray-100)"
        />

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Updated text */}
        <Skeleton
          width="60%"
          height={14}
          baseColor="var(--color-gray-200)"
          highlightColor="var(--color-gray-100)"
        />

        {/* Action buttons */}
        <CardActions>
          <Skeleton
            height={40}
            borderRadius={8}
            baseColor="var(--color-gray-200)"
            highlightColor="var(--color-gray-100)"
            style={{ flex: 1 }}
          />
          <Skeleton
            width={40}
            height={40}
            borderRadius={8}
            baseColor="var(--color-gray-200)"
            highlightColor="var(--color-gray-100)"
          />
        </CardActions>
      </CardBody>
    </SkeletonCard>
  )
}

export function SkripsiSetSkeletonGrid({ count = 6 }) {
  return (
    <SkeletonGrid>
      {Array.from({ length: count }).map((_, index) => (
        <SkripsiSetCardSkeleton key={index} />
      ))}
    </SkeletonGrid>
  )
}
