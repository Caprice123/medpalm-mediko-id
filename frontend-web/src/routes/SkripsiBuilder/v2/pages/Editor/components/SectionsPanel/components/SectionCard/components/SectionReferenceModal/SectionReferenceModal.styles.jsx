import styled from 'styled-components'

export const Hint = styled.p`
  margin: 0 0 0.875rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-gray-500);
`

export const SearchRow = styled.div`
  margin-bottom: 0.875rem;
`

// Long reports exist, so the list scrolls inside the modal rather than pushing
// its buttons off the screen.
export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  max-height: 320px;
  overflow-y: auto;
`

export const Option = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1.5px solid var(--color-gray-200);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-gray-800);
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: var(--color-brand-blue);
    background: var(--color-brand-blue-tint);
  }
`

// The section's place in the document, so two sections with similar names are
// still tellable apart.
export const OptionIndex = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 6px;
  background: var(--color-gray-100);
  color: var(--color-gray-500);
  font-size: 0.75rem;
  font-weight: 700;
`

export const OptionTitle = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`


export const EmptyHint = styled.div`
  padding: 1.5rem 1rem;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-gray-500);
`
