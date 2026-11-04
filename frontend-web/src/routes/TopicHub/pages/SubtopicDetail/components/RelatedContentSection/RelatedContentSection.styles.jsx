import styled from 'styled-components'

export const RelatedSection = styled.section`
  margin-bottom: 2rem;
`

export const RelatedSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--color-gray-500);
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
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  padding: 1rem 1.125rem;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s;
  opacity: ${({ $locked }) => $locked ? 0.6 : 1};

  &:hover {
    border-color: ${({ $locked }) => $locked ? 'var(--color-gray-200)' : 'var(--color-brand-blue)'};
    box-shadow: ${({ $locked }) => $locked ? 'none' : '0 0 0 3px rgba(30, 115, 170, 0.08)'};
  }
`

export const RelatedIconBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: var(--color-brand-blue-tint);
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
  color: var(--color-gray-900);
`

export const RelatedCount = styled.span`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
`

export const RelatedAction = styled.span`
  font-size: 0.875rem;
  color: var(--color-gray-400);
  flex-shrink: 0;
`
