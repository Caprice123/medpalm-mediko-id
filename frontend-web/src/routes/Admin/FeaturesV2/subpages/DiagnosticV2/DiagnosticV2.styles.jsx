import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
`

export const PageTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-700);
  margin: 0;
`

export const SearchRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.375rem;
`

export const LayerBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #ede9fe;
  color: #6d28d9;
`


// Shared by CasesPage and UnlinkedCasesPage
export const TypeBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  white-space: nowrap;
  background: ${p => p.$text ? 'var(--color-warning-tint)' : 'var(--color-brand-blue-tint)'};
  color: ${p => p.$text ? 'var(--color-warning-text)' : 'var(--color-brand-blue-deep)'};
`

// Shared by CasesPage and UnlinkedCasesPage
export const VignetteSnippet = styled.div`
  font-size: 0.8125rem;
  color: var(--color-gray-700);
  margin-bottom: 0.375rem;
  line-height: 1.5;
`

// Shared by CasesPage and UnlinkedCasesPage
export const QuestionPreviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

// Shared by CasesPage and UnlinkedCasesPage
export const QuestionPreviewRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--color-gray-500);
`

// Shared by CasesPage and UnlinkedCasesPage
export const QuestionPreviewIndex = styled.span`
  font-weight: 700;
  color: var(--color-gray-400);
  flex-shrink: 0;
`

// Shared by CasesPage and UnlinkedCasesPage
export const CountBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  white-space: nowrap;
  background: var(--color-gray-100);
  color: var(--color-gray-700);
`
