import styled from 'styled-components'

export const Container = styled.div`
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
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
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-family: inherit;
  resize: none;
  max-height: 150px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.875rem;
    max-height: 120px;
  }
`

export const SendButton = styled.button`
  width: 48px;
  height: 48px;
  background: #3b82f6;
  color: white;
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
    background: #2563eb;
  }

  &:disabled {
    background: #e5e7eb;
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
  color: #6b7280;
  text-align: center;
`
