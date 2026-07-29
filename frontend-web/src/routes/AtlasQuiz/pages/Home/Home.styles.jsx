import styled from 'styled-components'

export const Container = styled.div`
  padding: 2rem 1.5rem;
`

// ── Hero ─────────────────────────────────────────────────────────────────────

export const Hero = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0e7490 100%);
  border-radius: 20px;
  padding: 2.5rem 2.5rem 2rem;
  margin-bottom: 2.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -60px;
    right: 120px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
  }
`

export const HeroTop = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 0.75rem;
`

export const HeroIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.9rem;
  flex-shrink: 0;
`

export const HeroTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.2rem 0;
  line-height: 1.2;
`

export const HeroSubtitle = styled.p`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.65);
  margin: 0;
`

export const HeroPills = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: 1.25rem;
`

export const HeroPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  font-size: 0.8rem;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
`

// ── Section ───────────────────────────────────────────────────────────────────

export const Section = styled.div`
  margin-bottom: 2.5rem;
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`

export const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`

export const SectionSubtitle = styled.p`
  font-size: 0.825rem;
  color: #94a3b8;
  margin: 0;
`

// ── Topic cards ───────────────────────────────────────────────────────────────

export const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

export const TopicCard = styled.div`
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.18s, border-color 0.18s, transform 0.18s;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.10);
    border-color: #93c5fd;
    transform: translateY(-2px);
  }
`

export const CardAccent = styled.div`
  height: 5px;
  background: ${({ $bg }) => $bg || 'linear-gradient(90deg, #6366f1, #0ea5e9)'};
  border-radius: 0;
`

export const CardBody = styled.div`
  padding: 1.25rem 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
`

export const CardIconWrapper = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg || '#f1f5f9'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
`

export const CardTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
`

export const CardTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.4;
`

export const CardDescription = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
`

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const CardStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`

export const StatBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $type }) => $type === 'atlas' ? '#dbeafe' : '#fef3c7'};
  color: ${({ $type }) => $type === 'atlas' ? '#1d4ed8' : '#92400e'};
`

export const CardArrow = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  font-size: 0.9rem;
  transition: background 0.15s, color 0.15s;

  ${TopicCard}:hover & {
    background: #0ea5e9;
    color: #fff;
  }
`
