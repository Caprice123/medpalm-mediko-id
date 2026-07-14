import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;

  .react-loading-skeleton {
    --base-color: #e5e7eb;
    --highlight-color: #f3f4f6;
    line-height: 1;
  }
`

const TopBarSkeleton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  background: white;
`

const BreadcrumbRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Sep = styled.span`
  color: #d1d5db;
  font-size: 0.8125rem;
`

const ContentArea = styled.div`
  padding: 1.5rem 2rem;
  background: #fdfcf8;
  min-height: calc(100vh - 70px);
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 2rem 0;
`

const BulletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1.25rem;
`

const BulletItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`

function Para({ widths }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
      {widths.map((w, i) => (
        <Skeleton key={i} height={16} width={w} borderRadius={4} />
      ))}
    </div>
  )
}

function SectionHeading({ width = '40%', size = 22 }) {
  return <Skeleton height={size} width={width} borderRadius={4} style={{ marginBottom: '0.875rem' }} />
}

export function NotePanelLoadingSkeleton() {
  return (
    <Wrapper>
      {/* TopBar */}
      <TopBarSkeleton>
        <BreadcrumbRow>
          <Skeleton width={80} height={14} borderRadius={4} />
          <Sep>/</Sep>
          <Skeleton width={100} height={14} borderRadius={4} />
          <Sep>/</Sep>
          <Skeleton width={140} height={14} borderRadius={4} />
        </BreadcrumbRow>
        <Skeleton width={120} height={30} borderRadius={6} />
      </TopBarSkeleton>

      {/* Content area */}
      <ContentArea>
        {/* Ringkasan label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Skeleton width={90} height={12} borderRadius={4} />
          <Skeleton height={1} style={{ flex: 1 }} />
        </div>
        <Skeleton height={34} width="62%" borderRadius={4} style={{ marginBottom: '0.625rem' }} />
        <Para widths={['88%', '68%']} />

        <Divider />

        {/* Konten label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Skeleton width={80} height={12} borderRadius={4} />
          <Skeleton height={1} style={{ flex: 1 }} />
        </div>

        {/* Section 1: heading + paragraph */}
        <SectionHeading width="38%" size={24} />
        <Para widths={['100%', '96%', '84%']} />

        <Divider />

        {/* Section 2: heading + bullets */}
        <SectionHeading width="44%" size={20} />
        <Para widths={['100%', '90%']} />
        <BulletList style={{ marginTop: '0.875rem' }}>
          {[75, 90, 60, 82].map((w, i) => (
            <BulletItem key={i}>
              <Skeleton circle width={7} height={7} />
              <Skeleton height={15} width={`${w}%`} borderRadius={4} />
            </BulletItem>
          ))}
        </BulletList>

        <Divider />

        {/* Section 3: image-like block + caption + paragraph */}
        <SectionHeading width="52%" size={20} />
        <Skeleton
          height={190}
          borderRadius={8}
          style={{ marginBottom: '0.625rem', display: 'block' }}
        />
        <Skeleton height={13} width="35%" borderRadius={4} style={{ margin: '0 auto 1.25rem', display: 'block' }} />
        <Para widths={['100%', '78%']} />

        <Divider />

        {/* Section 4: sub-heading + inline badge chips + paragraph */}
        <SectionHeading width="32%" size={18} />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
          <Skeleton width={88} height={24} borderRadius={20} />
          <Skeleton width={76} height={24} borderRadius={20} />
          <Skeleton width={100} height={24} borderRadius={20} />
        </div>
        <Para widths={['100%', '94%', '62%']} />

        <Divider />

        {/* Section 5: closing paragraph */}
        <SectionHeading width="36%" size={20} />
        <Para widths={['100%', '98%', '95%', '58%']} />
      </ContentArea>
    </Wrapper>
  )
}
