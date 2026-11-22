import styled from 'styled-components'

// The rule between two sections on the sheet, with the "+" sitting on it. The
// line is what separates one section from the next, so it is always drawn; the
// button on it only appears under the pointer, or the document would read as a
// row of buttons between every heading.
export const Divider = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ $leading }) => ($leading ? '1rem' : '1.75rem')};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    border-top: 1px solid var(--color-gray-200);
    /* The first one sits at the top of the sheet, where a rule would only
       underline the padding. */
    display: ${({ $leading }) => ($leading ? 'none' : 'block')};
  }
`

export const AddButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  border: 1px solid var(--color-gray-300);
  background: var(--color-surface);
  color: var(--color-gray-500);
  font-size: 0.75rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  ${Divider}:hover &,
  &:focus-visible {
    opacity: 1;
  }

  /* On a touch screen there is no hover to reveal it, so it always shows. */
  @media (hover: none) {
    opacity: 1;
  }

  &:hover:not(:disabled) {
    border-color: var(--color-brand-blue);
    color: var(--color-brand-blue);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0;
  }
`
