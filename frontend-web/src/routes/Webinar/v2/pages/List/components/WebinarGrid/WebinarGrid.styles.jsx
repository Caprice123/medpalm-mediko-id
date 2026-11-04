import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'

export const GridRow = styled(Row)`
  --bs-gutter-x: 1rem;
  --bs-gutter-y: 1rem;
  margin: 0;
`

export const GridCol = styled(Col)`
  display: flex;
`

export const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;

  h2 {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-gray-700);
    margin: 0;
  }

  p {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--color-gray-500);
  }
`

export const LoadMoreRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.75rem;
`
