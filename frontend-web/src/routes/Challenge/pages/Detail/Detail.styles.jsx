import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.35); }
  50% { box-shadow: 0 0 0 10px rgba(6, 182, 212, 0); }
`

const dotPulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
`

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

/* ——— Hero Card ——— */
export const HeroCard = styled.div`
  background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 1.25rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 160px;
    height: 160px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -60px;
    left: -30px;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 50%;
    pointer-events: none;
  }
`

export const HeroTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
`

export const HeroLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.65);
  text-transform: uppercase;
`

export const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  padding: 0.3rem 0.875rem;
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
  animation: ${dotPulse} 1.4s ease-in-out infinite;
`

export const HeroTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem;
  line-height: 1.2;
  letter-spacing: -0.01em;
`

export const HeroDesc = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1.25rem;
  line-height: 1.6;
`

export const HeroTagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`

export const HeroTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.95);
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
`

export const HeroMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  padding-top: 1.125rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
`

export const HeroMetaChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;

  span:first-child { font-size: 0.875rem; }
`

/* ——— Date Cards ——— */
export const DateCardsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
  margin-bottom: 1.25rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

export const DateCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
`

export const DateCardIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${props => props.$color || '#f0fdfa'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
`

export const DateCardInfo = styled.div``

export const DateCardLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`

export const DateCardValue = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
`

/* ——— Points Guide ——— */
export const PointsGuideCard = styled.div`
  background: #fff;
  border: 1px solid #cffafe;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #06b6d4, #0891b2);
    border-radius: 4px 0 0 4px;
  }
`

export const PointsGuideHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e0f2fe;
`

export const PointsGuideTitleIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`

export const PointsGuideTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0e7490;
`

export const PointsItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.625rem 0;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;

  & + & { border-top: 1px solid #f0fdfa; }

  strong { color: #0d9488; font-weight: 700; }
`

export const PointsItemIcon = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${props => props.$bg || '#cffafe'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
  margin-top: 0.0625rem;
`

/* ——— Reward Card (pre-start preview) ——— */
export const RewardCard = styled.div`
  background: linear-gradient(135deg, #fffbeb 0%, #fef9c3 100%);
  border: 1px solid #fde68a;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #f59e0b, #d97706);
    border-radius: 4px 0 0 4px;
  }

  &::after {
    content: '🎁';
    position: absolute;
    right: -8px;
    top: -8px;
    font-size: 5rem;
    opacity: 0.07;
    line-height: 1;
    pointer-events: none;
  }
`

export const RewardCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.625rem;
`

export const RewardCardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 4px 10px rgba(251, 191, 36, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
`

export const RewardCardMeta = styled.div`
  display: flex;
  flex-direction: column;
`

export const RewardCardLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #d97706;
  margin-bottom: 0.2rem;
`

export const RewardCardTitle = styled.div`
  font-size: 1.0625rem;
  font-weight: 800;
  color: #78350f;
  line-height: 1.2;
`

export const RewardCardDesc = styled.p`
  font-size: 0.875rem;
  color: #92400e;
  line-height: 1.6;
  margin: 0;
  padding-left: calc(40px + 0.75rem);
`

export const RewardTierGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`

export const RewardTierCard = styled.div`
  background: ${p => p.$isMyReward ? '#fffbeb' : '#fff'};
  border: 1.5px solid ${p => p.$isMyReward ? '#f59e0b' : '#fde68a'};
  border-radius: 12px;
  padding: 0.875rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  box-shadow: ${p => p.$isMyReward ? '0 0 0 3px rgba(245,158,11,0.15)' : 'none'};
`

export const RewardTierRank = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 999px;
  padding: 0.2rem 0.625rem;
  width: fit-content;
`

export const RewardTierTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #78350f;
  line-height: 1.3;
`

export const RewardTierDesc = styled.div`
  font-size: 0.8125rem;
  color: #a16207;
  line-height: 1.5;
`

/* ——— Start Button ——— */
export const StartSection = styled.div`
  margin-bottom: 2rem;
`

export const StartBtn = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.35);
  transition: transform 0.15s, box-shadow 0.15s;
  animation: ${pulse} 2.5s ease-in-out infinite;
  margin-bottom: 0.625rem;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(6, 182, 212, 0.45);
  }
  &:disabled {
    background: #a5f3fc;
    cursor: not-allowed;
    box-shadow: none;
    animation: none;
  }
`

export const ContinueBtn = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(8, 145, 178, 0.35);
  transition: transform 0.15s, box-shadow 0.15s;
  margin-bottom: 0.625rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(8, 145, 178, 0.45);
  }
`

export const StartHint = styled.div`
  text-align: center;
  font-size: 0.8125rem;
  color: #9ca3af;
`

export const CompletedNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #0e7490;
  font-weight: 500;
  background: #ecfeff;
  border: 1px solid #a5f3fc;
  border-radius: 10px;
  padding: 0.625rem 1rem;
  margin-bottom: 1.25rem;
`

/* ——— Completed side-by-side layout ——— */
export const CompletedTopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.25rem;
  align-items: stretch;
  margin-bottom: 1.25rem;

  ${HeroCard} { margin-bottom: 0; }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

/* ——— My Result ——— */
export const MyResultBox = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
`

export const MyResultHeader = styled.div`
  background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const MyResultTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const MyResultBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #0e7490;
  background: #cffafe;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
`

export const MyResultStats = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;

  &:last-child { border-bottom: none; }
`

export const StatValue = styled.div`
  font-size: 1.625rem;
  font-weight: 800;
  color: #0e7490;
  line-height: 1.1;
  letter-spacing: -0.02em;
`

export const StatLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 0.3rem;
`

