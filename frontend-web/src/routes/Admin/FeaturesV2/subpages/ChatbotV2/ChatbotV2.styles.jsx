import styled from 'styled-components'

export const Container = styled.div`
  padding: 1.5rem;
`

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
`

export const TabsContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid var(--color-gray-200);
  margin-bottom: 1.5rem;
  overflow-x: auto;
`

export const Tab = styled.button`
  padding: 0.75rem 1.25rem;
  border: none;
  background: none;
  font-size: 0.9375rem;
  font-weight: ${props => props.$active ? 600 : 500};
  color: ${props => props.$active ? 'var(--color-brand-blue)' : 'var(--color-gray-500)'};
  border-bottom: 2px solid ${props => props.$active ? 'var(--color-brand-blue)' : 'transparent'};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;

  &:hover {
    color: var(--color-brand-blue);
  }
`

// Shared by every tab page under this panel: the heading block that explains
// what the tab manages.
export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0 0 0.5rem 0;
`

export const HintText = styled.p`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  margin: 0 0 1.25rem 0;
  line-height: 1.5;
`

// Shared by DomainsPage and JournalsPage, which are the same list shape with a
// different row.
export const SearchRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  align-items: flex-end;
`

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${props => props.$minCardWidth || '300px'}, 1fr));
  gap: 0.5rem;
  min-height: 120px;
`

export const EmptyCell = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: var(--color-gray-400);
  font-size: 0.875rem;
  background: var(--color-gray-50);
  border-radius: 8px;
`

export const LoadMoreRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
`
