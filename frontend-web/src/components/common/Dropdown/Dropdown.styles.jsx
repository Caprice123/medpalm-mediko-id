import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
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
  margin-left: 0.25rem;
`

export const DropdownControl = styled.div`
  padding: 0.625rem 2.5rem 0.625rem 0.875rem;
  min-height: 44px;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 6px;
  font-size: 0.875rem;
  background: ${props => props.disabled ? '#f9fafb' : 'white'};
  color: ${props => props.disabled ? '#9ca3af' : '#111827'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-family: inherit;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  position: relative;
  transition: all 0.2s ease;

  ${props => !props.disabled && `
    &:hover {
      border-color: ${props.hasError ? '#ef4444' : '#9ca3af'};
    }
  `}

  ${props => props.isOpen && !props.disabled && `
    border-color: ${props.hasError ? '#ef4444' : '#6BB9E8'};
    box-shadow: 0 0 0 3px ${props.hasError
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(107, 185, 232, 0.15)'};
  `}

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
  }
`

export const DropdownPlaceholder = styled.div`
  color: #9ca3af;
`

export const DropdownValue = styled.div`
  color: #111827;
`

export const DropdownArrow = styled.div`
  position: absolute;
  right: 0.875rem;
  top: 50%;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: ${props => props.disabled ? '#d1d5db' : '#6b7280'} transparent transparent;
  border-width: 5px 5px 0;
  margin-top: -2.5px;
  transition: all 0.2s ease;

  ${props => props.isOpen && `
    border-color: transparent transparent ${props.disabled ? '#d1d5db' : '#6b7280'};
    border-width: 0 5px 5px;
    margin-top: -5px;
  `}
`

export const DropdownMenu = styled.div`
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  max-height: 200px;
  overflow-y: auto;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`

export const DropdownOption = styled.div`
  padding: 0.625rem 0.875rem;
  min-height: 44px;
  font-size: 0.875rem;
  cursor: pointer;
  color: #374151;
  display: flex;
  align-items: center;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(107, 185, 232, 0.08);
  }

  &:active {
    background: rgba(107, 185, 232, 0.15);
  }

  ${props => props.isSelected && `
    background: rgba(107, 185, 232, 0.15);
    color: #4A9ED4;
    font-weight: 500;
  `}

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.75rem 1rem;
  }
`
