import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`

const FilterTabsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 8px;
  flex-wrap: wrap;
`

const PlansGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`

const PlanCardSkeleton = styled.div`
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

function CreditPurchaseSkeleton({ planCount = 6 }) {
  return (
    <SkeletonContainer>
      {/* Filter Tabs */}
      <FilterTabsContainer>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            width={100}
            height={36}
            borderRadius={8}
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
          />
        ))}
      </FilterTabsContainer>

      {/* Plans Grid */}
      <PlansGridContainer>
        {Array.from({ length: planCount }).map((_, index) => (
          <PlanCardSkeleton key={index}>
            {/* Popular Badge (only on some cards) */}
            {index % 3 === 0 && (
              <Skeleton
                width={100}
                height={20}
                borderRadius={12}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
            )}

            {/* Plan Name */}
            <Skeleton
              width="80%"
              height={24}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />

            {/* Plan Credits */}
            <Skeleton
              width="60%"
              height={32}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />

            {/* Plan Price */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Skeleton
                width="70%"
                height={28}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              {index % 2 === 0 && (
                <Skeleton
                  width={80}
                  height={20}
                  borderRadius={12}
                  baseColor="#e5e7eb"
                  highlightColor="#f3f4f6"
                />
              )}
            </div>

            {/* Description */}
            <Skeleton
              count={2}
              height={14}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Purchase Button */}
            <Skeleton
              height={40}
              borderRadius={8}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />
          </PlanCardSkeleton>
        ))}
      </PlansGridContainer>
    </SkeletonContainer>
  )
}

export default CreditPurchaseSkeleton
