import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const TabBarSection = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
`

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`

const ScoreSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const ScoreCard = styled.div`
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const TableSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.$header ? '#f9fafb' : 'white'};
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`

function SessionResultSkeleton() {
  return (
    <SkeletonContainer>
      {/* Header with Back Button */}
      <HeaderSection>
        <Skeleton
          width={100}
          height={40}
          borderRadius={8}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
        />
      </HeaderSection>

      {/* Tab Bar */}
      <TabBarSection>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            width={100}
            height={40}
            borderRadius={8}
            baseColor="#e5e7eb"
            highlightColor="#f3f4f6"
          />
        ))}
      </TabBarSection>

      {/* Content */}
      <ContentSection>
        {/* Score Cards */}
        <ScoreSection>
          {Array.from({ length: 4 }).map((_, index) => (
            <ScoreCard key={index}>
              <Skeleton
                width="60%"
                height={16}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
              <Skeleton
                width="80%"
                height={32}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
              />
            </ScoreCard>
          ))}
        </ScoreSection>

        {/* Section Blocks */}
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <SectionBlock key={sectionIndex}>
            {/* Section Title */}
            <Skeleton
              width={200}
              height={24}
              baseColor="#e5e7eb"
              highlightColor="#f3f4f6"
            />

            {/* Table */}
            <TableSkeleton>
              {/* Table Header */}
              <TableRow $header>
                <Skeleton width="80%" height={16} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                <Skeleton width="60%" height={16} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                <Skeleton width="60%" height={16} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
              </TableRow>

              {/* Table Rows */}
              {Array.from({ length: 3 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  <Skeleton width="90%" height={16} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                  <Skeleton width="50%" height={16} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                  <Skeleton width="40%" height={16} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                </TableRow>
              ))}
            </TableSkeleton>
          </SectionBlock>
        ))}
      </ContentSection>
    </SkeletonContainer>
  )
}

export default SessionResultSkeleton
