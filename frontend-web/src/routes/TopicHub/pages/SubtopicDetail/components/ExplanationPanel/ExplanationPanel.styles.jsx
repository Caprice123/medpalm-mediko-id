import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`

export const ExplanationSection = styled.section`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 2rem;
`

export const ExplanationText = styled.p`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #374151;
  margin: 0;
  white-space: pre-wrap;
`

export const SkeletonBlock = styled.div`
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 1200px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  height: 5rem;
  border-radius: 10px;
`
