import styled from 'styled-components'

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
  max-width: 1000px;
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
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
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

export const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`

export const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

export const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }
`

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  min-height: 80px;
  font-family: inherit;
  transition: all 0.3s ease;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr 1fr'};
  gap: 1rem;
`

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }
`

export const HelpText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
`

export const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
`

// Field Builder Styles
export const FieldsSection = styled.div`
  margin: 1.5rem 0;
  padding: 1.25rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
`

export const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const FieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const FieldItem = styled.div`
  background: white;
  padding: 1rem;
  border: 2px solid ${props => props.isDragging ? '#8b5cf6' : '#e5e7eb'};
  border-radius: 8px;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  opacity: ${props => props.isDragging ? 0.7 : 1};
  transition: all 0.2s;

  &:hover {
    border-color: #8b5cf6;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
  }
`

export const DragHandle = styled.div`
  padding: 0.5rem;
  color: #9ca3af;
  cursor: grab;
  font-size: 1.125rem;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`

export const FieldItemContent = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`

export const FieldInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  ${props => props.fullWidth && `
    grid-column: 1 / -1;
  `}
`

export const SmallLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
`

export const SmallInput = styled.input`
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }
`

export const SmallSelect = styled.select`
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
  }
`

export const RemoveButton = styled.button`
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s;
  align-self: flex-start;
  margin-top: 1.5rem;

  &:hover {
    background: #fecaca;
  }
`

export const AddButton = styled.button`
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  border: 2px dashed #8b5cf6;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.75rem;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: #7c3aed;
  }
`

// Options List (for dropdown/radio fields)
export const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 6px;
`

export const OptionItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5rem;
  align-items: center;
`

export const SmallButton = styled.button`
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 0.375rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: #fecaca;
  }
`

// Classification Styles
export const ClassificationsSection = styled.div`
  margin: 1.5rem 0;
  padding: 1.25rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
`

export const ClassificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const ClassificationItem = styled.div`
  background: white;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    border-color: #8b5cf6;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
  }
`

export const ClassificationHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
`

export const ClassificationOptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.75rem;
`

export const ClassificationOptionItem = styled.div`
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`

export const OptionHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

export const ConditionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
`

export const ConditionItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.8fr auto;
  gap: 0.5rem;
  align-items: center;
`

export const SubLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
  display: block;
`

// Modal Footer
export const ModalFooter = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 2px solid #e5e7eb;
  background: white;
  border-radius: 0 0 16px 16px;
`

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(139, 92, 246, 0.5);
    }
  ` : props.variant === 'danger' ? `
    background: #ef4444;
    color: white;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);

    &:hover:not(:disabled) {
      background: #dc2626;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.5);
    }
  ` : `
    background: transparent;
    color: #6b7280;
    border: 2px solid #e5e7eb;

    &:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`

// Confirmation Dialog
export const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1100;
  backdrop-filter: blur(4px);
`

export const ConfirmDialog = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 450px;
  width: 90%;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: scaleIn 0.2s ease;

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`

export const ConfirmIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`

export const ConfirmTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 0.5rem 0;
  text-align: center;
`

export const ConfirmMessage = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  text-align: center;
  line-height: 1.5;
`

export const ConfirmActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`

// Step Indicator
export const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 8px;
  border-left: 4px solid #8b5cf6;
`

export const StepNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StepText = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #8b5cf6;
`

// Info Box
export const InfoBox = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 0.75rem;
`

export const InfoIcon = styled.div`
  color: #3b82f6;
  font-size: 1.25rem;
  flex-shrink: 0;
`

export const InfoText = styled.p`
  font-size: 0.875rem;
  color: #1e40af;
  margin: 0;
  line-height: 1.5;
`

// Example Box
export const ExampleBox = styled.div`
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.75rem;
  margin-top: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #374151;
`
