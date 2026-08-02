import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

export const Container = styled.div`
  padding: 1.75rem 2rem 4rem;
  animation: ${fadeUp} 0.3s ease both;
`

// Shared by ExplanationPanel, RelatedContentSection, and AtlasModelsSection
export const SectionLabel = styled.h3`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #10b981;
  margin: 0 0 0.625rem;
`
