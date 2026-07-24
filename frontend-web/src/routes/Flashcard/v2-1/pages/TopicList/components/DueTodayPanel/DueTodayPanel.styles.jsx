import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`

const skeletonBg = `
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 40%, #f3f4f6 80%);
  background-size: 600px 100%;
`

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const CountBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 0.3rem;
  flex-shrink: 0;
`

export const CountNumber = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  line-height: 1;
`

export const CountLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const StartAllBtn = styled.button`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.1rem;
  background: linear-gradient(135deg, #0d9488 0%, #059669 100%);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.15s, transform 0.1s;
  box-shadow: 0 2px 10px rgba(13,148,136,0.35);

  &:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

export const SubtitleText = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`

export const DueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const DueItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1.5px solid #0d9488;
  background: #fff;
  cursor: pointer;
  transition: background 0.15s;
  opacity: 0;
  animation: ${fadeSlideIn} 0.3s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};

  &:hover { background: #f0fdf9; }
`

export const ItemNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0d9488;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

export const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
`

export const ItemTitle = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ItemSub = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`

export const ItemCount = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
`

export const ItemArrow = styled.span`
  font-size: 1rem;
  color: #9ca3af;
  transition: color 0.15s, transform 0.15s;

  ${DueItem}:hover & {
    color: #0d9488;
    transform: translateX(2px);
  }
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

export const SkeletonCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  ${skeletonBg}
  animation: ${shimmer} 1.5s ease-in-out infinite;
`

export const SkeletonDueItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1.5px solid #f3f4f6;
`
