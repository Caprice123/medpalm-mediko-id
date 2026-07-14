import styled from 'styled-components'

const teal = '#0891b2'
const tealDark = '#0e7490'
const tealDeep = '#164e63'
const slate900 = '#0f172a'
const slate800 = '#1e293b'
const slate500 = '#64748b'
const slate400 = '#94a3b8'
const slate300 = '#cbd5e1'
const slate200 = '#e2e8f0'
const slate100 = '#f1f5f9'
const slate50 = '#f8fafc'
const amber = '#f59e0b'

// ── Page shell ─────────────────────────────────────────────────
export const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${slate50};
`

// ── Hero ──────────────────────────────────────────────────────
export const Hero = styled.div`
  background: linear-gradient(135deg, ${teal} 0%, ${tealDark} 60%, ${tealDeep} 100%);
  padding: 2rem 0 ${p => p.$hasBanner ? '2rem' : '4rem'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -80px; right: -60px;
    width: 260px; height: 260px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
    pointer-events: none;
  }
`

export const HeroInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
  z-index: 1;

  @media (max-width: 640px) { flex-direction: column; }
  @media (max-width: 768px) { padding: 0 1.25rem; }
`

export const HeroBanner = styled.div`
  max-width: 1280px;
  margin: 1.25rem auto 0;
  padding: 0 2rem 1rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) { padding: 0 1.25rem 0.75rem; }

  .swiper { border-radius: 16px; }

  .swiper-pagination-bullet {
    background: rgba(255,255,255,0.55);
    opacity: 1;
    transition: all 0.25s;
  }

  .swiper-pagination-bullet-active {
    background: #fff;
    width: 20px;
    border-radius: 4px;
  }
`

export const HeroLeft = styled.div``

export const HeroDate = styled.p`
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
  margin: 0 0 0.35rem;
  letter-spacing: 0.03em;
  text-transform: capitalize;
`

export const HeroGreeting = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.25rem;
  letter-spacing: -0.01em;

  @media (max-width: 640px) { font-size: 1.4rem; }
`

export const HeroSub = styled.p`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.72);
  margin: 0;
`

export const HeroRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
  padding-top: 0.25rem;

  @media (max-width: 640px) { width: 100%; }
`

export const StatPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255,255,255,0.16);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
  cursor: ${p => p.$clickable ? 'pointer' : 'default'};
  transition: background 0.15s;
  white-space: nowrap;

  &:hover {
    background: ${p => p.$clickable ? 'rgba(255,255,255,0.26)' : 'rgba(255,255,255,0.16)'};
  }
`

// ── Content ───────────────────────────────────────────────────
export const Content = styled.main`
  background: ${slate50};
  border-radius: 24px 24px 0 0;
  margin-top: -1.75rem;
  padding: 2.5rem 2rem 1.75rem;
  position: relative;
  z-index: 2;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.08);

  > * {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 768px) {
    border-radius: 18px 18px 0 0;
    margin-top: -1.25rem;
    padding: 2rem 1.25rem 3rem;
  }
`

// ── Checklist ─────────────────────────────────────────────────
export const ChecklistBanner = styled.div`
  background: #fff;
  border: 1.5px solid #bae6fd;
  border-left: 4px solid ${teal};
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);

  @media (max-width: 640px) { flex-direction: column; align-items: flex-start; }
`

export const ChecklistLabel = styled.div`
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  color: #374151;
  strong { color: #111827; }
`

export const ChecklistSteps = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

export const ChecklistStep = styled.button`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: 8px;
  border: 1.5px solid ${p => p.$done ? '#bbf7d0' : teal};
  background: ${p => p.$done ? '#f0fdf4' : 'transparent'};
  color: ${p => p.$done ? '#16a34a' : teal};
  cursor: ${p => p.$done ? 'default' : 'pointer'};
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${p => p.$done ? '#f0fdf4' : teal};
    color: ${p => p.$done ? '#16a34a' : '#fff'};
  }
