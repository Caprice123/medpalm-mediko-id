import styled from 'styled-components'

export const Container = styled.div`
  background: var(--color-surface);
  border-top: 1px solid var(--color-gray-200);
  padding: 1rem 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`

export const InputWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`

export const Textarea = styled.textarea`
  flex: 1;
  padding: 0.875rem 1rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-size: 0.9375rem;
  font-family: inherit;
  resize: none;
  max-height: 150px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-brand-blue);
    box-shadow: 0 0 0 3px rgba(30, 115, 170, 0.1);
  }

  &::placeholder {
    color: var(--color-gray-400);
  }

  &:disabled {
    background: var(--color-gray-50);
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.875rem;
    max-height: 120px;
  }
`

// `$variant="stop"` is the same control turned into the stop button while an
// answer streams. V1 recoloured it with an inline style object at the call site.
export const SendButton = styled.button`
  width: 48px;
  height: 48px;
  background: ${props => props.$variant === 'stop' ? 'var(--color-danger)' : 'var(--color-brand-blue)'};
  color: var(--color-surface);
  border: none;
  border-radius: 8px;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${props => props.$variant === 'stop' ? 'var(--color-danger-dark)' : 'var(--color-brand-blue-deep)'};
  }

  &:disabled {
    background: var(--color-gray-200);
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
    font-size: 1.125rem;
  }
`

export const CostIndicator = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-gray-500);
  text-align: center;
`
