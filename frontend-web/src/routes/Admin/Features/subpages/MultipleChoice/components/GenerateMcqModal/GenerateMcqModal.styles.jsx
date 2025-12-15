import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

export const Modal = styled.div`
  background: white;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`

export const ModalHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`

export const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

export const TypeSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`

export const TypeOption = styled.button`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid ${props => props.active ? '#ec4899' : '#d1d5db'};
  border-radius: 8px;
  background: ${props => props.active ? '#fdf2f8' : 'white'};
  color: ${props => props.active ? '#ec4899' : '#374151'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;

  &:hover {
    border-color: #ec4899;
    background: #fdf2f8;
  }
`

export const TypeIcon = styled.div`
  font-size: 2rem;
  min-width: 40px;
  text-align: center;
`

export const TypeContent = styled.div`
  flex: 1;
`

export const TypeLabel = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`

export const TypeDescription = styled.div`
  font-size: 0.75rem;
  font-weight: 400;
  color: ${props => props.active ? '#db2777' : '#6b7280'};
`

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  min-height: 200px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }
`

export const FileUploadArea = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: #ec4899;
    background: #fdf2f8;
  }

  ${props => props.hasFile && `
    border-style: solid;
    border-color: #ec4899;
    background: #fdf2f8;
  `}
`

export const FileUploadIcon = styled.div`
  font-size: 3rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
`

export const FileUploadText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.5rem 0;
  font-weight: 500;
`

export const FileUploadHint = styled.p`
  color: #9ca3af;
  font-size: 0.75rem;
  margin: 0;
`

export const FileName = styled.div`
  color: #ec4899;
  font-weight: 600;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }
`

export const HintText = styled.div`
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: #6b7280;
`

export const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  ${props => props.variant === 'primary' ? `
    background: #ec4899;
    color: white;
    &:hover:not(:disabled) {
      background: #db2777;
    }
  ` : `
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
    &:hover:not(:disabled) {
      background: #f9fafb;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
