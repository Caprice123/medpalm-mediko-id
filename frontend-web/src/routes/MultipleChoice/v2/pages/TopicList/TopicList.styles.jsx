import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`

export const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
`

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
`

export const HeaderLeft = styled.div``

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.25rem;
`

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`

export const EmptyWrap = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #9ca3af;
  background: #fff;
  border-radius: 16px;
  border: 1.5px dashed #e5e7eb;
`

export const PanelCard = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 1.25rem;
  animation: ${fadeSlideUp} 0.4s ease both;
`

export const PanelHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
`

export const PanelTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const PanelTitle = styled.span`
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
`

export const PanelSubtitle = styled.span`
  font-size: 0.8rem;
  color: #6b7280;
`

export const AverageScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const AverageLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9ca3af;
`

export const AverageValue = styled.span`
  font-size: 1.75rem;
  font-weight: 900;
  color: ${p => {
    if (p.$score >= 75) return '#10b981'
    if (p.$score >= 60) return '#3b82f6'
    if (p.$score >= 45) return '#f59e0b'
    return '#ef4444'
  }};
  line-height: 1;
`

export const CustomSessionCard = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  animation: ${fadeSlideUp} 0.4s ease 0.1s both;
`

export const CustomSessionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const CustomSessionIcon = styled.span`
  font-size: 1.25rem;
`

export const CustomSessionText = styled.div``

export const CustomSessionTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
`

export const CustomSessionDesc = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.15rem;
`

export const CustomSessionBtn = styled.button`
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #6BB9E8, #8DC63F);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.15s, transform 0.1s;
  box-shadow: 0 3px 10px rgba(107,185,232,0.4);

  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`

/* ── Topic list ── */

export const TopikSection = styled.div`
  animation: ${fadeSlideUp} 0.45s ease 0.15s both;
`

export const TopikSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.875rem;
`

export const TopikSectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 800;
  color: #374151;
  margin: 0;
`

export const TopikSearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.45rem 0.875rem;
  max-width: 300px;
  flex: 1;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus-within {
    border-color: #6BB9E8;
    box-shadow: 0 0 0 3px rgba(107,185,232,0.15);
  }
`

export const TopikSearchIcon = styled.span`
  color: #9ca3af;
  font-size: 0.9rem;
  flex-shrink: 0;
`

export const TopikSearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: #374151;
  background: transparent;
  flex: 1;
  min-width: 0;
  &::placeholder { color: #9ca3af; }
`

export const TopikList = styled.div`
  background: #fff;
  border-radius: 18px;
  overflow: visible;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
`

export const SkeletonBlock = styled.div`
  height: ${p => p.$h || '1rem'};
  width: ${p => p.$w || '100%'};
  border-radius: ${p => p.$radius || '6px'};
  flex-shrink: 0;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 40%, #f3f4f6 80%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`

export const SkeletonCircle = styled.div`
  width: ${p => p.$size || '32px'};
  height: ${p => p.$size || '32px'};
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 40%, #f3f4f6 80%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`

export const SkeletonTopikRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  &:last-child { border-bottom: none; }
`

export const TopikRowWrap = styled.div`
  border-bottom: 1px solid #f3f4f6;
  &:last-child { border-bottom: none; }
  opacity: 0;
  animation: ${fadeSlideUp} 0.3s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
`

export const TopikRowHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem 0.875rem;
  cursor: pointer;
  user-select: none;
  transition: background 0.12s;

  &:hover { background: #f9fafb; }
  ${p => p.$open && 'background: #f9fafb;'}
`

export const TopikName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  flex: 1;
  min-width: 0;
  line-height: 1.4;
`

export const TopikStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex-shrink: 0;
`

export const TopikStatChip = styled.span`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
`

export const TopikStatNum = styled.strong`
  color: #111827;
  font-weight: 700;
  font-size: 0.9375rem;
`

export const TopikPct = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${p => {
    const s = p.$score
    if (s == null) return '#9ca3af'
    if (s >= 75) return '#10b981'
    if (s >= 60) return '#3b82f6'
    if (s >= 45) return '#f59e0b'
    return '#ef4444'
  }};
  white-space: nowrap;
  min-width: 2.5rem;
  text-align: right;
`

export const TopikStartBtn = styled.button`
  padding: 0.35rem 1rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s, transform 0.1s;
  box-shadow: 0 2px 8px rgba(107,185,232,0.35);

  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`

export const TopikChevron = styled.span`
  font-size: 1.1rem;
  color: #9ca3af;
  transition: transform 0.22s ease, color 0.15s;
  transform: ${p => p.$open ? 'rotate(-90deg)' : 'rotate(90deg)'};
  line-height: 1;
  ${p => p.$open && 'color: #6BB9E8;'}
`
