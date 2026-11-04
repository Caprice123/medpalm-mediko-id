import styled from 'styled-components'

export const PillBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-align: center;
  background: ${p => p.$bg || 'var(--color-brand-green-tint)'};
  color: ${p => p.$color || 'var(--color-brand-green-darker)'};
`

export const SquareBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
  background: ${p => p.$bg || 'var(--color-brand-blue-tint-strong)'};
  color: ${p => p.$color || 'var(--color-brand-blue-deep)'};
`

export const EmptyText = styled.span`
  color: var(--color-gray-300);
  font-size: 0.8125rem;
`
