import styled from 'styled-components'

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`

export const OptionCard = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
  background: ${props => props.$selected ? 'var(--color-brand-blue-tint)' : 'var(--color-surface)'};
  border: 1.5px solid ${props => props.$selected ? 'var(--color-brand-blue)' : 'var(--color-gray-200)'};
  transition: all 0.15s;

  &:hover {
    border-color: var(--color-brand-blue);
    background: var(--color-brand-blue-tint);
  }
`

export const Radio = styled.span`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  border-radius: 50%;
  border: 1.5px solid ${props => props.$selected ? 'var(--color-brand-blue)' : 'var(--color-gray-300)'};
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;

  &:after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$selected ? 'var(--color-brand-blue)' : 'transparent'};
  }
`

export const OptionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`

export const OptionLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.$selected ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-800)'};
`

export const OptionMeta = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-500);
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
`

// Marks which option is live right now, as distinct from which one is selected
// in the form but not yet saved.
export const ActiveBadge = styled.span`
  margin-left: auto;
  flex-shrink: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: var(--color-brand-green-tint);
  color: var(--color-brand-green-darker);
  white-space: nowrap;
`

export const RetrieverTag = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--color-gray-100);
  color: var(--color-gray-600);
  white-space: nowrap;
`

export const OptionTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  flex-wrap: wrap;
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const SavedNote = styled.span`
  font-size: 0.8125rem;
  color: var(--color-brand-green-darker);
`
