import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ThumbSkeleton = styled.div`
  height: 160px;
  flex-shrink: 0;
`

const Body = styled.div`
  padding: 1rem 1.25rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  flex: 1;
`

const Footer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #f3f4f6;
`

const S = { base: '#e5e7eb', highlight: '#f3f4f6' }

export function WebinarCardSkeleton() {
  return (
    <Card>
      <ThumbSkeleton>
        <Skeleton height={160} baseColor={S.base} highlightColor={S.highlight} style={{ display: 'block' }} />
      </ThumbSkeleton>
      <Body>
        <Skeleton height={18} width="75%" baseColor={S.base} highlightColor={S.highlight} />
        <Skeleton height={13} width="55%" baseColor={S.base} highlightColor={S.highlight} />
        <Skeleton height={13} width="65%" baseColor={S.base} highlightColor={S.highlight} />
        <Skeleton count={2} height={13} baseColor={S.base} highlightColor={S.highlight} />
      </Body>
      <Footer>
        <Skeleton height={36} borderRadius={6} baseColor={S.base} highlightColor={S.highlight} style={{ flex: 1 }} />
        <Skeleton height={36} borderRadius={6} baseColor={S.base} highlightColor={S.highlight} style={{ flex: 1 }} />
      </Footer>
    </Card>
  )
}

export function WebinarSkeletonGrid({ count = 6 }) {
  const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.25rem;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  `
  return (
    <Grid>
      {Array.from({ length: count }).map((_, i) => (
        <WebinarCardSkeleton key={i} />
      ))}
    </Grid>
  )
}
