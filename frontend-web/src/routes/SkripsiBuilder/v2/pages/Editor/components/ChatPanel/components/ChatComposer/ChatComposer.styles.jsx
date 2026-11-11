import styled from 'styled-components'

export const ChatInputArea = styled.div`
  padding: 16px;
  border-top: 1px solid var(--color-gray-200);
  background: var(--color-surface);

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`

export const ChatInputWrapper = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`

export const ChatInput = styled.textarea`
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
  resize: vertical;
  min-height: 42px;
  max-height: 120px;
  line-height: 1.5;

  &:focus {
    border-color: var(--color-brand-blue);
  }

  &::placeholder {
    color: var(--color-gray-400);
  }

  &:disabled {
    background: var(--color-gray-50);
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.8125rem;
    min-height: 38px;
    max-height: 100px;
  }
`

// `$variant="stop"` is the same control turned into the stop button while an
// answer streams. V1 recoloured it with an inline style object at the call site.
export const SendButton = styled.button`
  background: ${props => props.$variant === 'stop' ? 'var(--color-danger)' : 'var(--color-brand-blue)'};
  color: var(--color-surface);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${props => props.$variant === 'stop' ? 'var(--color-danger-dark)' : 'var(--color-brand-blue-deep)'};
  }

  &:disabled {
    background: var(--color-gray-400);
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }
`
