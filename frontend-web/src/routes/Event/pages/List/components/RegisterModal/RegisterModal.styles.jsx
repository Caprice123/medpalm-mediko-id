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
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: 6px;
  font-size: 0.8125rem;
  color: var(--color-gray-700);
`

export const UploadError = styled.p`
  color: var(--color-danger-dark);
  font-size: 0.8125rem;
  margin: 0.5rem 0 0;
`
