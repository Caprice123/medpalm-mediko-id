import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const DetailGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`

const DetailItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

function TransactionDetailSkeleton() {
  return (
    <SkeletonContainer>
      {/* Package Information Section */}
      <Section>
        {/* Section Title */}
        <Skeleton
          width={180}
          height={20}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />

        {/* Detail Grid */}
        <DetailGridContainer>
          {Array.from({ length: 5 }).map((_, index) => (
            <DetailItemContainer key={index}>
              {/* Label */}
              <Skeleton
                width={100}
                height={14}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              {/* Value */}
              {index === 2 ? (
                // Type badge
                <Skeleton
                  width={90}
                  height={24}
                  borderRadius={12}
                  baseColor="#e5e7eb"
                  highlightColor="#f3f4f6"
                />
              ) : (
                <Skeleton
                  width="80%"
                  height={16}
                  baseColor="#e5e7eb"
                  highlightColor="#f3f4f6"
                />
              )}
            </DetailItemContainer>
          ))}
        </DetailGridContainer>
      </Section>

      {/* Payment Information Section */}
      <Section>
        {/* Section Title */}
        <Skeleton
          width={200}
          height={20}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />

        {/* Detail Grid */}
        <DetailGridContainer>
          {Array.from({ length: 5 }).map((_, index) => (
            <DetailItemContainer key={index}>
              {/* Label */}
              <Skeleton
                width={120}
                height={14}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              {/* Value */}
              {index === 3 ? (
                // Status badge
                <Skeleton
                  width={80}
                  height={24}
                  borderRadius={12}
                  baseColor="#e5e7eb"
                  highlightColor="#f3f4f6"
                />
              ) : (
                <Skeleton
                  width={index === 1 ? "60%" : "70%"}
                  height={index === 1 ? 18 : 16}
                  baseColor="#e5e7eb"
                  highlightColor="#f3f4f6"
                />
              )}
            </DetailItemContainer>
          ))}
        </DetailGridContainer>
      </Section>

      {/* Payment Evidence Section (optional, shown sometimes) */}
      <Section>
        {/* Section Title */}
        <Skeleton
          width={160}
          height={20}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />

        {/* Evidence List */}
        {Array.from({ length: 1 }).map((_, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: '#f9fafb'
            }}
          >
            {/* File Icon */}
            <Skeleton
              width={40}
              height={40}
              borderRadius={8}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />

            {/* File Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <Skeleton
                width="60%"
                height={16}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              <Skeleton
                width="40%"
                height={12}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
            </div>

            {/* View Button */}
            <Skeleton
              width={60}
              height={32}
              borderRadius={6}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />
          </div>
        ))}
      </Section>

      {/* Action Buttons (optional) */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <Skeleton
          width={180}
          height={44}
          borderRadius={8}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />
      </div>
    </SkeletonContainer>
  )
}

export default TransactionDetailSkeleton
