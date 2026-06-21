import styled from 'styled-components'

export const PageWrapper = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
`

export const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) { padding: 1.25rem; }
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

  &:hover { color: #1e40af; }
`

export const HeroCard = styled.div`
  background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 1.25rem;
`

export const HeroTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.875rem;
  gap: 1rem;
`

export const HeroLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.75);
  text-transform: uppercase;
`

export const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  flex-shrink: 0;
`

export const LiveDot = styled.span`
  width: 7px;
  height: 7px;
  background: #ef4444;
  border-radius: 50%;
  flex-shrink: 0;
`

export const HeroTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.375rem;
  line-height: 1.25;
`

export const HeroDesc = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1rem;
`

export const HeroTagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const HeroTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
`

export const DateCardsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
`

export const DateCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem 1.25rem;
`

export const DateCardLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #9ca3af;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.375rem;
`

export const DateCardValue = styled.div`
  font-size: 1.0625rem;
  font-weight: 600;
  color: #111827;
`

export const PointsGuideCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.25rem;
`

export const PointsGuideHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
`

export const PointsGuideTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
`

export const PointsItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;

  & + & { border-top: 1px solid #f9fafb; }

  strong { color: #0d9488; }
`

export const PointsItemIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
  line-height: 1.5;
`

export const StartBtn = styled.button`
  width: 100%;
  padding: 0.9375rem;
  background: #0d9488;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.0625rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 1.75rem;

  &:hover { background: #0f766e; }
  &:disabled { background: #a5f3fc; cursor: not-allowed; }
`

export const MyResultBox = styled.div`
  background: #f0fdfa;
  border: 1px solid #a5f3fc;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
`

export const MyResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #a5f3fc;
`

export const MyResultTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0e7490;
`

export const MyResultBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #b45309;
  background: #fef3c7;
  padding: 0.2rem 0.625rem;
  border-radius: 999px;
`

export const MyResultStats = styled.div`
  display: flex;
`

export const Stat = styled.div`
  flex: 1;
  text-align: center;
  padding: 0 1rem;

  & + & { border-left: 1px solid #a5f3fc; }
  &:first-child { padding-left: 0; }
  &:last-child { padding-right: 0; }
`

export const StatValue = styled.div`
  font-size: 1.375rem;
  font-weight: 700;
  color: #0e7490;
  line-height: 1.2;
`

export const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`

export const TabsRow = styled.div`
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 1.5rem;
  gap: 0.25rem;
`

export const TabBtn = styled.button`
  background: transparent;
  color: ${props => props.$active ? '#0d9488' : '#6b7280'};
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#0d9488' : 'transparent'};
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: ${props => props.$active ? 600 : 500};
  cursor: pointer;
  position: relative;
  bottom: -2px;
  transition: color 0.15s;

  &:hover { color: ${props => props.$active ? '#0d9488' : '#374151'}; }
`

export const TabPanel = styled.div``

export const Panel = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
`

export const PanelTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
`

export const LeaderboardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
`

export const RefreshCountdown = styled.span`
  font-size: 0.75rem;
  color: #0e7490;
  background: #cffafe;
  padding: 0.2rem 0.625rem;
  border-radius: 999px;
  font-weight: 500;
`

export const LeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.$isMe ? '#EFF6FF' : 'transparent'};
  border-radius: 6px;
  padding: 0.5rem;

  & + & { border-top: 1px solid #f9fafb; }
`

export const RankNum = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${props => props.$rank <= 3 ? '#D97706' : '#374151'};
  min-width: 2rem;
`

export const LeaderName = styled.span`
  flex: 1;
  font-size: 0.875rem;
  color: ${props => props.$isMe ? '#1E40AF' : '#374151'};
  font-weight: ${props => props.$isMe ? 600 : 400};
  padding: 0 0.5rem;
`

export const LeaderScore = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
`

export const EmptyLeader = styled.div`
  text-align: center;
  color: #9CA3AF;
  font-size: 0.875rem;
  padding: 1rem 0;
`

export const BadgeCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
`

export const BadgeCard = styled.div`
  background: ${props => props.$earned ? '#F0FDF4' : '#fafafa'};
  border: 1px solid ${props => props.$earned ? '#86efac' : '#e5e7eb'};
  border-radius: 12px;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
`

export const BadgeCardImg = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid ${props => props.$earned ? '#86efac' : '#e5e7eb'};
  margin-bottom: 0.25rem;
`

export const BadgeCardPlaceholder = styled.div`
  width: 64px;
  height: 64px;
  background: #DBEAFE;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
`

export const BadgeCardName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
`

export const BadgeCardRankLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
`

export const BadgeEarnedTag = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  color: #166534;
  background: #dcfce7;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
`
