import styled from 'styled-components'

export const TabRow = styled.div`
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 0.75rem;
`

export const TabButton = styled.button`
  appearance: none;
  background: none;
  border: none;
  padding: 0.5rem 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${p => p.$active ? '#111827' : '#9ca3af'};
  border-bottom: 2px solid ${p => p.$active ? '#6366f1' : 'transparent'};
  cursor: pointer;
`
