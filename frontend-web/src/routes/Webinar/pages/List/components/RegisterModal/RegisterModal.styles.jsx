import styled from 'styled-components'

export const Label = styled.p`
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--color-gray-900);
  margin: 0 0 0.25rem;
`

export const HelpText = styled.p`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
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
