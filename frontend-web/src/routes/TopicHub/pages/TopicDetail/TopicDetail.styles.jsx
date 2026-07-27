import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`

export const Container = styled.div`
  padding: 1.75rem 2.5rem 4rem;
  animation: ${fadeUp} 0.3s ease both;
`

/* ── Breadcrumb ── */
export const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.75rem;
`

export const BreadcrumbLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: inherit;
  color: #10b981;
  cursor: pointer;
  font-weight: 500;

  &:hover { text-decoration: underline; }
`

export const BreadcrumbSep = styled.span`
  color: #d1d5db;
`

export const BreadcrumbCurrent = styled.span`
  color: #374151;
  font-weight: 500;
`

/* ── Topic Header ── */
export const TopicHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`

export const TopicHeaderLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
`

export const TopicIconBox = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 16px;
  background: #ede9fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
`

export const TopicMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

export const ClassificationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.1875rem 0.625rem;
  background: #d1fae5;
  color: #065f46;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 999px;
  width: fit-content;
`

export const TopicName = styled.h1`
  font-size: 1.625rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.2;
`

export const TopicDescription = styled.p`
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
`

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.9375rem;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover { color: #111827; }
`

/* ── Subtopics Section ── */
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

export const SubtopicNumber = styled.span`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 6px;
  background: #d1fae5;
  color: #065f46;
  font-size: 0.8125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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

/* ── Skeleton ── */
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
