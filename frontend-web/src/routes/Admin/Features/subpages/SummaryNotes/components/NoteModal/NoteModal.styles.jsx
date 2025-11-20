import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
`

export const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 1200px;
  max-height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.3s ease;
`

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
`

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #059669;
  margin: 0;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s ease;

  &:hover:not(:disabled) {
    color: #374151;
  }

  &:disabled {
    cursor: not-allowed;
  }
`

export const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
`

export const FormSection = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 1rem 0;
`

export const FormGroup = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.5rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #10b981;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #10b981;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #10b981;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`

export const EditorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 600px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`

export const EditorSection = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`

export const EditorHeader = styled.div`
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
`

export const EditorTextArea = styled.textarea`
  flex: 1;
  padding: 1rem;
  border: none;
  resize: none;
  font-family: 'Fira Code', monospace;
  font-size: 0.875rem;
  line-height: 1.6;

  &:focus {
    outline: none;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`

export const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`

export const PreviewContent = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;

  h1, h2, h3, h4, h5, h6 {
    color: #059669;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.25rem; }
  h3 { font-size: 1.125rem; }

  p { margin: 0.75em 0; }

  ul, ol {
    margin: 0.75em 0;
    padding-left: 1.25em;
  }

  li { margin: 0.25em 0; }

  strong { color: #059669; }

  code {
    background: #f3f4f6;
    padding: 0.125em 0.25em;
    border-radius: 4px;
    font-size: 0.8em;
  }

  pre {
    background: #1f2937;
    color: #f9fafb;
    padding: 0.75rem;
    border-radius: 6px;
    overflow-x: auto;

    code {
      background: transparent;
      padding: 0;
      color: inherit;
    }
  }

  blockquote {
    border-left: 3px solid #10b981;
    margin: 0.75em 0;
    padding: 0.5em 1em;
    background: #ecfdf5;
    color: #059669;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.75em 0;
  }

  th, td {
    border: 1px solid #e5e7eb;
    padding: 0.5rem;
    text-align: left;
  }

  th {
    background: #f3f4f6;
    font-weight: 600;
  }
`

export const TagSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const TagGroup = styled.div``

export const TagCheckbox = styled.input`
  display: none;
`

export const TagLabel = styled.label`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.selected ? `
    background: #10b981;
    color: white;
  ` : `
    background: #f3f4f6;
    color: #6b7280;

    &:hover {
      background: #e5e7eb;
    }
  `}
`

export const UploadSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

export const UploadArea = styled.div`
  flex: 1;
  position: relative;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #10b981;
    background: #f0fdf4;
  }
`

export const UploadInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`

export const UploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`

export const UploadText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;

  strong {
    color: #10b981;
  }

  span {
    font-size: 0.75rem;
    color: #9ca3af;
  }
`

export const FileName = styled.span`
  color: #374151;
  font-weight: 600;
`

export const ExistingFileContainer = styled.div`
  flex: 1;
  background: #f0fdf4;
  border: 1px solid #10b981;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const ExistingFileIcon = styled.div`
  font-size: 1.5rem;
`

export const ExistingFileInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const ExistingFileLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`

export const ExistingFileName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const FileActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const FileActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'download' ? `
    background: #10b981;
    color: white;

    &:hover {
      background: #059669;
    }
  ` : `
    background: #f3f4f6;
    color: #6b7280;
    border: none;

    &:hover {
      background: #e5e7eb;
    }
  `}
`

export const RemoveFileButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #fef2f2;
  color: #dc2626;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fee2e2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const GenerateButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
`

export const FooterButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
    }
  ` : `
    background: white;
    color: #6b7280;
    border: 1px solid #e5e7eb;

    &:hover:not(:disabled) {
      background: #f3f4f6;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

export const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`

export const SuccessMessage = styled.div`
  background: #ecfdf5;
  border: 1px solid #6ee7b7;
  color: #059669;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`

export const MarkdownHelpSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`

export const HelpTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const HelpGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
`

export const HelpItem = styled.div`
  font-size: 0.75rem;
  color: #475569;

  code {
    background: #e2e8f0;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    font-size: 0.7rem;
    color: #334155;
  }

  span {
    color: #94a3b8;
    margin-left: 0.25rem;
  }
`