`

// ── Section ───────────────────────────────────────────────────
export const Section = styled.section`
  margin-bottom: 2.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`

export const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: ${slate900};
  margin: 0;
`

export const SectionLink = styled.button`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${teal};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
  &:hover { color: ${tealDark}; }
`

export const SectionLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const BannerCard = styled.div`
  border-radius: 16px;
  overflow: hidden;
  background: ${p => p.$gradientStart && p.$gradientEnd
    ? `linear-gradient(135deg, ${p.$gradientStart} 0%, ${p.$gradientEnd} 100%)`
    : 'linear-gradient(135deg, #0369a1 0%, #15803d 100%)'};
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  color: white;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1.25rem;
  }
`

export const BannerText = styled.div`
  h2 { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.25rem; }
  p  { font-size: 0.85rem; margin: 0; opacity: 0.9; }
`

export const BannerBtn = styled.button`
  flex-shrink: 0;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  background: white;
  color: #0369a1;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s;
  &:hover { opacity: 0.9; }
  @media (max-width: 640px) { align-self: flex-start; }
`

// ── Quick Access ──────────────────────────────────────────────
export const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;

  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); }
`

export const QuickItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  background: #fff;
  border: 1.5px solid ${slate200};
  border-radius: 16px;
  padding: 1.25rem 0.5rem 1rem;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(8,145,178,0.14);
    border-color: ${teal};
  }
`

export const QuickItemIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(8,145,178,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  transition: background 0.15s;

  ${QuickItem}:hover & {
    background: rgba(8,145,178,0.18);
  }
`

export const QuickItemName = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${slate800};
  text-align: center;
  line-height: 1.3;
`

export const QuickEmpty = styled.div`
  background: #fff;
  border: 1.5px dashed ${slate300};
  border-radius: 16px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  color: ${slate400};
  font-size: 0.88rem;
  line-height: 1.6;
`

// ── Upcoming ──────────────────────────────────────────────────
export const UpcomingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
`

export const UpcomingCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: #fff;
  border: 1.5px solid ${slate200};
  border-left: 4px solid ${teal};
  border-radius: 16px;
  padding: 1.25rem 1.25rem 1.25rem 1.1rem;
  cursor: pointer;
  text-align: left;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(8,145,178,0.12);
    border-color: ${teal};
  }
`

export const UpcomingEmpty = styled.div`
  background: #fff;
  border: 1.5px dashed ${slate300};
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  color: ${slate400};
  font-size: 0.88rem;
`

export const UpcomingType = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: ${teal};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.1rem;
`

export const UpcomingTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 700;
  color: ${slate800};
  line-height: 1.4;
`

export const UpcomingMeta = styled.div`
  font-size: 0.78rem;
  color: ${slate500};
`

export const UpcomingAction = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${teal};
  margin-top: 0.4rem;
`

// ── Account Status ─────────────────────────────────────────────
export const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 540px) { grid-template-columns: 1fr; }
`

export const StatusBox = styled.div`
  background: #fff;
  border: 1.5px solid ${slate200};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
`

export const StatusLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${slate500};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`

export const StatusBig = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${p => p.$muted ? slate400 : slate800};
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 0.75rem;
`

export const StatusBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
`

export const StatusBreakdownRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.79rem;
  font-weight: 500;
  color: ${p => p.$warn ? amber : slate500};
  padding-bottom: 0.35rem;
  border-bottom: 1px solid ${slate100};

  &:last-child { border-bottom: none; }
`

export const StatusActionRow = styled.div`
  padding-top: 1rem;
  margin-top: auto;
`

export const StatusActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: ${teal};
  background: rgba(8,145,178,0.08);
  border: 1px solid rgba(8,145,178,0.2);
  border-radius: 8px;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(8,145,178,0.16);
    color: ${tealDark};
  }
`
