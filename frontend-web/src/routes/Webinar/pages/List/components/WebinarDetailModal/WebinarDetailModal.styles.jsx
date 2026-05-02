import styled from 'styled-components'

export const DetailModalThumb = styled.img`
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  cursor: zoom-in;
`

export const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;

  &:last-child { border-bottom: none; padding-bottom: 0; }
`

export const DetailLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
`

export const DetailText = styled.p`
  font-size: 0.9rem;
  color: #374151;
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
`

export const SpeakerEntry = styled.div`
  margin-top: 0.375rem;
`

export const SpeakerName = styled.p`
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.125rem;
`

export const SuitableList = styled.ul`
  margin: 0.25rem 0 0;
  padding-left: 1.25rem;
`

export const SuitableItem = styled.li`
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.6;
`
