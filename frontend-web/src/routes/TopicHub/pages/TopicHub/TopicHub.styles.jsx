import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`

export const Container = styled.div`
  padding: 2.5rem 2.5rem 4rem;
  animation: ${fadeUp} 0.35s ease both;
`

export const PageHeader = styled.div`
  margin-bottom: 1.75rem;
`

export const Greeting = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.375rem;
`

export const GreetingSubtitle = styled.p`
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
`

/* ── Last Session ── */
export const LastSessionSection = styled.div`
  margin-bottom: 2.5rem;
`

export const SectionLabel = styled.p`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #9ca3af;
  text-transform: uppercase;
  margin: 0 0 0.625rem;
`

export const LastSessionCard = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1.25rem;
  background: #fff;
  border: 1.5px solid #d1fae5;
  border-left: 4px solid #10b981;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    box-shadow: 0 2px 14px rgba(16, 185, 129, 0.1);
  }
`

export const LastSessionIcon = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 10px;
  background: #d1fae5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.375rem;
  flex-shrink: 0;
`

export const LastSessionText = styled.div`
  flex: 1;
  min-width: 0;
`

export const LastSessionName = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const LastSessionMeta = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
`

export const LastSessionArrow = styled.span`
  font-size: 1.25rem;
  color: #10b981;
  flex-shrink: 0;
`

/* ── Topic Section ── */
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

/* ── Skeleton ── */
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
