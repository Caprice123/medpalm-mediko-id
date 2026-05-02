import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const HeaderSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`

export const TitleGroup = styled.div``

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem;
`

export const SectionSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`

export const ActiveBadge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $active }) => $active ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)'};
  color: ${({ $active }) => $active ? '#059669' : '#dc2626'};
`
