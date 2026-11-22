import styled from 'styled-components'

export const Row = styled.li`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0.6rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  background: var(--color-surface);
`

export const Number = styled.span`
  flex-shrink: 0;
  width: 1.4rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-gray-400);
  font-variant-numeric: tabular-nums;
`

export const Body = styled.div`
  flex: 1;
  min-width: 0;
`

// The entry exactly as the generated daftar pustaka will print it, so the list
// is a preview and not a second opinion.
export const Preview = styled.div`
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--color-gray-700);
  overflow-wrap: anywhere;
`

export const TypeTag = styled.span`
  display: inline-block;
  margin-bottom: 0.25rem;
  padding: 0.05rem 0.4rem;
  border-radius: 999px;
  background: ${props => (props.$journal ? 'var(--color-brand-blue-tint-strong)' : 'var(--color-warning-tint)')};
  color: ${props => (props.$journal ? 'var(--color-brand-blue-deep)' : 'var(--color-warning-text)')};
  font-size: 0.65rem;
  font-weight: 700;
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: 0.4rem;
`

// Two columns where the panel has room, one when it does not — the Referensi
// card lives in a pane the student can drag down to 300px.
export const Form = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
  gap: 0.5rem;
  margin-top: 0.4rem;
`

export const WideField = styled.div`
  grid-column: 1 / -1;
`

export const FormActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`
