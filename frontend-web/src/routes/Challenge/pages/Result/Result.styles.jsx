import styled from 'styled-components'

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f0fdfa;
`

export const Container = styled.div`
  max-width: 720px;
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
  transition: color 0.15s;

  &:hover { color: #06b6d4; }
`

export const HeroCard = styled.div`
  background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  color: #fff;
  margin-bottom: 1.25rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 160px; height: 160px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
    pointer-events: none;
  }
`

export const HeroTitle = styled.div`
  font-size: 1.375rem;
  font-weight: 800;
  margin-bottom: 0.375rem;
  letter-spacing: -0.01em;
`

export const HeroSub = styled.div`
  font-size: 0.875rem;
  color: rgba(255,255,255,0.7);
  margin-bottom: 2rem;
`

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;

  @media (max-width: 480px) { grid-template-columns: 1fr; gap: 0.5rem; }
`

export const Stat = styled.div`
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  padding: 0.875rem 0.5rem;
  text-align: center;
`

export const StatValue = styled.div`
  font-size: 1.625rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
`

export const StatLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  opacity: 0.75;
  margin-top: 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const BadgeBox = styled.div`
  background: #fff;
  border: 2px solid #fde68a;
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
`

export const BadgeImg = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #fcd34d;
`

export const BadgeName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #b45309;
`

export const BadgeDesc = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  margin-top: 0.2rem;
`

export const EmailNotice = styled.div`
  background: #fff;
  border: 1px solid #a5f3fc;
  border-radius: 10px;
  padding: 0.875rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  color: #0e7490;
`

export const Panel = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  gap: 0.5rem;
  flex-wrap: wrap;
`

export const PanelTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
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
  1: { bg: '#fffbeb', border: '#fde68a' },
  2: { bg: '#f8fafc', border: '#e2e8f0' },
  3: { bg: '#fff7ed', border: '#fed7aa' },
}

export const LeaderRow = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 0.6rem 0.75rem;
  margin-bottom: 0.375rem;
  background: ${p => p.$isMe ? '#ecfeff' : (MEDAL_BG[p.$rank]?.bg || 'transparent')};
  border: 1px solid ${p => p.$isMe ? '#a5f3fc' : (MEDAL_BG[p.$rank]?.border || 'transparent')};

  &:last-child { margin-bottom: 0; }
`

export const RankNum = styled.span`
  font-size: 0.875rem;
  font-weight: 800;
  color: #9ca3af;
  min-width: 2.25rem;
`

export const MedalIcon = styled.span`
  font-size: 1rem;
  min-width: 2.25rem;
`

export const LeaderName = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  color: ${p => p.$isMe ? '#0e7490' : '#374151'};
  font-weight: ${p => p.$isMe ? 700 : 500};
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
  color: #9ca3af;
  font-size: 0.875rem;
  padding: 1.5rem 0;
`

export const DetailBtn = styled.button`
  display: block;
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.9; }
`
