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

export const MediaTypeToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

export const MediaTypeButton = styled.button`
  padding: 0.375rem 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid ${({ $active }) => $active ? '#6366f1' : '#d1d5db'};
  background: ${({ $active }) => $active ? '#6366f1' : '#fff'};
  color: ${({ $active }) => $active ? '#fff' : '#374151'};
  font-size: 0.8125rem;
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.15s;
`

export const QuestionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`

export const QuestionsSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const QuestionsTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
`

export const QuestionCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.875rem;
  background: #f9fafb;
`

export const QuestionCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`

export const QuestionNumber = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
`

export const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid ${({ $selected }) => $selected ? '#6366f1' : '#e5e7eb'};
  border-radius: 0.25rem;
  background: ${({ $selected }) => $selected ? '#f0f0ff' : '#fff'};
  cursor: pointer;
`

export const OptionLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ $selected }) => $selected ? '#6366f1' : '#9ca3af'};
  min-width: 1rem;
`

export const OptionInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  color: #111827;
  outline: none;
`
