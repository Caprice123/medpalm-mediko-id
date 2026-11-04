import styled from 'styled-components'

export const ResultsHeader = styled.div`
  padding: 0.625rem 0.875rem 0.375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-500);
`

export const ResultRow = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  margin: 0 0.375rem 0.125rem;
  border-radius: 6px;
  cursor: pointer;
  background: ${p => p.$selected ? 'var(--color-brand-blue-tint)' : 'transparent'};

  &:hover {
    background: ${p => p.$selected ? 'var(--color-brand-blue-tint)' : 'var(--color-gray-100)'};
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.3rem;
    bottom: 0.3rem;
    width: 2px;
    border-radius: 2px;
    background: ${p => p.$selected ? 'var(--color-brand-blue)' : 'transparent'};
  }
`

export const ResultInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
`

export const ResultTitle = styled.span`
  font-size: 0.875rem;
  line-height: 1.35;
  color: ${p => p.$selected ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-800)'};
  font-weight: ${p => p.$selected ? '600' : '500'};

  /* Two lines, because a truncated single line of a long note title often cuts off
     exactly the words the reader searched for. */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  mark {
    background: var(--color-warning-tint);
    color: inherit;
    border-radius: 2px;
    padding: 0 0.0625rem;
  }
`

export const ResultPath = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  color: var(--color-gray-400);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  svg { flex-shrink: 0; }
`
