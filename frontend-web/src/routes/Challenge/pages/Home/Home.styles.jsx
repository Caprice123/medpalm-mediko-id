import styled, { keyframes } from 'styled-components'

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const PageWrapper = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
`

export const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 2rem 3rem;
  @media (max-width: 768px) { padding: 1.25rem; }
`

// ─── Top two-column section ───────────────────────────────────────────────────

export const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.25rem;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

// ─── Hero card ────────────────────────────────────────────────────────────────

export const HeroCard = styled.div`
  background: linear-gradient(135deg, #134e4a 0%, #0c4a6e 100%);
  border-radius: 16px;
  padding: 2rem 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  min-height: 220px;
  opacity: ${props => props.$transitioning ? 0 : 1};
  transition: opacity 0.3s ease;
`

export const SlideDots = styled.div`
  display: flex;
  gap: 0.375rem;
  align-items: center;
  margin-top: 0.25rem;
`

export const SlideDot = styled.button`
  width: ${props => props.$active ? '20px' : '6px'};
  height: 6px;
  border-radius: 3px;
  background: ${props => props.$active ? '#fff' : 'rgba(255,255,255,0.35)'};
  border: none;
  cursor: ${props => props.$active ? 'default' : 'pointer'};
  padding: 0;
  transition: width 0.3s ease, background 0.3s ease;
  flex-shrink: 0;
`

export const HeroTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
`

export const LiveDot = styled.span`
  width: 6px;
  height: 6px;
  background: #4ade80;
  border-radius: 50%;
  flex-shrink: 0;
`

export const HeroChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.625rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${props => props.$type === 'blitz' ? '#FEF3C7' : '#CFFAFE'};
  color: ${props => props.$type === 'blitz' ? '#92400E' : '#0e7490'};
`

export const HeroTitle = styled.h2`
  font-size: 1.625rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
  flex: 1;
`

export const HeroDesc = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
  line-height: 1.5;
`

export const HeroActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.25rem;
`

const BTN_COLORS = {
  completed:   { bg: '#059669', hover: '#047857' },
  in_progress: { bg: '#d97706', hover: '#b45309' },
  not_started: { bg: '#0d9488', hover: '#0f766e' },
}

export const JoinBtn = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  background: ${props => (BTN_COLORS[props.$status] || BTN_COLORS.not_started).bg};
  color: #fff;
  transition: background 0.15s, transform 0.1s;

  &:hover {
    background: ${props => (BTN_COLORS[props.$status] || BTN_COLORS.not_started).hover};
    transform: translateY(-1px);
  }
`

// ─── Leaderboard panel ────────────────────────────────────────────────────────

export const LeaderPanel = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  max-height: 420px;
  overflow-y: auto;
`

export const LeaderPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.875rem;
`

export const LeaderPanelTitle = styled.div`
  font-size: 0.6875rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const LeaderPanelLink = styled.button`
  font-size: 0.6875rem;
  font-weight: 700;
  color: #0d9488;
  background: none;
  border: none;
  cursor: pointer;
  letter-spacing: 0.04em;

  &:hover { text-decoration: underline; }
`

export const MiniLeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0;
  border-top: 1px solid #f3f4f6;

  ${props => props.$self && `
    margin-top: 0.5rem;
    border-top: 2px dashed #e5e7eb;
  `}
`

export const MiniRank = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #374151;
  flex-shrink: 0;
`

export const MiniLeaderName = styled.div`
  flex: 1;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0;
  animation: ${slideUp} 0.35s ease forwards;
  animation-delay: ${props => (props.$index || 0) * 0.06}s;
`

export const MiniScore = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #374151;
  flex-shrink: 0;
  opacity: 0;
  animation: ${slideUp} 0.35s ease forwards;
  animation-delay: ${props => (props.$index || 0) * 0.06 + 0.03}s;
`

export const MyRankBadge = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #0e7490;
  background: #CFFAFE;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  flex-shrink: 0;
`

export const EmptyLeaderMsg = styled.div`
  font-size: 0.8125rem;
  color: #9CA3AF;
  text-align: center;
  padding: 2rem 0;
`

// ─── Stats row ────────────────────────────────────────────────────────────────

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
  gap: 0.875rem;
  margin-bottom: 2rem;
