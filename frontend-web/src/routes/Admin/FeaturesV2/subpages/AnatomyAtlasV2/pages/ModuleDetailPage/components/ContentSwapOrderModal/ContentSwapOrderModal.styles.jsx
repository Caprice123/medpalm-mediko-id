import styled from 'styled-components'

export const OptionList = styled.div`
  font-size: 0.875rem;
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid #f3f4f6;
  border-radius: 0.375rem;
`

export const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${p => p.$disabled ? 0.5 : 1};
  background: #fff;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${p => p.$disabled ? '#fff' : '#f0f9ff'};
  }
`

export const OptionIcon = styled.span`
  font-size: 0.95rem;
  flex-shrink: 0;
`

export const OptionLabel = styled.span`
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const EmptyState = styled.div`
  padding: 1rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
`
