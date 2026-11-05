import styled, { keyframes } from 'styled-components'

export const Lead = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--color-gray-700);
`

// What the rubric will have nothing for. Naming it here is the last chance the board gets, and
// it is the same list the worksheet has been showing all along.
export const Unfilled = styled.div`
  margin-top: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  background: var(--color-danger-tint-soft);
  border: 1px solid var(--color-danger-border);

  h3 {
    display: flex;
    align-items: center;
    gap: 0.4375rem;
    font-size: 0.875rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: var(--color-danger-dark);
  }

  ul {
    margin: 0;
    padding-left: 1.125rem;
  }

  li {
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--color-gray-700);
  }
`

export const Consequences = styled.ul`
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.3125rem 0;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--color-gray-600);
  }

  svg {
    flex: none;
    margin-top: 0.1875rem;
    color: var(--color-gray-400);
  }
`

const sweep = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
`

// Evaluation takes a few seconds of real model work, so the dialog reports the stage it is at
// rather than spinning. The steps are the server's actual order of work.
export const Steps = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  overflow: hidden;
`

export const Step = styled.li`
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr);
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${({ $state }) => ($state === 'pending' ? 'var(--color-gray-500)' : 'var(--color-gray-800)')};
  font-weight: ${({ $state }) => ($state === 'current' ? 700 : 400)};

  & + & {
    border-top: 1px solid var(--color-gray-100);
  }

  svg {
    color: ${({ $state }) => {
    if ($state === 'done') return 'var(--color-brand-green-darker)'
    if ($state === 'current') return 'var(--color-brand-blue)'
    return 'var(--color-gray-300)'
  }};
  }
`

export const Sweep = styled.div`
  position: relative;
  height: 3px;
  margin-top: 1rem;
  border-radius: 2px;
  background: var(--color-gray-100);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      var(--color-brand-blue) 45%,
      var(--color-brand-blue-light) 55%,
      transparent
    );
    animation: ${sweep} 1.5s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
      background: var(--color-brand-blue);
    }
  }
`

export const Patience = styled.p`
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--color-gray-500);
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.625rem;
`
