import styled from 'styled-components'

// Sits between the thread and the composer, so what will be sent is read on
// the way to pressing Kirim rather than hidden behind a settings icon.
//
// The whole row is the button: there is nothing else on it, and a separate
// "Atur" control beside a summary that is not itself clickable is a target the
// student has to aim at.
export const Bar = styled.button`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  border-top: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: var(--color-gray-100);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
  }
`

export const BarLabel = styled.span`
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-gray-500);
`

// One line, always: a report with three long section titles attached must not
// push the composer down the panel.
export const Summary = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.72rem;
  color: ${({ $empty }) => ($empty ? 'var(--color-gray-400)' : 'var(--color-gray-800)')};
  font-style: ${({ $empty }) => ($empty ? 'italic' : 'normal')};
`

export const EditHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-brand-blue);
`
