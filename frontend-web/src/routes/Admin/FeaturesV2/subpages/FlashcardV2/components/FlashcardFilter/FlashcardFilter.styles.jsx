import styled from 'styled-components'

export const FilterWrap = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
`

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex: 1;
  min-width: 160px;
`

export const FilterLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`
