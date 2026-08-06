import styled from 'styled-components'

export const PillBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: ${p => p.$bg || '#ede9fe'};
  color: ${p => p.$color || '#6d28d9'};
`

export const SquareBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${p => p.$bg || '#dbeafe'};
  color: ${p => p.$color || '#1d4ed8'};
`

export const EmptyText = styled.span`
  color: #d1d5db;
  font-size: 0.8125rem;
`
