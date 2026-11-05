import styled from 'styled-components'

export const Block = styled.div`
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  padding: 1rem;
  background: var(--color-gray-50);
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`

export const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`

export const BlockTitle = styled.span`
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-gray-900);
`

export const CollapseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-brand-blue);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;

  &:hover { background: var(--color-brand-blue-tint); }
`

export const AnswerTypeToggle = styled.div`
  display: inline-flex;
  gap: 0.375rem;
  padding: 0.25rem;
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
`

export const AnswerTypeButton = styled.button`
  padding: 0.4rem 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  background: ${p => p.$active ? 'var(--color-surface)' : 'transparent'};
  color: ${p => p.$active ? 'var(--color-brand-blue)' : 'var(--color-gray-500)'};
  box-shadow: ${p => p.$active ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none'};

  &:hover:not(:disabled) { color: var(--color-brand-blue); }
`

export const RowGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const InlineRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`
