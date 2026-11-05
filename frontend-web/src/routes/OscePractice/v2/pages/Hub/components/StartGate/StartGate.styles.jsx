import styled from 'styled-components'

// The task card the student reads before the bell. This is the one place on the board where
// the scenario is shown whole rather than clamped to a line.
export const TaskCard = styled.div`
  padding: 1rem 1.125rem;
  border-radius: 12px;
  background: var(--color-brand-blue-tint);
  border: 1px solid var(--color-brand-blue-tint-strong);

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.25;
    margin: 0 0 0.5rem;
    color: var(--color-brand-blue-deep);
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.65;
    color: var(--color-gray-700);
    /* Long task cards get a scroll of their own rather than pushing the start button out of
       the modal. */
    max-height: 9.5rem;
    overflow-y: auto;
  }
`

export const TaskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;

  span {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5625rem;
    border-radius: 999px;
    background: var(--color-surface);
    border: 1px solid var(--color-brand-blue-tint-strong);
    color: var(--color-brand-blue-deep);
  }
`

export const Checks = styled.ul`
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  overflow: hidden;
`

export const Check = styled.li`
  display: grid;
  grid-template-columns: 1.75rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;

  & + & {
    border-top: 1px solid var(--color-gray-100);
  }

  svg {
    color: ${({ $ready }) => ($ready ? 'var(--color-brand-green-darker)' : 'var(--color-gray-400)')};
  }

  strong {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-gray-800);
  }

  small {
    display: block;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--color-gray-500);
  }
`

export const GateError = styled.p`
  margin: 0.875rem 0 0;
  padding: 0.75rem 0.875rem;
  border-radius: 10px;
  background: var(--color-danger-tint);
  color: var(--color-danger-dark);
  font-size: 0.8125rem;
  line-height: 1.55;
`

export const Footnote = styled.p`
  margin: 0.875rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--color-gray-500);
`

export const FooterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
`
