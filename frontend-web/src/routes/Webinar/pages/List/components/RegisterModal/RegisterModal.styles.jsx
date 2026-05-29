import styled from 'styled-components'

export const Label = styled.p`
  font-weight: 600;
  font-size: 0.9375rem;
  color: #111827;
  margin: 0 0 0.25rem;
`

export const HelpText = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0 0 0.75rem;
`

export const UploadedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
`

export const UploadedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: #374151;
`

export const UploadError = styled.p`
  color: #dc2626;
  font-size: 0.8125rem;
  margin: 0.5rem 0 0;
`
