import styled from 'styled-components'

export const FilterContainer = styled.div`
  /* background: white; */
  /* border: 1px solid #e5e7eb; */
  border-radius: 8px;
  /* padding: 1.25rem; */
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    /* padding: 1rem; */
  }
`

export const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const FilterTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
`

export const ClearButton = styled.button`
  background: transparent;
  color: #6BB9E8;
  border: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #4A9ED4;
    text-decoration: underline;
  }
`

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

export const FilterLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
`
