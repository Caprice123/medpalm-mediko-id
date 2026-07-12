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

export const CardsSection = styled.div`
  margin-top: 2rem;
`

export const CardsSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const CardsSectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
`

export const AddCardButton = styled.button`
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

export const FlashcardCard = styled.div`
  background: #eff6ff;
  border: 1px solid #93c5fd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  opacity: ${props => props.isDragging ? 0.5 : 1};
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const CardNumber = styled.div`
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

export const RemoveCardButton = styled.button`
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

export const RelationsTabBar = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 0.875rem;
`

export const RelationsTab = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${p => p.$active ? '#0d9488' : '#6b7280'};
  border: none;
  border-bottom: 2px solid ${p => p.$active ? '#0d9488' : 'transparent'};
  background: none;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: -1px;

  &:hover { color: #0d9488; }
`

export const RelationsTabCount = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0.0625rem 0.375rem;
  border-radius: 99px;
  background: ${p => p.$active ? '#ccfbf1' : '#f3f4f6'};
  color: ${p => p.$active ? '#0f766e' : '#9ca3af'};
`

export const RelationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 0.5rem;
`

export const RelationTypeBadge = styled.span`
  padding: 0.125rem 0.5rem;
  border-radius: 99px;
  font-size: 0.6875rem;
  font-weight: 700;
  white-space: nowrap;
  background: ${p => p.$type === 'mcq_topic' ? '#ede9fe' : '#fef9c3'};
  color: ${p => p.$type === 'mcq_topic' ? '#6d28d9' : '#92400e'};
`

export const RelationTitle = styled.span`
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RelationAddRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  margin-top: 0.75rem;
`
