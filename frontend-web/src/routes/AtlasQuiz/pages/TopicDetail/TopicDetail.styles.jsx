import styled from 'styled-components'

export const PageWrapper = styled.div`
  padding: 2rem 1.5rem;
`

export const Inner = styled.div``

// Shared by ModulesPanel and QuizzesPanel
export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`

export const TagRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
`

export const ClassificationTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ $type }) => $type === 'patologi' ? 'var(--color-danger-tint)' : 'var(--color-brand-green-tint)'};
  color: ${({ $type }) => $type === 'patologi' ? '#b91c1c' : 'var(--color-brand-green-darker)'};
`

export const ArrowIcon = styled.span`
  color: var(--color-gray-400);
  font-size: 1rem;
`
