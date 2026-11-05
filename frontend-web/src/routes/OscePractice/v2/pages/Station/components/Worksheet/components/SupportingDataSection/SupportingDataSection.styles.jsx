import styled from 'styled-components'

export const Counter = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0.625rem 0 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ $atLimit }) => ($atLimit ? 'var(--color-warning-text)' : 'var(--color-gray-500)')};

  span {
    font-variant-numeric: tabular-nums;
  }
`

export const Group = styled.div`
  margin-top: 0.625rem;

  h4 {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-gray-500);
    margin: 0 0 0.375rem;
  }
`

export const Choice = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.4375rem 0.5rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: ${({ $disabled }) => ($disabled ? 'var(--color-gray-400)' : 'var(--color-gray-700)')};
  background: ${({ $checked }) => ($checked ? 'var(--color-brand-blue-tint)' : 'transparent')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background: ${({ $disabled }) => ($disabled ? 'transparent' : 'var(--color-brand-blue-tint)')};
  }

  input {
    flex: none;
    margin-top: 0.1875rem;
    accent-color: var(--color-brand-blue);
  }
`

// A revealed investigation: its findings, its image, and the student's own reading of it.
export const Result = styled.article`
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-gray-100);

  &:last-of-type {
    border-bottom: none;
  }

  h4 {
    font-size: 0.8125rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: var(--color-gray-800);
  }
`

export const Plate = styled.button`
  display: block;
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0;
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-surface);
  cursor: zoom-in;

  img {
    display: block;
    width: 100%;
    height: 160px;
    object-fit: contain;
  }
`

export const Findings = styled.div`
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--color-gray-700);

  p {
    margin: 0 0 0.375rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-variant-numeric: tabular-nums;
  }

  td, th {
    padding: 0.1875rem 0.375rem;
    border-bottom: 1px solid var(--color-gray-100);
    text-align: left;
  }
`

export const InterpretationLabel = styled.label`
  display: block;
  margin: 0.625rem 0 0.3125rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-gray-700);

  em {
    font-style: normal;
    color: var(--color-danger-dark);
  }
`
