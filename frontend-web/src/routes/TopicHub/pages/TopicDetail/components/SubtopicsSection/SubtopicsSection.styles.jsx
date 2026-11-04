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
  color: var(--color-gray-900);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const SubtopicsIcon = styled.span`
  color: var(--color-brand-blue);
  display: flex;
  align-items: center;
`

export const SubtopicsCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-100);
  color: var(--color-gray-700);
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.125rem 0.5rem;
`

export const SubtopicsSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin: 0 0 1.25rem;

  a { color: var(--color-brand-blue); text-decoration: none; }
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
  border: 1.5px solid var(--color-gray-200);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: var(--color-brand-blue-tint-strong);
    box-shadow: 0 2px 8px rgba(30, 115, 170, 0.08);
  }
`

export const SubtopicName = styled.span`
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-gray-900);
  line-height: 1.4;
`

export const SubtopicArrow = styled.span`
  color: var(--color-gray-400);
  font-size: 1.125rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-200) 50%, var(--color-gray-100) 75%);
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
  color: var(--color-gray-400);
  font-size: 0.9375rem;
  padding: 3rem 0;
`
