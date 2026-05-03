import styled from 'styled-components'

export const InfoBox = styled.div`
  background: #fef9c3;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
  color: #b45309;
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
