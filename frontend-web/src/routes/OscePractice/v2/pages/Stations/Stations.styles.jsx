import styled from 'styled-components'

// One column, three stacked sections. No grid: the page has a single job, and the list wants
// every pixel of the container's width for its four columns.
export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
