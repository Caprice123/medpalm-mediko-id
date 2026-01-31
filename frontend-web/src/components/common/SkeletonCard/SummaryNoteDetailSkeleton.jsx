import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

const SkeletonWrapper = styled.div`
  .react-loading-skeleton {
    --base-color: #e5e7eb;
    --highlight-color: #f3f4f6;
    line-height: 1;
  }

  /* Ensure skeleton elements are visible */
  span.react-loading-skeleton {
    display: inline-block;
  }
`

const DetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const HeaderCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`

const ContentCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

/**
 * Skeleton for Summary Notes Detail page
 */
export function SummaryNoteDetailSkeleton() {
  return (
    <SkeletonWrapper>
      <DetailContainer>
        {/* Header Section */}
        <HeaderCard>
          <HeaderTop>
            {/* Back button */}
            <Skeleton width={100} height={36} borderRadius={6} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          </HeaderTop>

          {/* Title with icon */}
          <Skeleton
            height={28}
            width="60%"
            style={{ marginBottom: '0.5rem' }}
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
          />

          {/* Description */}
          <Skeleton
            count={2}
            height={14}
            style={{ marginBottom: '0.75rem' }}
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
          />

          {/* University Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <Skeleton width={130} height={28} borderRadius={12} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
            <Skeleton width={110} height={28} borderRadius={12} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          </div>

          {/* Semester Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Skeleton width={120} height={28} borderRadius={12} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          </div>
        </HeaderCard>

        {/* Content Section */}
        <ContentCard>
          {/* Simulating BlockNote content - Heading 1 */}
          <Skeleton
            height={24}
            width="40%"
            style={{ marginBottom: '1rem' }}
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
          />
          {/* Paragraph 1 */}
          <Skeleton
            count={3}
            height={16}
            style={{ marginBottom: '0.5rem' }}
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
          />

          {/* Heading 2 */}
          <div style={{ marginTop: '1.5rem' }}>
            <Skeleton
              height={24}
              width="35%"
              style={{ marginBottom: '1rem' }}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />
            {/* Paragraph 2 */}
            <Skeleton
              count={4}
              height={16}
              style={{ marginBottom: '0.5rem' }}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />
          </div>

          {/* Heading 3 */}
          <div style={{ marginTop: '1.5rem' }}>
            <Skeleton
              height={24}
              width="45%"
              style={{ marginBottom: '1rem' }}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />
            {/* Paragraph 3 */}
            <Skeleton
              count={3}
              height={16}
              style={{ marginBottom: '0.5rem' }}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />
          </div>

          {/* Additional paragraph */}
          <div style={{ marginTop: '1.5rem' }}>
            <Skeleton
              count={2}
              height={16}
              style={{ marginBottom: '0.5rem' }}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />
          </div>
        </ContentCard>
      </DetailContainer>
    </SkeletonWrapper>
  )
}
