import styled from 'styled-components'

// The station runs outside the app shell, so this is the only way back. It sits at the top
// of the rail, far from the destructive end-session button at the bottom, and says plainly
// that the clock does not stop — leaving is not pausing.
export const ExitRow = styled.div`
  flex: none;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-gray-100);
`

export const ExitButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0;
  border: none;
  background: none;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gray-600);

  &:hover {
    color: var(--color-brand-blue-deep);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`

export const ExitNote = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-gray-500);
`

export const RailBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-color: var(--color-gray-300) transparent;
`

export const Section = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-100);

  &:last-of-type {
    border-bottom: none;
  }

  h2 {
    font-size: 0.9375rem;
    font-weight: 600;
    margin: 0 0 0.625rem;
    color: var(--color-gray-800);
  }
`

export const StationTitle = styled.h1`
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 0 0 0.25rem;
  color: var(--color-gray-800);
`

export const StationTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;

  span {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.1875rem 0.5rem;
    border-radius: 999px;
    background: var(--color-brand-blue-tint);
    border: 1px solid var(--color-brand-blue-tint-strong);
    color: var(--color-brand-blue-deep);
  }
`

// The task card. It stays open — V1 made the scenario a collapsible the student had to
// remember to reopen, and the scenario is the one thing a station cannot be worked without.
export const Scenario = styled.div`
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-gray-700);

  p, ul, ol {
    margin: 0 0 0.625rem;
  }

  p:last-child, ul:last-child, ol:last-child {
    margin-bottom: 0;
  }

  strong {
    color: var(--color-gray-800);
  }
`

export const RailFooter = styled.footer`
  flex: none;
  padding: 0.875rem 1rem;
  border-top: 1px solid var(--color-gray-200);

  @media (max-width: 980px) {
    display: none;
  }
`
