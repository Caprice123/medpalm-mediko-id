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

export const SectionTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
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

  input { display: none; }
`

export const QuotaTypeToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

export const QuotaOption = styled.button`
  padding: 0.375rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${({ checked }) => checked ? '#2563eb' : '#d1d5db'};
  background: ${({ checked }) => checked ? '#eff6ff' : 'white'};
  color: ${({ checked }) => checked ? '#1d4ed8' : '#6b7280'};
  transition: all 0.15s;

  &:hover { border-color: #2563eb; }
`

export const FeatureRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid ${({ $enabled }) => $enabled ? '#2563eb' : '#e5e7eb'};
  background: ${({ $enabled }) => $enabled ? '#eff6ff' : '#f9fafb'};
  margin-bottom: 0.5rem;
  transition: all 0.15s;

  /* hari suffix aligns with the input */
  & > p { color: ${({ $enabled }) => $enabled ? '#374151' : '#9ca3af'}; }
`

export const FeatureCheckLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: ${({ $enabled }) => $enabled ? '600' : '400'};
  color: ${({ $enabled }) => $enabled ? '#1d4ed8' : '#6b7280'};

  input { accent-color: #2563eb; }
`

export const FeatureDurationInput = styled.input`
  width: 80px;
  padding: 0.3rem 0.5rem;
  border: 1px solid ${({ disabled }) => disabled ? '#e5e7eb' : '#d1d5db'};
  border-radius: 6px;
  font-size: 0.8125rem;
  color: ${({ disabled }) => disabled ? '#9ca3af' : '#111827'};
  background: ${({ disabled }) => disabled ? '#f3f4f6' : 'white'};
  text-align: center;

  &:focus { outline: none; border-color: #2563eb; }
  &::placeholder { color: #9ca3af; font-size: 0.75rem; }
`

export const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.8125rem;
  margin: 0.25rem 0 0.5rem;
`

export const HintText = styled.p`
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0.25rem 0 0;
`
