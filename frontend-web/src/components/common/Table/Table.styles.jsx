import styled from 'styled-components'

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--color-gray-200);
  background: white;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    border-radius: 6px;
  }
`

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`

export const TableHead = styled.thead`
  background: linear-gradient(135deg, rgba(30, 115, 170, 0.1) 0%, rgba(124, 179, 66, 0.1) 100%);
  border-bottom: 2px solid var(--color-brand-blue);
`

export const TableBody = styled.tbody`
  ${props => props.striped && `
    tr:nth-child(even) {
      background: var(--color-gray-50);
    }
  `}
`

export const TableRow = styled.tr`
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--color-gray-200);

  &:last-child {
    border-bottom: none;
  }

  ${props => props.hoverable && `
    &:hover {
      background: rgba(30, 115, 170, 0.08);
      cursor: pointer;
    }
  `}

  ${props => props.clickable && `
    cursor: pointer;
  `}
`

export const TableHeader = styled.th`
  padding: 0.875rem 1rem;
  text-align: ${props => props.align || 'left'};
  font-weight: 600;
  color: var(--color-brand-blue);
  white-space: nowrap;
  font-size: 0.875rem;

  ${props => props.width && `
    width: ${props.width};
  `}

  @media (max-width: 768px) {
    padding: 0.75rem 0.75rem;
    font-size: 0.8125rem;
  }
`

export const TableCell = styled.td`
  padding: 0.875rem 1rem;
  text-align: ${props => props.align || 'left'};
  color: var(--color-gray-700);
  vertical-align: middle;
  min-height: 44px;

  ${props => props.width && `
    width: ${props.width};
  `}

  @media (max-width: 768px) {
    padding: 0.75rem 0.75rem;
    font-size: 0.8125rem;
  }
`

export const EmptyState = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  color: var(--color-gray-500);
  font-size: 0.875rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`

export const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

export const EmptyText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-gray-700);
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`

export const EmptySubtext = styled.div`
  font-size: 0.875rem;
  color: var(--color-gray-500);

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`

export const LoadingState = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  color: var(--color-gray-500);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-gray-200);
  border-top: 4px solid var(--color-brand-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export const LoadingText = styled.div`
  font-size: 0.875rem;
  color: var(--color-gray-500);
`
