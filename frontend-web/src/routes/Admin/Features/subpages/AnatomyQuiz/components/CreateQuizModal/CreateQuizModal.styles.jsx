import styled from 'styled-components'

export const FormSection = styled.div`
  margin-bottom: 1.5rem;
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
    border-color: #6BB9E8;
    box-shadow: 0 0 0 3px rgba(107, 185, 232, 0.1);
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
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6BB9E8;
    box-shadow: 0 0 0 3px rgba(107, 185, 232, 0.1);
  }
`

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6BB9E8;
    box-shadow: 0 0 0 3px rgba(107, 185, 232, 0.1);
  }
`

export const ImageUploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;

  &:hover {
    border-color: #6BB9E8;
    background: #f0f9ff;
  }
`

export const ImageUploadIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`

export const ImageUploadText = styled.div`
  color: #374151;
  font-size: 0.9375rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`

export const ImageUploadHint = styled.div`
  color: #9ca3af;
  font-size: 0.85rem;
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

export const FileActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const PreviewButton = styled.button`
  padding: 0.5rem 1rem;
  background: white;
  color: #6BB9E8;
  border: 1px solid #6BB9E8;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: #6BB9E8;
    color: white;
  }
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
  white-space: nowrap;

  &:hover {
    background: #dc2626;
    color: white;
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
  background: #6BB9E8;
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
    background: #5aa8d7;
  }
`

export const QuestionCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`

export const QuestionCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const QuestionNumber = styled.div`
  font-weight: 600;
  color: #6BB9E8;
  font-size: 0.875rem;
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

export const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 1}, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

export const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(107, 185, 232, 0.1);
  border: 1px solid rgba(107, 185, 232, 0.3);
  color: #6BB9E8;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;

  span {
    line-height: 1;
  }
`

export const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: #6BB9E8;
  cursor: pointer;
  padding: 0;
  margin: 0;
  font-size: 1.125rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: rgba(107, 185, 232, 0.2);
    color: #5aa8d7;
  }
`

export const SelectTagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`

export const AddTagButton = styled.button`
  background: #6BB9E8;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #5aa8d7;
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`

export const EmptyTagsMessage = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0 0 0.75rem 0;
  font-style: italic;
`

export const HelpText = styled.p`
  color: #9ca3af;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0;
`

export const StatusToggle = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`

export const StatusOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;

  input {
    cursor: pointer;
  }
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
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
        background: linear-gradient(135deg, #6BB9E8, #8DC63F);
        color: white;
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(107, 185, 232, 0.4);
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
    transform: none !important;
  }
`
