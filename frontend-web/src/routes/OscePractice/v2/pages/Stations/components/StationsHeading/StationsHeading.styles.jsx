import styled from 'styled-components'

export const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gray-600);

  &:hover {
    color: var(--color-brand-blue);
  }

  svg {
    flex: none;
  }
`

export const Heading = styled.div`
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.15;
    margin: 0;
    color: var(--color-gray-800);
  }

  p {
    margin: 0.3125rem 0 0;
    font-size: 0.875rem;
    color: var(--color-gray-600);
  }
`
