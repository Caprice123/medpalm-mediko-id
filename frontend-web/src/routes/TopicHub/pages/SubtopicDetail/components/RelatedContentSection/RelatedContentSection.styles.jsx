import styled from 'styled-components'

export const RelatedSection = styled.section`
  margin-bottom: 2rem;
`

export const RelatedSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 1rem;
`

export const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const RelatedCard = styled.button`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem 1.125rem;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
  opacity: ${({ $locked }) => $locked ? 0.6 : 1};

  &:hover {
    border-color: ${({ $locked }) => $locked ? '#e5e7eb' : '#10b981'};
    box-shadow: ${({ $locked }) => $locked ? 'none' : '0 0 0 3px rgba(16, 185, 129, 0.08)'};
  }
`

export const RelatedIconBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: #d1fae5;
  font-size: 1.125rem;
  flex-shrink: 0;
`

export const RelatedInfo = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
`

export const RelatedLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
`

export const RelatedCount = styled.span`
  font-size: 0.8125rem;
  color: #6b7280;
`

export const RelatedAction = styled.span`
  font-size: 0.875rem;
  color: #9ca3af;
  flex-shrink: 0;
`
