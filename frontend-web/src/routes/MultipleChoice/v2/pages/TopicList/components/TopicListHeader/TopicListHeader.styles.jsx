import styled from 'styled-components'

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 0.75rem;
  gap: 1rem;
  margin-bottom: 1.75rem;
`

export const HeaderLeft = styled.div`
  min-width: 0;
`

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.25rem;

  @media (max-width: 768px) {
    font-size: 1.375rem;
  }
`

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`
