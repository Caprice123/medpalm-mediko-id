import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`

export const TopicSection = styled.section`
  margin-bottom: 2.75rem;
`

export const TopicSectionTag = styled.p`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #10b981;
  text-transform: uppercase;
  margin: 0 0 0.25rem;
`

export const TopicSectionTitle = styled.h2`
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.375rem;
`

export const TopicSectionDesc = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.25rem;
`

export const TopicGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
`

export const TopicPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4375rem 0.875rem 0.4375rem 0.4375rem;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  white-space: nowrap;

  &:hover {
    border-color: #6ee7b7;
    background: #ecfdf5;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    color: #065f46;
  }
`

export const TopicPillIcon = styled.span`
  font-size: 1.125rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 50%;
  background: ${({ $bg }) => $bg || '#f3f4f6'};
  flex-shrink: 0;
`

export const TopicPillArrow = styled.span`
  margin-left: 0.25rem;
  color: #9ca3af;
  font-size: 0.875rem;
  transition: color 0.15s;

  ${TopicPill}:hover & {
    color: #10b981;
  }
`

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`

export const SkeletonPill = styled(SkeletonBase)`
  height: 2.375rem;
  width: ${({ $w }) => $w || '7rem'};
  border-radius: 999px;
  display: inline-block;
`
