import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`

export const TopicHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
`

export const TopicName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.625rem;
  }
`

export const TopicDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-gray-600);
  max-width: 64rem;
  margin: 0;
`

/* The name used to fall back to the raw URL slug while the request was in
   flight, so every visit flashed "sistem-kardiovaskular" as a heading — which
   reads as a bug rather than as loading. */
export const TitleSkeleton = styled.div`
  width: min(24rem, 60%);
  height: 2.25rem;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-200) 50%, var(--color-gray-100) 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`
