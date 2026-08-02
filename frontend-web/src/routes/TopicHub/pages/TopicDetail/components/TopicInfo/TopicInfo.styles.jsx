import styled from 'styled-components'

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
