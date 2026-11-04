import styled from 'styled-components'

export const PageWrapper = styled.div`
  min-height: calc(100vh - 44px);
  background: var(--color-brand-blue-tint);

  @media (max-width: 768px) {
    min-height: 100vh;
  }
`

export const Container = styled.div`
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) { padding: 1.5rem; }
  @media (max-width: 640px) { padding: 1.25rem; }
`

export const BackBtn = styled.button`
  background: none;
  border: none;
  color: var(--color-gray-500);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.15s;

  &:hover { color: var(--color-brand-blue); }
`

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-brand-blue);
  margin-bottom: 0.5rem;
`

export const PageSubtitle = styled.p`
  color: var(--color-gray-500);
  font-size: 1.05rem;
  margin-bottom: 2rem;
`

export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid var(--color-gray-200);
  margin-bottom: 1.75rem;
`

export const TabBtn = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  background: none;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ $active }) => $active ? 'var(--color-brand-blue)' : 'var(--color-gray-500)'};
  border-bottom: 2px solid ${({ $active }) => $active ? 'var(--color-brand-blue)' : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  transition: color 0.15s;

  &:hover { color: var(--color-brand-blue); }
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
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  transition: box-shadow 0.15s, transform 0.1s;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;

  ${({ $clickable }) => $clickable && `
    &:hover {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.09);
      transform: translateY(-1px);
    }
  `}
`

export const CardTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
  line-height: 1.3;
`

export const CardDesc = styled.p`
  font-size: 0.875rem;
  color: var(--color-gray-500);
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
    props.$variant === 'blue'   ? 'var(--color-brand-blue-tint)' :
    props.$variant === 'yellow' ? 'var(--color-warning-tint)' :
    props.$variant === 'green'  ? 'var(--color-brand-green-tint)' :
    'var(--color-gray-100)'};
  color: ${props =>
    props.$variant === 'blue'   ? 'var(--color-brand-blue-deep)' :
    props.$variant === 'yellow' ? '#92400E' :
    props.$variant === 'green'  ? 'var(--color-brand-green-darker)' :
    'var(--color-gray-700)'};
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
    if (props.$university) return 'var(--color-brand-blue-tint-strong)';
    if (props.$semester) return 'var(--color-brand-green-tint)';
    return '#ede9fe';
  }};
  color: ${props => {
    if (props.$university) return 'var(--color-brand-blue-deep)';
    if (props.$semester) return 'var(--color-brand-green-darker)';
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
  border-top: 1px solid var(--color-gray-100);
  margin-top: auto;
`

export const TimeLeftTag = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.$urgent ? 'var(--color-danger-dark)' : 'var(--color-gray-400)'};
`

export const StatusBtn = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  white-space: nowrap;
  color: ${props =>
    props.$status === 'completed'   ? 'var(--color-brand-green-dark)' :
    props.$status === 'in_progress' ? 'var(--color-warning-dark)' :
    'var(--color-brand-blue)'};
  margin-left: auto;
`

export const DateLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-400);
`

export const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

const CHIP_COLORS = {
  blitz:   { bg: 'var(--color-warning-tint)', color: '#92400E' },
  classic: { bg: 'var(--color-brand-blue-tint)', color: 'var(--color-brand-blue-deep)' },
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
  background: ${props => CHIP_COLORS[props.$type]?.bg || 'var(--color-gray-100)'};
  color: ${props => CHIP_COLORS[props.$type]?.color || 'var(--color-gray-700)'};
`

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-gray-100);
  margin-top: auto;
  gap: 0.5rem;
`

export const PlayedCount = styled.span`
  font-size: 0.8rem;
  color: var(--color-gray-400);
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
  border: 1px solid var(--color-gray-200);
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
  background: var(--color-brand-blue-tint);
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
  color: var(--color-gray-900);
`

export const BadgeChallenge = styled.div`
  font-size: 0.8125rem;
  color: var(--color-brand-blue-deep);
  font-weight: 500;
`

export const BadgeMeta = styled.div`
  font-size: 0.75rem;
  color: var(--color-gray-400);
`

export const BadgeRankTag = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-brand-blue-deep);
  background: var(--color-brand-blue-tint);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
`
