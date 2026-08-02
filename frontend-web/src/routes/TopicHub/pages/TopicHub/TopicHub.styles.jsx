import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const Container = styled.div`
  padding: 2.5rem 2.5rem 4rem;
  animation: ${fadeUp} 0.35s ease both;
`
