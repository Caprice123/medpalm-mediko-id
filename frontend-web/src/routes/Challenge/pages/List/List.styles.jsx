import styled from 'styled-components'

export const PageWrapper = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
`

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) { padding: 1.5rem; }
  @media (max-width: 640px) { padding: 1.25rem; }
`

export const BackBtn = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.15s;

  &:hover { color: #06b6d4; }
`

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #06b6d4;
  margin-bottom: 0.5rem;
`

export const PageSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.05rem;
  margin-bottom: 2rem;
`

export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 1.75rem;
`

export const TabBtn = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  background: none;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ $active }) => $active ? '#06b6d4' : '#6b7280'};
  border-bottom: 2px solid ${({ $active }) => $active ? '#06b6d4' : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  transition: color 0.15s;

  &:hover { color: #06b6d4; }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
`

export const ChallengeCard = styled.div`
  background: #fff;
  border: 1px solid #e8ecf0;
  border-radius: 14px;
  padding: 1.25rem 1.375rem 1.125rem;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.1s;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.09);
    transform: translateY(-1px);
  }
`

export const CardTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.3;
`

export const CardDesc = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

export const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props =>
    props.$variant === 'blue'   ? '#CFFAFE' :
    props.$variant === 'yellow' ? '#FEF3C7' :
    props.$variant === 'green'  ? '#D1FAE5' :
    '#F3F4F6'};
  color: ${props =>
    props.$variant === 'blue'   ? '#0e7490' :
    props.$variant === 'yellow' ? '#92400E' :
    props.$variant === 'green'  ? '#065f46' :
    '#374151'};
`

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.375rem;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: ${props => {
    if (props.$university) return '#dbeafe';
    if (props.$semester) return '#d1fae5';
    return '#ede9fe';
  }};
  color: ${props => {
    if (props.$university) return '#1e40af';
    if (props.$semester) return '#065f46';
    return '#5b21b6';
  }};
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.625rem;
  border-top: 1px solid #f3f4f6;
  margin-top: auto;
`

export const TimeLeftTag = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.$urgent ? '#DC2626' : '#9CA3AF'};
`

export const StatusBtn = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  white-space: nowrap;
  color: ${props =>
    props.$status === 'completed'   ? '#059669' :
    props.$status === 'in_progress' ? '#d97706' :
    '#0d9488'};
  margin-left: auto;
`

export const DateLabel = styled.span`
  font-size: 0.75rem;
  color: #9CA3AF;
`

export const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

const CHIP_COLORS = {
  blitz:   { bg: '#FEF3C7', color: '#92400E' },
  classic: { bg: '#CFFAFE', color: '#0e7490' },
}

export const CategoryChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.625rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${props => CHIP_COLORS[props.$type]?.bg || '#F3F4F6'};
  color: ${props => CHIP_COLORS[props.$type]?.color || '#374151'};
`

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
  margin-top: auto;
  gap: 0.5rem;
`

export const PlayedCount = styled.span`
  font-size: 0.8rem;
  color: #9CA3AF;
  white-space: nowrap;
`

// ─── Badge Saya tab ────────────────────────────────────────────────────────

export const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.25rem;
`

export const BadgeCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
`

export const BadgeImg = styled.img`
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #67e8f9;
  margin-bottom: 0.25rem;
`

export const BadgePlaceholder = styled.div`
  width: 72px;
  height: 72px;
  background: #CFFAFE;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 0.25rem;
`

export const BadgeName = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
`

export const BadgeChallenge = styled.div`
  font-size: 0.8125rem;
  color: #0e7490;
  font-weight: 500;
`

export const BadgeMeta = styled.div`
  font-size: 0.75rem;
  color: #9CA3AF;
`

export const BadgeRankTag = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #0e7490;
  background: #CFFAFE;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
`
