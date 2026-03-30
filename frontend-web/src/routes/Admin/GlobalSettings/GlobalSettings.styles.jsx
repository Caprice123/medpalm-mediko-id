import styled from 'styled-components'

export const PageTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
`

export const SectionCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.25rem 0;
`

export const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => $cols || '1fr 1fr'};
  gap: 0.75rem;
`

export const ItemCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
`

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`

export const ItemNumber = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
`

export const RemoveButton = styled.button`
  background: none;
  border: 1px solid #fca5a5;
  color: #ef4444;
  border-radius: 6px;
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #fee2e2;
  }
`

export const AddButton = styled.button`
  background: none;
  border: 2px dashed #d1d5db;
  color: #6b7280;
  border-radius: 8px;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 0.25rem;
  transition: border-color 0.2s, color 0.2s;

  &:hover {
    border-color: #6BB9E8;
    color: #6BB9E8;
  }
`
