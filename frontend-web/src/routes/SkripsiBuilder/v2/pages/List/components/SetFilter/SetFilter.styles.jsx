import styled from 'styled-components'

// A form, not a div: Enter in the field should run the search, which the submit
// handler covers without a per-input key handler. V1 styled this block with an
// inline style object at the call site.
export const FilterCard = styled.form`
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const FilterActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
`
