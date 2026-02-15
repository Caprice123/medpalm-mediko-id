import styled from 'styled-components'

export const PermissionContainer = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`

export const PermissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

export const PermissionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

export const PermissionSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const SectionLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
`

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #4b5563;
  user-select: none;

  &:hover {
    color: #111827;
  }

  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    accent-color: #3b82f6;
  }
`

export const FeatureSubsection = styled.div`
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px solid #e5e7eb;
`

export const FeatureLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
`

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`

export const HintText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
  font-style: italic;
`

export const QuickActionBar = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

export const QuickActionButton = styled.button`
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  background-color: ${props => props.variant === 'primary' ? '#3b82f6' : '#e5e7eb'};
  color: ${props => props.variant === 'primary' ? '#ffffff' : '#4b5563'};
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#2563eb' : '#d1d5db'};
  }
`
