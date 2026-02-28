import styled from 'styled-components'

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
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  box-sizing: border-box;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6BB9E8;
    box-shadow: 0 0 0 3px rgba(107, 185, 232, 0.1);
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
  box-sizing: border-box;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #6BB9E8;
    box-shadow: 0 0 0 3px rgba(107, 185, 232, 0.1);
  }
`

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6BB9E8;
    box-shadow: 0 0 0 3px rgba(107, 185, 232, 0.1);
  }
`

export const HelpText = styled.p`
  color: #9ca3af;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0;
`

export const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
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

  input[type="radio"] {
    display: none;
  }
`

export const StructuresSection = styled.div`
  margin-top: 2rem;
`

export const StructuresSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const StructuresSectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
`

export const StructureCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1rem;
`

export const StructureCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

export const StructureNumber = styled.div`
  font-weight: 600;
  color: #6BB9E8;
  font-size: 0.875rem;
`
