import styled from 'styled-components'

export const TabBar = styled.div`
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-gray-200);
  padding: 0 24px;
  display: flex;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-gray-300);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 0.25rem;
  }
`

export const Tab = styled.button`
  background: ${props => props.$active ? 'var(--color-brand-blue-tint)' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.$active ? 'var(--color-brand-blue)' : 'transparent'};
  color: ${props => props.$active ? 'var(--color-brand-blue)' : 'var(--color-gray-500)'};
  padding: 12px 20px;
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: var(--color-gray-50);
    color: ${props => props.$active ? 'var(--color-brand-blue)' : 'var(--color-gray-800)'};
  }

  @media (max-width: 768px) {
    /* padding: 0.625rem 0.875rem; */
    font-size: 0.8125rem;
  }
`
