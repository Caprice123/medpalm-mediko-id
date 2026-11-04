import styled from 'styled-components'

const getStatusColors = (status) => {
  switch (status) {
    case 'published':
      return {
        background: 'var(--color-brand-green-tint)',
        color: 'var(--color-brand-green-dark)'
      }
    case 'testing':
      return {
        background: 'var(--color-warning-tint)',
        color: 'var(--color-warning-dark)'
      }
    case 'draft':
    default:
      return {
        background: '#e0e7ff',
        color: '#4f46e5'
      }
  }
}

export const Badge = styled.span`
  background: ${props => getStatusColors(props.status).background};
  color: ${props => getStatusColors(props.status).color};
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  white-space: nowrap;
  display: inline-block;
`
