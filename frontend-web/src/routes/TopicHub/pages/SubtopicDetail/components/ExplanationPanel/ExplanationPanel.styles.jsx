import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`

export const ExplanationText = styled.p`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--color-gray-700);
  /* Held to a readable measure; full-bleed prose on a wide screen loses the
     line it is on. */
  max-width: 68ch;
  margin: 0;
  white-space: pre-wrap;
`

export const SkeletonBlock = styled.div`
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-200) 50%, var(--color-gray-100) 75%);
  background-size: 1200px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  height: 5rem;
  border-radius: 10px;
`
