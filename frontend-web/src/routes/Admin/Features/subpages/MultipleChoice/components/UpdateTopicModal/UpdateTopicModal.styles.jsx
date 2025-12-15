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
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 2}, 1fr);
  gap: 1rem;
`

export const ImageUploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  ${props => props.hasImage && `
    border-style: solid;
    border-color: #10b981;
    background: #ecfdf5;
  `}
`

export const ImageUploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #9ca3af;
`

export const ImageUploadText = styled.p`
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0.25rem 0;
`

export const ImageUploadHint = styled.p`
  color: #9ca3af;
  font-size: 0.625rem;
  margin: 0;
`

export const ImagePreview = styled.div`
  position: relative;
  width: 100%;
`

export const PreviewImage = styled.img`
  width: 100%;
  max-height: 150px;
  object-fit: contain;
  border-radius: 6px;
`

export const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
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
`

export const QuestionCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const QuestionNumber = styled.div`
  font-weight: 600;
  color: #3b82f6;
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

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`

export const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border: 2px solid ${props => props.isSelected ? '#3b82f6' : '#e2e8f0'};
  background: ${props => props.isSelected ? '#dbeafe' : 'white'};
  border-radius: 12px;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    transform: translateX(2px);
  }
`

export const OptionLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.isSelected ? '#3b82f6' : '#e2e8f0'};
  color: ${props => props.isSelected ? 'white' : '#64748b'};
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
  cursor: pointer;
`

export const OptionRadio = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`

export const OptionInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 1rem;
  background: transparent;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
  }
`

export const AddOptionButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #d1d5db;
  background: transparent;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #eff6ff;
  }
`

export const RemoveOptionButton = styled.button`
  padding: 0.25rem 0.5rem;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #fecaca;
  }
`

export const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
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
    accent-color: #3b82f6;
  }
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

// File Upload Styles (Summary Notes Pattern)
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

export const GenerateButton = styled.button`
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

  &:hover {
    background: #fef2f2;
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
