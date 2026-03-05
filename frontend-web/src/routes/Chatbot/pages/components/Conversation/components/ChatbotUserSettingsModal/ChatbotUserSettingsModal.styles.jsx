import styled from 'styled-components'

export const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
`

export const HintText = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0.25rem 0 0.75rem 0;
  line-height: 1.5;
`

export const FilterToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1.25rem;

  strong {
    font-size: 0.9375rem;
    color: #111827;
  }
`

export const SelectAllRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;

  span {
    font-size: 0.8125rem;
    color: #6b7280;
  }
`

export const DomainGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.75rem;
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`

export const DomainLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: monospace;
  color: #374151;
  background: ${({ $checked }) => $checked ? '#eff6ff' : 'transparent'};
  border: 1px solid ${({ $checked }) => $checked ? '#bfdbfe' : 'transparent'};
  transition: all 0.15s;

  &:hover {
    background: #f3f4f6;
  }
`

export const DomainCheckbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #3b82f6;
  flex-shrink: 0;
`

export const EmptyDomains = styled.div`
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-size: 0.875rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-top: 0.75rem;
`
