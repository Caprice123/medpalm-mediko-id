import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`

const fillBar = keyframes`
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
`

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`

const skeletonBg = `
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 40%, #f3f4f6 80%);
  background-size: 600px 100%;
`

export const StackedBar = styled.div`
  height: 16px;
  border-radius: 999px;
  overflow: hidden;
  display: flex;
  background: #f3f4f6;
  transform-origin: left center;
  animation: ${fillBar} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`

export const StackedSegment = styled.div`
  height: 100%;
  background: ${p => p.$color};
  width: ${p => p.$pct}%;
`

export const ProgressLegend = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #374151;
`

export const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.$color};
  flex-shrink: 0;
`

export const LegendCount = styled.span`
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin-left: auto;
`

export const PerTopicSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 0.875rem;
`

export const PerTopicLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #9ca3af;
`

export const PerTopicRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  opacity: 0;
  animation: ${fadeSlideIn} 0.3s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
`

export const PerTopicName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #111827;
  width: 140px;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const MiniBar = styled.div`
  flex: 1;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  display: flex;
  background: #f3f4f6;
  transform-origin: left center;
  animation: ${fillBar} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-delay: ${p => p.$delay || '0s'};
`

export const TotalCount = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  flex-shrink: 0;
  min-width: 1.5rem;
  text-align: right;
`

export const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.25rem;
`

export const PaginationBtn = styled.button`
  padding: 0.3rem 0.875rem;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover:not(:disabled) { border-color: #0d9488; color: #0d9488; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`

export const PaginationInfo = styled.span`
  font-size: 0.82rem;
  color: #6b7280;
  font-weight: 500;
`

/* ── Skeleton ── */

export const SkeletonBlock = styled.div`
  height: ${p => p.$h || '1rem'};
  width: ${p => p.$w || '100%'};
  border-radius: ${p => p.$radius || '6px'};
  flex-shrink: 0;
  ${skeletonBg}
  animation: ${shimmer} 1.5s ease-in-out infinite;
`

export const SkeletonLegendGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;
`

export const SkeletonPerTopicRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`
