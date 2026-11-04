import styled from 'styled-components'

export const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0.875rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid ${p => p.$focused ? 'var(--color-brand-blue)' : 'var(--color-gray-200)'};
  border-radius: 8px;
  background: ${p => p.$focused ? 'var(--color-surface)' : 'var(--color-gray-50)'};
  transition: border-color 0.15s, background 0.15s;
`

export const SearchGlyph = styled.span`
  display: flex;
  flex-shrink: 0;
  font-size: 1rem;
  color: ${p => p.$focused ? 'var(--color-brand-blue)' : 'var(--color-gray-400)'};
`

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: var(--color-gray-800);

  &::placeholder { color: var(--color-gray-400); }
`

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--color-gray-200);
  color: var(--color-gray-600);
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    background: var(--color-gray-300);
    color: var(--color-gray-800);
  }
`
