import styled from 'styled-components'

export const FormSection = styled.div`
  margin-bottom: 1.25rem;
`

export const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

export const HelpText = styled.p`
  color: #9ca3af;
  font-size: 0.75rem;
  margin-top: 0.375rem;
  margin-bottom: 0;
`

export const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`

export const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border: 2px solid ${props => props.$selected ? '#3b82f6' : '#e2e8f0'};
  background: ${props => props.$selected ? '#dbeafe' : 'white'};
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

export const OptionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.$selected ? '#3b82f6' : '#e2e8f0'};
  color: ${props => props.$selected ? 'white' : '#64748b'};
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
`

export const OptionInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 0.9375rem;
  background: transparent;
  transition: all 0.2s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
  }
`

export const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
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
  font-family: inherit;

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
  font-family: inherit;

  &:hover {
    background: #fecaca;
  }
`
