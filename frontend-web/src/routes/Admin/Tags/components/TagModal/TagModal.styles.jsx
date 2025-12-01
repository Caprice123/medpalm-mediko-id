import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.15s ease;
`

export const Modal = styled.div`
  background: white;
  border-radius: 8px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  animation: ${slideUp} 0.15s ease;
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
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0;
  line-height: 1;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    color: #6b7280;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ModalBody = styled.div`
  padding: 1.5rem;
`

export const FormGroup = styled.div`
  margin-bottom: 1.25rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`

export const RequiredMark = styled.span`
  color: #ef4444;
  font-weight: 600;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  background: white;
  color: #111827;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.hasError
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(59, 130, 246, 0.1)'};
  }

  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }
`

export const DropdownWrapper = styled.div`
  .Dropdown-root {
    position: relative;
  }

  .Dropdown-control {
    padding: 0.625rem 0.875rem;
    border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
    border-radius: 6px;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
    font-family: inherit;
  }

  .Dropdown-control.Dropdown-disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
    border-color: #e5e7eb;
  }

  .Dropdown-placeholder {
    color: #9ca3af;
  }

  .Dropdown-control:hover:not(.Dropdown-disabled) {
    border-color: ${props => props.hasError ? '#ef4444' : '#9ca3af'};
  }

  .Dropdown-control.is-open:not(.Dropdown-disabled) {
    border-color: ${props => props.hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.hasError
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(59, 130, 246, 0.1)'};
  }

  .Dropdown-menu {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-top: 0.25rem;
    overflow: hidden;
    background: white;
  }

  .Dropdown-option {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
    cursor: pointer;
    color: #374151;

    &:hover {
      background: #f9fafb;
    }

    &.is-selected {
      background: #eff6ff;
      color: #1e40af;
      font-weight: 500;
    }
  }

  .Dropdown-arrow {
    border-color: #6b7280 transparent transparent;
    border-style: solid;
    border-width: 5px 5px 0;
    position: absolute;
    right: 0.875rem;
    top: 50%;
    margin-top: -2.5px;
  }

  .Dropdown-disabled .Dropdown-arrow {
    border-color: #d1d5db transparent transparent;
  }

  .is-open .Dropdown-arrow {
    border-color: transparent transparent #6b7280;
    border-width: 0 5px 5px;
    margin-top: -5px;
  }
`

export const GroupDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
`

export const HintText = styled.div`
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: #6b7280;
`

export const ErrorText = styled.div`
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: #ef4444;
  font-weight: 500;
`

export const EmptyState = styled.div`
  padding: 1.5rem;
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
`

export const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  background: #f9fafb;
`

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;

  ${props => props.variant === 'primary' ? `
    background: #3b82f6;
    color: white;

    &:hover:not(:disabled) {
      background: #2563eb;
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
  width: ${props => props.small ? '12px' : '14px'};
  height: ${props => props.small ? '12px' : '14px'};
  border: 2px solid ${props => props.small ? '#d1d5db' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 50%;
  border-top-color: ${props => props.small ? '#3b82f6' : 'white'};
  animation: ${spin} 0.6s linear infinite;
`
