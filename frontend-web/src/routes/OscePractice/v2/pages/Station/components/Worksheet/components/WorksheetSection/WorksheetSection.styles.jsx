import styled from 'styled-components'

export const Section = styled.section`
  border-bottom: 1px solid var(--color-gray-100);

  &:last-of-type {
    border-bottom: none;
  }
`

// The header carries the state mark and never collapses with the body. That is the whole point
// of the worksheet: a student can fold the editing surface away and still see, at a glance,
// that Diagnosis has nothing in it.
export const Header = styled.button`
  display: grid;
  grid-template-columns: 1.25rem minmax(0, 1fr) auto 1rem;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  text-align: left;
  background: ${({ $open }) => ($open ? 'var(--color-brand-blue-tint)' : 'transparent')};

  &:hover {
    background: var(--color-brand-blue-tint);
  }

  > svg:first-child {
    color: ${({ $filled }) => ($filled
    ? 'var(--color-brand-green-darker)'
    : 'var(--color-danger-dark)')};
  }

  > svg:last-child {
    color: var(--color-gray-500);
  }
`

export const Label = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-800);
`

// The one place on the board where red is used for something other than the clock: an unfilled
// rubric section is the same class of problem as running out of time.
export const Detail = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: ${({ $filled }) => ($filled ? 'var(--color-gray-500)' : 'var(--color-danger-dark)')};
  white-space: nowrap;
`

export const Body = styled.div`
  padding: 0 1rem 1rem;
`
