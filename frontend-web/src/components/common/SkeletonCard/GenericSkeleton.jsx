import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'
import { Card, CardBody } from '@components/common/Card'

const SkeletonWrapper = styled.div`
  .react-loading-skeleton {
    --base-color: var(--color-gray-200);
    --highlight-color: var(--color-gray-100);
  }
`

/**
 * Generic skeleton card component
 * Use this for simple card layouts
 */
export function SkeletonCard({
  rows = 3,
  showImage = false,
  imageHeight = 150,
  showButton = false
}) {
  return (
    <SkeletonWrapper>
      <Card shadow>
        <CardBody>
          {showImage && (
            <Skeleton
              height={imageHeight}
              style={{ marginBottom: '1rem' }}
            />
          )}

          <Skeleton
            height={20}
            width="60%"
            style={{ marginBottom: '0.75rem' }}
          />

          <Skeleton
            count={rows}
            height={14}
            style={{ marginBottom: '0.5rem' }}
          />

          {showButton && (
            <>
              <div style={{ marginTop: '1rem' }} />
              <Skeleton height={40} borderRadius={8} />
            </>
          )}
        </CardBody>
      </Card>
    </SkeletonWrapper>
  )
}
