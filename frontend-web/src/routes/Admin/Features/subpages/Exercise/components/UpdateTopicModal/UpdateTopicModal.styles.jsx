import styled from 'styled-components'

export const FormSection = styled.div`
  margin-bottom: 1.5rem;
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 2}, 1fr);
  gap: 1rem;
`

export const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  min-height: 150px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

export const ContentTypeButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

export const ContentTypeButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.isActive ? '#3b82f6' : '#e5e7eb'};
  background: ${props => props.isActive ? '#3b82f6' : 'white'};
  color: ${props => props.isActive ? 'white' : '#6b7280'};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    border-color: #3b82f6;
    background: ${props => props.isActive ? '#2563eb' : '#eff6ff'};
    color: ${props => props.isActive ? 'white' : '#3b82f6'};
  }
`

export const UploadSection = styled.div`
  margin-top: 0.5rem;
`

export const UploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`

export const UploadIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`

export const UploadText = styled.div`
  color: #374151;
  font-size: 0.9375rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`

export const ExistingFileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #10b981;
  border-radius: 8px;
  background: #ecfdf5;
`

export const FileIcon = styled.div`
  font-size: 2.5rem;
`

export const FileName = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 0.9375rem;
`

export const RemoveFileButton = styled.button`
  padding: 0.5rem 1rem;
  background: white;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fef2f2;
  }
`

export const QuestionsSection = styled.div`
  margin-top: 2rem;
`

export const QuestionsSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const QuestionsSectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
`

export const AddQuestionButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #2563eb;
  }
`

export const QuestionCard = styled.div`
  background: #eff6ff;
  border: 1px solid #93c5fd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  opacity: ${props => props.isDragging ? 0.5 : 1};
`

export const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const QuestionNumber = styled.div`
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const DragHandle = styled.div`
  cursor: grab;
  font-size: 1.2rem;
  color: #9ca3af;

  &:active {
    cursor: grabbing;
  }
`

export const RemoveQuestionButton = styled.button`
  background: #fee2e2;
  color: #991b1b;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fecaca;
  }
`

export const EditQuestionButton = styled.button`
  background: #dbeafe;
  color: #1e40af;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #bfdbfe;
  }
`

export const QuestionText = styled.div`
  font-size: 0.9375rem;
  color: #111827;
  margin-bottom: 1rem;
  line-height: 1.6;

  .blank {
    background: #fef3c7;
    color: #92400e;
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-weight: 600;
    border: 1px solid #fde047;
  }
`

export const AnswerSection = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
`

export const AnswerLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #15803d;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`

export const AnswerText = styled.div`
  font-size: 0.875rem;
  color: #166534;
  font-weight: 500;
`

export const ExplanationSection = styled.div`
  background: #fef3c7;
  border: 1px solid #fde047;
  border-radius: 6px;
  padding: 0.75rem;
`

export const ExplanationLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`

export const ExplanationText = styled.div`
  font-size: 0.875rem;
  color: #713f12;
  line-height: 1.5;
`

export const EditInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

export const EditTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

export const EditButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
`

export const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => {
    if (props.variant === 'primary') {
      return `
        background: #3b82f6;
        color: white;
        &:hover:not(:disabled) {
          background: #2563eb;
        }
      `
    } else if (props.variant === 'success') {
      return `
        background: #10b981;
        color: white;
        &:hover:not(:disabled) {
          background: #059669;
        }
      `
    } else {
      return `
        background: #f3f4f6;
        color: #374151;
        &:hover {
          background: #e5e7eb;
        }
      `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const HelpText = styled.p`
  color: #9ca3af;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
  font-size: 0.9375rem;
`
