import styled from 'styled-components'

export const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
`

export const HintText = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0.25rem 0 0.75rem 0;
  line-height: 1.5;
`

export const FilterToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1.25rem;

  strong {
    font-size: 0.9375rem;
    color: #111827;
  }
`

export const SelectAllRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;

  span {
    font-size: 0.8125rem;
    color: #6b7280;
  }
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #111827;
  background: #fff;
  outline: none;
  margin-bottom: 0.75rem;
  box-sizing: border-box;

  &::placeholder { color: #9ca3af; }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`

export const DomainCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.5rem;
`

export const DomainCard = styled.button`
  display: flex;
  align-items: flex-start;
  align-self: start;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8125rem;
  font-family: monospace;
  text-align: left;
  word-break: break-all;
  background: ${({ $checked, $disabled }) => $checked ? '#eff6ff' : $disabled ? '#f3f4f6' : '#f9fafb'};
  border: 1.5px solid ${({ $checked, $disabled }) => $checked ? '#3b82f6' : $disabled ? '#e5e7eb' : '#e5e7eb'};
  color: ${({ $checked, $disabled }) => $checked ? '#1d4ed8' : $disabled ? '#d1d5db' : '#374151'};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.15s;

  &:hover {
    ${({ $disabled }) => !$disabled && `
      border-color: #3b82f6;
      background: #eff6ff;
      color: #1d4ed8;
    `}
  }
`

export const DomainCardCheck = styled.span`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid ${({ $checked }) => $checked ? '#3b82f6' : '#d1d5db'};
  background: ${({ $checked }) => $checked ? '#3b82f6' : '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
  font-size: 10px;
  color: #fff;
  transition: all 0.15s;
`

export const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  gap: 0.5rem;
`

export const PageInfo = styled.span`
  font-size: 0.8125rem;
  color: #6b7280;
`

export const PageButtons = styled.div`
  display: flex;
  gap: 0.25rem;
`

export const PageBtn = styled.button`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #f3f4f6;
  }
`

export const SelectedSummarySection = styled.div`
  margin-bottom: 0.75rem;
`

export const SelectedSummaryLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.375rem;
`

export const SelectedChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
`

export const AdminDomainChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 99px;
  font-size: 0.75rem;
  font-family: monospace;
  color: #1d4ed8;

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #3b82f6;
    padding: 0;
    line-height: 1;
    font-size: 0.75rem;
    &:hover { color: #1d4ed8; }
  }
`

export const CustomDomainSection = styled.div`
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
`

export const CustomDomainTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`

export const CustomDomainAddRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

export const CustomDomainInput = styled.input`
  flex: 1;
  padding: 0.4rem 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-family: monospace;
  color: #111827;
  outline: none;

  &::placeholder { color: #9ca3af; }
  &:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
`

export const CustomDomainChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`

export const CustomDomainChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 99px;
  font-size: 0.75rem;
  font-family: monospace;
  color: #92400e;

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #b45309;
    padding: 0;
    line-height: 1;
    font-size: 0.75rem;
    &:hover { color: #92400e; }
  }
`

export const EmptyDomains = styled.div`
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-size: 0.875rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-top: 0.75rem;
`