export const ShareBtn = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: none;
  border-top: 1px solid #f3f4f6;
  color: #06b6d4;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover { background: #f0fdfa; }
`

/* ——— Tabs ——— */
export const TabsRow = styled.div`
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 1.5rem;
  gap: 0.25rem;
`

export const TabBtn = styled.button`
  background: transparent;
  color: ${props => props.$active ? '#06b6d4' : '#6b7280'};
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#06b6d4' : 'transparent'};
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: ${props => props.$active ? 700 : 500};
  cursor: pointer;
  position: relative;
  bottom: -2px;
  transition: color 0.15s;

  &:hover { color: ${props => props.$active ? '#06b6d4' : '#374151'}; }
`

export const TabPanel = styled.div``

export const Panel = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`

export const PanelTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
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
  font-weight: 600;
`

const MEDAL_BG = {
  1: { bg: '#fffbeb', border: '#fde68a', rankColor: '#d97706' },
  2: { bg: '#f8fafc', border: '#e2e8f0', rankColor: '#64748b' },
  3: { bg: '#fff7ed', border: '#fed7aa', rankColor: '#c2410c' },
}

export const LeaderRow = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  margin-bottom: 0.375rem;
  background: ${props => props.$isMe ? '#ecfeff' : (MEDAL_BG[props.$rank]?.bg || 'transparent')};
  border: 1px solid ${props => props.$isMe ? '#a5f3fc' : (MEDAL_BG[props.$rank]?.border || 'transparent')};
  transition: background 0.15s;

  &:last-child { margin-bottom: 0; }
`

export const RankNum = styled.span`
  font-size: 0.875rem;
  font-weight: 800;
  color: ${props => props.$rank <= 3 ? (MEDAL_BG[props.$rank]?.rankColor || '#374151') : '#9ca3af'};
  min-width: 2.25rem;
`

export const MedalIcon = styled.span`
  font-size: 1rem;
  min-width: 2.25rem;
  text-align: left;
`

export const LeaderName = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  color: ${props => props.$isMe ? '#0e7490' : '#374151'};
  font-weight: ${props => props.$isMe ? 700 : 500};
  padding: 0 0.625rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const LeaderScore = styled.span`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #111827;
`

export const EmptyLeader = styled.div`
  text-align: center;
  color: #9CA3AF;
  font-size: 0.875rem;
  padding: 1.5rem 0;
`

/* ——— Badge Cards ——— */
export const BadgeCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
`

export const BadgeCard = styled.div`
  background: ${props => props.$earned ? '#ecfeff' : '#fafafa'};
  border: 2px solid ${props => props.$earned ? '#06b6d4' : '#e5e7eb'};
  border-radius: 14px;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: ${props => props.$earned ? '0 0 0 3px rgba(6, 182, 212, 0.15)' : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$earned ? '0 4px 16px rgba(6, 182, 212, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.08)'};
  }
`

export const BadgeCardImg = styled.img`
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid ${props => props.$earned ? '#06b6d4' : '#e5e7eb'};
  box-shadow: ${props => props.$earned ? '0 0 0 4px rgba(6, 182, 212, 0.2)' : 'none'};
  margin-bottom: 0.25rem;
`

export const BadgeCardPlaceholder = styled.div`
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #cffafe, #e0f2fe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
`

export const BadgeCardName = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
`

export const BadgeCardRankLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.15rem 0.625rem;
  border-radius: 999px;
  font-weight: 500;
`

export const BadgeEarnedTag = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  color: #0e7490;
  background: #cffafe;
  padding: 0.2rem 0.625rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

/* ——— Reward Tab Panel ——— */
export const RewardTabPanel = styled.div`
  background: #fff;
  border: 1.5px solid #fde68a;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(245, 158, 11, 0.1);

  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #f59e0b, #d97706);
    border-radius: 4px 0 0 4px;
  }
`

export const RewardTabHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
`

export const RewardTabIconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-width: 0;
`

export const RewardTabIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 3px 8px rgba(251, 191, 36, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
`

export const RewardTabTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #78350f;
  line-height: 1.3;
`

export const RewardTabStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: ${p => p.$ready ? '#d1fae5' : '#fef3c7'};
  color: ${p => p.$ready ? '#065f46' : '#92400e'};
  border: 1px solid ${p => p.$ready ? '#6ee7b7' : '#fcd34d'};
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
`

export const RewardTabDesc = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.55;
  margin-bottom: 0.875rem;
  padding-left: calc(36px + 0.625rem);
`

export const RewardProofSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-top: 0.875rem;
  padding-top: 0.875rem;
  border-top: 1px solid #fef3c7;
`

export const RewardProofThumb = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
  border: 1.5px solid #fde68a;
  flex-shrink: 0;
  cursor: zoom-in;
`

export const RewardProofInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const RewardProofLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`

export const RewardProofLink = styled.a`
  font-size: 0.8125rem;
  color: #d97706;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &:hover { text-decoration: underline; }
`

export const RewardPendingNote = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #fef3c7;
  font-size: 0.8125rem;
  color: #92400e;
  line-height: 1.55;

  /* unused kept for compat */
`

export const RewardTabHero = styled.div``
export const RewardTabEmoji = styled.div``
export const RewardTabBody = styled.div``
export const RewardProofFrame = styled.div``
export const RewardProofImage = styled.img``
export const RewardPendingBox = styled.div``
export const RewardPendingIcon = styled.div``
export const RewardPendingText = styled.div``
export const RewardPendingSub = styled.div``

export const BadgeInfoBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 0.875rem 1rem;
  margin-bottom: 1.25rem;
  font-size: 0.8125rem;
  color: #92400e;
  line-height: 1.5;
`

export const BadgeInfoIcon = styled.div`
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 0.0625rem;
`
