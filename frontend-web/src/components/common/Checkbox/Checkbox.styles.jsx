import styled from 'styled-components'

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: ${props => props.noMargin ? '0' : '1rem'};
  user-select: none;

  &:last-child {
    margin-bottom: 0;
  }
`

export const StyledCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid var(--color-gray-300);
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-brand-blue);
  }

  &:checked {
    accent-color: var(--color-brand-blue);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const Label = styled.label`
  color: var(--color-gray-700);
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    color: var(--color-gray-900);
  }
`
