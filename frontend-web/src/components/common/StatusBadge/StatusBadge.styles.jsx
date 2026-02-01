import styled from 'styled-components'

const getStatusColors = (status) => {
  switch (status) {
    case 'published':
      return {
        background: '#dcfce7',
        color: '#16a34a'
      }
    case 'testing':
      return {
        background: '#fef3c7',
        color: '#d97706'
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
