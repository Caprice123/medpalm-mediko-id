import styled from 'styled-components'

export const Heading = styled.header`
  h1 {
    font-size: clamp(1.5rem, 2.2vw, 1.875rem);
    font-weight: 700;
    color: var(--color-brand-blue-deep);
    margin: 0 0 0.25rem;
  }

  p {
    margin: 0;
    font-size: 0.9375rem;
    color: var(--color-gray-500);
  }
`
