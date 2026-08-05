import styled from 'styled-components'

export const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const SectionCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`

export const SectionTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

export const ActionGroup = styled.div`
  display: flex;
  gap: 0.375rem;
  justify-content: flex-end;
`

export const Description = styled.span`
  font-size: 0.8125rem;
  color: #6b7280;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`
