import styled from 'styled-components'

export const PageHeader = styled.div`
  margin-bottom: 2rem;
`

export const Greeting = styled.h1`
  font-size: 2.375rem;
  font-weight: 700;
  line-height: 1.15;
  color: var(--color-gray-900);
  margin: 0 0 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.875rem;
  }
`

/* The name in brand blue, the way the landing hero sets its second headline
   line — it makes the greeting read as addressed to this person rather than as
   a generic page title. */
export const GreetingName = styled.span`
  color: var(--color-brand-blue);
`

export const GreetingSubtitle = styled.p`
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--color-gray-600);
  max-width: 46rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`
