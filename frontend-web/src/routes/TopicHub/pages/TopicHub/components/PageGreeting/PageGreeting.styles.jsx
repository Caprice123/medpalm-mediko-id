import styled from 'styled-components'

export const PageHeader = styled.div`
  margin-bottom: 1.5rem;
`

/* Small on purpose. At 2.375rem this was the largest, highest-contrast thing
   on the page and it told the student nothing they did not already know,
   while the 22 topics they came to click sat at 0.9375rem. On a surface whose
   job is "pick a topic", the greeting orients; the sections lead. */
export const Greeting = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--color-gray-900);
  margin: 0 0 0.25rem;
`

/* The name in brand blue, the way the landing hero sets its second headline
   line — it makes the greeting read as addressed to this person rather than as
   a generic page title. */
export const GreetingName = styled.span`
  color: var(--color-brand-blue);
`

export const GreetingSubtitle = styled.p`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-gray-600);
  margin: 0;
`
