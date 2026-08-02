import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`

export const SubtopicsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.375rem;
`

export const SubtopicsTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const SubtopicsIcon = styled.span`
  color: #10b981;
  display: flex;
  align-items: center;
`

export const SubtopicsCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #374151;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.125rem 0.5rem;
`

export const SubtopicsSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.25rem;

  a { color: #10b981; text-decoration: none; }
`

export const SubtopicGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const SubtopicCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.125rem;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: #a7f3d0;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
  }
`

export const SubtopicName = styled.span`
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  line-height: 1.4;
`

export const SubtopicArrow = styled.span`
  color: #9ca3af;
  font-size: 1.125rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  border-radius: 8px;
`

export const SkeletonCard = styled(SkeletonBase)`
  height: 3.5rem;
  border-radius: 10px;
`

export const EmptyState = styled.p`
  grid-column: 1 / -1;
  text-align: center;
  color: #9ca3af;
  font-size: 0.9375rem;
  padding: 3rem 0;
`
