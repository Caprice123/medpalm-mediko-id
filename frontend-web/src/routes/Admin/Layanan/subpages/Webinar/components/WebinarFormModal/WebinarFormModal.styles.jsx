import styled from 'styled-components'

export const FormSection = styled.div`
  margin-bottom: 1.25rem;
`

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const StatusToggle = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`

export const StatusOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  border: 1px solid ${({ checked }) => checked ? '#2563eb' : '#d1d5db'};
  background: ${({ checked }) => checked ? '#eff6ff' : 'white'};
  transition: all 0.15s;

  input {
    display: none;
  }
`

export const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.8125rem;
  margin: 0.25rem 0 0.5rem;
`

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
`

export const AddButton = styled.button`
  font-size: 0.8125rem;
  font-weight: 500;
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover { text-decoration: underline; }
`

export const RemoveButton = styled.button`
  font-size: 0.8125rem;
  font-weight: 500;
  color: #dc2626;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 0.25rem;
  white-space: nowrap;

  &:hover { text-decoration: underline; }
`

export const SpeakerCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.75rem;
`

export const SpeakerCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.875rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
`

export const SpeakerCardBody = styled.div`
  padding: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const LinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

export const LinkRowInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr auto;
    & > *:nth-child(2) { grid-column: 1; }
  }
`
