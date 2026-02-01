import styled from 'styled-components'

export const FormSection = styled.div`
  margin-bottom: 1.5rem;
`

export const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: #334155;
  margin-bottom: 0.5rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #6BB9E8;
  }

  &::placeholder {
    color: #94a3b8;
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #6BB9E8;
  }

  &::placeholder {
    color: #94a3b8;
  }
`

export const UploadSection = styled.div`
  margin-top: 0.5rem;
`

export const UploadArea = styled.div`
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;

  &:hover {
    border-color: #6BB9E8;
    background: #f0f9ff;
  }
`

export const UploadIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`

export const UploadText = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  margin: 0.25rem 0;
`

export const FileName = styled.div`
  font-weight: 600;
  color: #334155;
  font-size: 0.95rem;
`

export const GenerateButton = styled.button`
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

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
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #dc2626;
  }
`

export const EditorContainer = styled.div`
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  min-height: 400px;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #6BB9E8;
  }

  .bn-container {
    min-height: 400px;
  }
`

export const EditorHint = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  line-height: 1.5;

  strong {
    color: #334155;
    font-weight: 600;
  }
`

export const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`

export const StatusToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background: #f1f5f9;
  border-radius: 8px;
  margin-top: 0.5rem;
`

export const StatusOption = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
  color: ${props => props.checked ? '#0ea5e9' : '#64748b'};
  background: ${props => props.checked ? 'white' : 'transparent'};
  box-shadow: ${props => props.checked ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'};

  &:hover {
    color: ${props => props.checked ? '#0ea5e9' : '#475569'};
  }

  input[type="radio"] {
    display: none;
  }
`

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' ? `
    background: #6BB9E8;
    color: white;

    &:hover:not(:disabled) {
      background: #5AA8D7;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  ` : `
    background: white;
    color: #334155;
    border: 2px solid #e2e8f0;

    &:hover {
      background: #f8fafc;
    }
  `}
`

export const ExistingFileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f0f9ff;
  border: 2px solid #bfdbfe;
  border-radius: 8px;
`

export const FileIcon = styled.div`
  font-size: 2rem;
`
