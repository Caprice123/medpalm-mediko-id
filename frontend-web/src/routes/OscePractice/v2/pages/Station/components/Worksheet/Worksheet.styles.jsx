import styled from 'styled-components'

// The head's right-hand group: the completeness label, and the close control that only exists
// once the board has folded the worksheet into a drawer.
export const HeadRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`

export const CloseWorksheet = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 7px;
  border: 1px solid var(--color-gray-200);
  background: var(--color-surface);
  color: var(--color-gray-600);

  &:hover {
    border-color: var(--color-brand-blue);
    color: var(--color-brand-blue-deep);
  }
`

// The completeness label in the head. Green when the rubric has something for every section,
// danger red while it does not — the same red the clock uses, because it is the same problem.
export const Completeness = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${({ $complete }) => ($complete
    ? 'var(--color-brand-green-darker)'
    : 'var(--color-danger-dark)')};
`

// Shared by every worksheet section: the summary line under a field.
export const Hint = styled.p`
  margin: 0.375rem 0 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-gray-500);
`

// Shared by SupportingDataSection and DiagnosisSection: a row the student has added, removable.
export const EntryRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-gray-100);

  &:last-of-type {
    border-bottom: none;
  }

  span {
    flex: 1;
    min-width: 0;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--color-gray-700);
    overflow-wrap: anywhere;
  }
`

export const RemoveEntry = styled.button`
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 6px;
  border: 1px solid var(--color-gray-200);
  background: var(--color-surface);
  color: var(--color-gray-500);

  &:hover {
    border-color: var(--color-danger-border);
    color: var(--color-danger-dark);
  }
`

// Shared by SupportingDataSection and DiagnosisSection.
export const EmptyEntries = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
  color: var(--color-gray-500);
`

// Shared by SupportingDataSection and DiagnosisSection: an input with its add button beside it.
export const AddRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 0.5rem;
`

export const FieldGroup = styled.div`
  & + & {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-gray-100);
  }

  h3 {
    font-size: 0.8125rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: var(--color-gray-700);
  }
`

export const SubmitRow = styled.div`
  margin-top: 0.875rem;
`
