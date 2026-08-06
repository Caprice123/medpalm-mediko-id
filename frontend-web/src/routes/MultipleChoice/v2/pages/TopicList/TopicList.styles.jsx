import styled from 'styled-components'

export const Container = styled.div`
  padding: 2rem;
  min-height: calc(100vh - 44px);

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 100vh;
  }
`