`

export const StatCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem 1.25rem;
`

export const StatCardLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  color: #9CA3AF;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.375rem;
`

export const StatCardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.$color || '#111827'};
  line-height: 1;
  opacity: 0;
  animation: ${slideUp} 0.4s ease forwards;
  animation-delay: ${props => (props.$index || 0) * 0.07}s;
`

// ─── Section header ───────────────────────────────────────────────────────────

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1rem;
`

export const SectionTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin: 0 0 0.2rem;
`

export const SectionSub = styled.div`
  font-size: 0.8125rem;
  color: #9CA3AF;
`

export const SeeAllBtn = styled.button`
  font-size: 0.75rem;
  font-weight: 700;
  color: #0d9488;
  background: none;
  border: none;
  cursor: pointer;
  letter-spacing: 0.04em;
  white-space: nowrap;
  padding-bottom: 0.2rem;

  &:hover { text-decoration: underline; }
`

// ─── Challenge grid ───────────────────────────────────────────────────────────

export const ChallengeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
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

export const TimeLeftTag = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.$urgent ? '#DC2626' : '#9CA3AF'};
`

export const CardTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.3;
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

export const PointsLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: #d97706;
  white-space: nowrap;
`

export const PlayBtn = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  white-space: nowrap;
  color: ${props =>
    props.$status === 'completed'  ? '#059669' :
    props.$status === 'in_progress' ? '#d97706' :
    '#0d9488'};
  margin-left: auto;
`

// ─── My Badges strip ─────────────────────────────────────────────────────────

export const BadgesSection = styled.div`
  margin-bottom: 2.5rem;
`

export const LatestBadgeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: linear-gradient(135deg, #ecfdf5 0%, #cffafe 100%);
  border: 1px solid #a7f3d0;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
`

export const LatestBadgeImg = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #67e8f9;
  flex-shrink: 0;
`

export const LatestBadgePlaceholder = styled.div`
  width: 64px;
  height: 64px;
  background: #fff;
  border-radius: 50%;
  border: 3px solid #67e8f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
`

export const LatestBadgeInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const LatestBadgeLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  color: #0e7490;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.2rem;
`

export const LatestBadgeName = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.2rem;
`

export const LatestBadgeMeta = styled.div`
  font-size: 0.8125rem;
  color: #374151;
`

export const LatestBadgeRank = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #0e7490;
  background: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  border: 1px solid #67e8f9;
  flex-shrink: 0;
`

export const NoBadgeCta = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: #fff;
  border: 1px dashed #d1fae5;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
`

export const NoBadgeIcon = styled.div`
  font-size: 2.25rem;
  flex-shrink: 0;
`

export const NoBadgeText = styled.div`
  flex: 1;
`

export const NoBadgeTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.2rem;
`

export const NoBadgeSub = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
`

// ─── How to play ──────────────────────────────────────────────────────────────

export const HowToPlayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
`

export const HowToPlayCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const HowToPlayIcon = styled.div`
  font-size: 1.75rem;
`

export const HowToPlayStep = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  color: #9CA3AF;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

export const HowToPlayTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
`

export const HowToPlayDesc = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.5;
`

// ─── Empty hero ───────────────────────────────────────────────────────────────

export const EmptyHero = styled.div`
  background: linear-gradient(135deg, #134e4a 0%, #0c4a6e 100%);
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
`

export const EmptyHeroIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`

export const EmptyHeroTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
`

export const EmptyHeroSub = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
`

// ─── Upcoming banner ──────────────────────────────────────────────────────────

export const UpcomingBanner = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1a2744 100%);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.93; }
`

export const UpcomingInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const UpcomingLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 800;
  color: #f59e0b;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const UpcomingTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: -0.01em;
`

export const UpcomingDesc = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
  line-height: 1.5;
  max-width: 440px;
`

export const UpcomingMeta = styled.div`
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.45);
`

export const UpcomingBtn = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  border-radius: 999px;
  background: #fff;
  color: #111827;
  font-size: 0.875rem;
  font-weight: 700;
  margin-top: 0.25rem;
  width: fit-content;
`

export const UpcomingTrophy = styled.div`
  font-size: 4rem;
  flex-shrink: 0;
  opacity: 0.8;

  @media (max-width: 600px) { display: none; }
`
