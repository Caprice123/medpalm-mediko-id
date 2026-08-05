import styled from 'styled-components'

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1.25rem;
`

export const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
`

export const Input = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #111827;
  outline: none;
  &:focus { border-color: #6366f1; }
`

export const Textarea = styled.textarea`
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #111827;
  resize: vertical;
  min-height: 80px;
  outline: none;
  &:focus { border-color: #6366f1; }
`

export const HelpText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
`

export const ErrorText = styled.p`
  font-size: 0.75rem;
  color: #ef4444;
  margin: 0;
`

export const StatusToggle = styled.div`
  display: flex;
  gap: 1rem;
`

export const StatusOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: ${({ $checked }) => $checked ? '600' : '400'};
  color: ${({ $checked }) => $checked ? '#111827' : '#6b7280'};
  cursor: pointer;
`

export const EditorContainer = styled.div`
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  min-height: 120px;
  overflow: hidden;
`

export const EditorHint = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
`
