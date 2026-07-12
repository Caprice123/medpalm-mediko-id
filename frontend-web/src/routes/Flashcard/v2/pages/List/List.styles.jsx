import styled from 'styled-components'

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`

export const LoadMoreRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`


/* ── Review Stats Panel ── */

export const StatsPanel = styled.div`
  margin-bottom: 2rem;
`

/* Hero card */
export const HeroCard = styled.div`
  background: linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #0891b2 100%);
  border-radius: 16px;
  padding: 1.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.3);
`

export const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const HeroEyebrow = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.65);
`

export const HeroNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: white;
  line-height: 1;
  letter-spacing: -0.03em;
`

export const HeroSub = styled.div`
  font-size: 0.875rem;
  color: rgba(255,255,255,0.7);
  margin-top: 0.125rem;
`

export const HeroRight = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`

export const HeroStatBox = styled.div`
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  min-width: 68px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  backdrop-filter: blur(4px);
`

export const HeroStatNum = styled.div`
  font-size: 1.375rem;
  font-weight: 800;
  color: white;
  line-height: 1;
`

export const HeroStatLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  color: rgba(255,255,255,0.65);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
`

export const AllDonePill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 99px;
  padding: 0.5rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  align-self: center;
`

/* Section header */
export const SectionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`

export const SectionLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #9ca3af;
  white-space: nowrap;
`

export const SectionLine = styled.div`
  flex: 1;
  height: 1px;
  background: #e5e7eb;
`

/* ── Topic Split Layout ── */

export const TopicSplitLayout = styled.div`
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  user-select: ${p => p.$resizing ? 'none' : 'auto'};
  cursor: ${p => p.$resizing ? 'col-resize' : 'auto'};

  @media (max-width: 600px) {
    flex-direction: column;
  }
`

export const TopicScrollList = styled.div`
  display: flex;
  flex-direction: column;
  width: ${p => p.$width ? `${p.$width}px` : '220px'};
  min-width: ${p => p.$width ? `${p.$width}px` : '220px'};
  flex-shrink: 0;
  border-right: 1px solid #e5e7eb;

  @media (max-width: 600px) {
    width: 100%;
    min-width: 0;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
`

export const TopicResizeHandle = styled.div`
  width: 4px;
  cursor: col-resize;
  flex-shrink: 0;
  background: transparent;
  transition: background 0.15s;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0 -4px;
  }

  &:hover { background: rgba(13, 148, 136, 0.35); }
  &[data-dragging='true'] { background: #0d9488; }

  @media (max-width: 600px) {
    display: none;
  }
`

export const TopicItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6875rem 0.875rem;
  cursor: pointer;
  user-select: none;
  transition: background 0.12s;
  border-bottom: 1px solid ${p => p.$last ? 'transparent' : '#f3f4f6'};
  border-left: 3px solid ${p => p.$selected ? '#0d9488' : 'transparent'};
  background: ${p => p.$selected ? '#f0fdfa' : 'transparent'};

  &:hover {
    background: ${p => p.$selected ? '#f0fdfa' : '#f9fafb'};
  }
`

export const TopicName = styled.div`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const DuePill = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  font-size: 0.6875rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  background: ${p => p.$count > 0 ? '#fee2e2' : '#f0fdf4'};
  color: ${p => p.$count > 0 ? '#b91c1c' : '#166534'};
  border: 1px solid ${p => p.$count > 0 ? '#fecaca' : '#bbf7d0'};
`

export const LoadMoreTopicBtn = styled.button`
  all: unset;
  display: block;
  padding: 0.625rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0d9488;
  cursor: pointer;
  text-align: center;
  border-top: 1px solid #f3f4f6;
  transition: background 0.12s;
  flex-shrink: 0;

  &:hover { background: #f0fdfa; }
`

/* Right panel */
export const TopicDetailPanel = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
`

export const TopicDetailTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
`

export const TopicStatRow = styled.div`
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background: #fafafa;
`

export const TopicStat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.875rem 0.5rem;

  &:not(:last-child) { border-right: 1px solid #e5e7eb; }
`

export const TopicStatNum = styled.span`
  font-size: 1.125rem;
  font-weight: 800;
  color: ${p => p.$color || '#111827'};
  line-height: 1;
`

export const TopicStatLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`
