import styled from "styled-components"

// Styled Components
export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`

export const Modal = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 16px 16px 0 0;
`

export const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

export const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 2px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  background: white;
  border-radius: 0 0 16px 16px;
`

export const Section = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: ${props => props.showBorder ? '2px solid #e5e7eb' : 'none'};

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`

export const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const FormGroup = styled.div`
  margin-bottom: 1.25rem;
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
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
  }
`

export const TypeSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`

export const TypeOption = styled.button`
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#06b6d4' : '#e5e7eb'};
  background: ${props => props.selected ? 'rgba(6, 182, 212, 0.1)' : 'white'};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: ${props => props.selected ? '#06b6d4' : '#6b7280'};

  &:hover {
    border-color: #06b6d4;
    background: rgba(6, 182, 212, 0.05);
  }

  span:first-child {
    font-size: 2rem;
  }
`

export const FileUpload = styled.div`
  input[type="file"] {
    display: none;
  }

  label {
    display: block;
    padding: 2rem;
    border: 2px dashed #e5e7eb;
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #06b6d4;
      background: rgba(6, 182, 212, 0.05);
    }

    div:first-child {
      font-size: 3rem;
    }
  }
`

export const FileName = styled.span`
  color: #06b6d4;
  font-weight: 600;
`

export const FileUploadText = styled.div`
  margin-top: 0.5rem;
  color: #6b7280;
`

export const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const CardItem = styled.div`
  background: #f9fafb;
  border: 2px solid ${props => props.isDragging ? '#06b6d4' : '#e5e7eb'};
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  transform: ${props => props.transform};
  opacity: ${props => props.isDragging ? 0.5 : 1};
  cursor: ${props => props.isDragging ? 'grabbing' : 'default'};

  &:hover {
    border-color: #06b6d4;
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.1);
  }
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`

export const CardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const DragHandle = styled.div`
  cursor: grab;
  color: #9ca3af;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: color 0.2s;

  &:hover {
    color: #06b6d4;
  }

  &:active {
    cursor: grabbing;
  }
`

export const CardNumber = styled.div`
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
`

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, #06b6d4, #0891b2);
    color: white;
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: white;
    color: #6b7280;
    border: 2px solid #e5e7eb;

    &:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }
  `}

  ${props => props.variant === 'danger' && `
    background: transparent;
    color: #ef4444;
    border: 2px solid #ef4444;

    &:hover {
      background: #ef4444;
      color: white;
    }
  `}
`

export const GenerateSection = styled.div`
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
`

export const CountInput = styled.input`
  width: 80px;
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  padding: 1.5rem;
  border-top: 2px solid #e5e7eb;
  background: white;
  border-radius: 0 0 16px 16px;
`

export const ButtonGroupLeft = styled.div`
  display: flex;
  gap: 0.75rem;
`

export const ButtonGroupRight = styled.div`
  display: flex;
  gap: 0.75rem;
`

export const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
  font-size: 0.875rem;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
`

export const AddCardButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: rgba(6, 182, 212, 0.1);
  border: 2px dashed #06b6d4;
  border-radius: 12px;
  color: #06b6d4;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(6, 182, 212, 0.2);
    border-color: #0891b2;
  }
`

export const AddCardButtonWrapper = styled.div`
  margin-top: 1rem;
`

export const GenerateButton = styled(Button)`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
`

export const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`
