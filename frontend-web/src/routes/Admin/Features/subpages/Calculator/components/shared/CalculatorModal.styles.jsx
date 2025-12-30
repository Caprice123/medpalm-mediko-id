import styled from 'styled-components'

// Form sections
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
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  box-sizing: border-box;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`

export const Button = styled.button`
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: ${props => props.variant === 'primary' ? '#3b82f6' : '#f3f4f6'};
  color: ${props => props.variant === 'primary' ? 'white' : '#374151'};

  &:hover:not(:disabled) {
    background: ${props => props.variant === 'primary' ? '#2563eb' : '#e5e7eb'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ErrorText = styled.div`
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`

export const HelpText = styled.div`
  color: #64748b;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`

// Fields Section
export const FieldsSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`

export const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`

export const FieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`

export const FieldItem = styled.div`
  background: white;
  border: 1px solid ${props => props.isDragging ? '#3b82f6' : '#e5e7eb'};
  border-radius: 6px;
  padding: 0.75rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  opacity: ${props => props.isDragging ? 0.5 : 1};
  cursor: move;
`

export const DragHandle = styled.div`
  color: #9ca3af;
  cursor: grab;
  font-weight: bold;
  user-select: none;
  padding: 0.25rem 0;

  &:active {
    cursor: grabbing;
  }
`

export const FieldItemContent = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`

export const FieldInputWrapper = styled.div`
  grid-column: ${props => props.fullWidth ? 'span 2' : 'span 1'};
`

export const SmallLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0.25rem;
`

export const SmallInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.813rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`

export const RemoveButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: #fecaca;
  }
`

export const AddButton = styled.button`
  padding: 0.625rem 1rem;
  background: #eff6ff;
  color: #2563eb;
  border: 1px dashed #3b82f6;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background: #dbeafe;
    border-color: #2563eb;
  }
`

export const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const OptionItem = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

export const SmallButton = styled.button`
  padding: 0.375rem 0.625rem;
  background: #f3f4f6;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
  }
`

// Classifications Section
export const ClassificationsSection = styled.div`
  margin-bottom: 1.5rem;
`

export const ClassificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 0.75rem;
`

export const ClassificationItem = styled.div`
  padding: 1rem;
  background: #faf5ff;
  border: 1px solid #e9d5ff;
  border-radius: 8px;
`

export const ClassificationHeader = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
`

export const ClassificationOptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.75rem;
`

export const ClassificationOptionItem = styled.div`
  padding: 0.75rem;
  background: white;
  border: 1px solid #e9d5ff;
  border-radius: 6px;
`

export const OptionHeader = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
`

export const ConditionsList = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
`

export const ConditionItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr auto;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const SubLabel = styled.label`
  display: block;
  font-size: 0.688rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0.25rem;
`

// Info boxes
export const InfoBox = styled.div`
  padding: 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  margin-bottom: 1rem;
  display: flex;
  gap: 0.75rem;
`

export const InfoIcon = styled.div`
  font-size: 1.25rem;
`

export const InfoText = styled.div`
  font-size: 0.813rem;
  color: #1e40af;
  line-height: 1.5;
`

export const ExampleBox = styled.div`
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.6;
`

// References
export const ReferencesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

export const ReferenceItem = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
`

export const ReferenceText = styled.div`
  flex: 1;
  font-size: 0.813rem;
  color: #374151;
`

export const RemoveReferenceButton = styled.button`
  padding: 0.25rem 0.5rem;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fecaca;
  }
`

export const AddReferenceWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

// Status toggle
export const StatusToggle = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 6px;
`

export const StatusOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;

  input[type="radio"] {
    cursor: pointer;
  }
`

// Confirm dialog
export const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1100;
`

export const ConfirmDialog = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`

export const ConfirmIcon = styled.div`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
`

export const ConfirmTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin: 0 0 0.5rem 0;
`

export const ConfirmMessage = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin: 0 0 1.5rem 0;
`

export const ConfirmActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`

// Form row
export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
`
