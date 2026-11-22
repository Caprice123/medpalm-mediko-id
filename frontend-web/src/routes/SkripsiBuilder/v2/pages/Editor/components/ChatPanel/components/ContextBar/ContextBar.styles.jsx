import styled from 'styled-components'

// Sits between the thread and the composer, so what will be sent is read on
// the way to pressing Kirim rather than hidden behind a settings icon.
export const Bar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
  }
`

export const BarLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-gray-500);
  margin-right: 0.15rem;
`

export const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'var(--color-brand-blue)' : 'var(--color-gray-300)')};
  background: ${({ $active }) => ($active ? 'var(--color-brand-blue-tint)' : 'var(--color-surface)')};
  color: ${({ $active }) => ($active ? 'var(--color-brand-blue-deep)' : 'var(--color-gray-600)')};
  font-size: 0.72rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;

  &:hover:not(:disabled) {
    border-color: var(--color-brand-blue);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

// An attached section is not a toggle: it was chosen one at a time and is
// removed the same way, so it carries its own × rather than switching off.
export const SectionChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  max-width: 11rem;
  padding: 0.2rem 0.3rem 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--color-brand-blue);
  background: var(--color-brand-blue-tint);
  color: var(--color-brand-blue-deep);
  font-size: 0.72rem;
  font-weight: 500;
`

export const SectionName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  font-size: 0.65rem;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }
`

export const Adder = styled.div`
  width: 11rem;
  margin-left: auto;
`

export const Hint = styled.span`
  font-size: 0.68rem;
  color: var(--color-gray-400);
`
