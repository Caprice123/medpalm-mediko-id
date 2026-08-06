import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 1200px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  border-radius: 8px;
`

export const PageHeader = styled.div`
  margin-bottom: 0.5rem;
`

export const SubtopicName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.375rem;
  line-height: 1.3;
`

export const SkeletonTitle = styled(SkeletonBase)`
  height: 2rem;
  width: 55%;
  margin-bottom: 0.5rem;
`

export const SkeletonSubtitle = styled(SkeletonBase)`
  height: 1rem;
  width: 20%;
  margin-bottom: 1.5rem;
`
