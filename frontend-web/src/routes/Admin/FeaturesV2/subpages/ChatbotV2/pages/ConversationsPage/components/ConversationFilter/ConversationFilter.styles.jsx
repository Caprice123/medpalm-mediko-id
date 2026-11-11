import styled from 'styled-components'

// A form, not a div: Enter in either field should run the search, which the
// submit handler covers without per-input key handlers.
export const FilterCard = styled.form`
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

export const FilterActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
`
