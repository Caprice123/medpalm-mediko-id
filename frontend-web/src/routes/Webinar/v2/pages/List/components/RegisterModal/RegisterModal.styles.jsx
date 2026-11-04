import styled from 'styled-components'

export const FieldLabel = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 0.25rem;
`

export const HelpText = styled.p`
  margin: 0 0 0.875rem;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--color-gray-500);
  max-width: 62ch;
`

export const UploadedList = styled.ul`
  list-style: none;
  margin: 0.875rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const UploadedItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5625rem 0.75rem;
  border-radius: 10px;
  background: var(--color-brand-green-tint);

  svg {
    flex-shrink: 0;
    color: var(--color-brand-green-darker);
  }

  span {
    flex: 1;
    min-width: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-brand-green-darker);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const SlotCount = styled.p`
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  font-variant-numeric: tabular-nums lining-nums;
`

export const UploadError = styled.p`
  margin: 0.875rem 0 0;
  display: flex;
  align-items: flex-start;
  gap: 0.4375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.5;
  padding: 0.625rem 0.75rem;
  border-radius: 9px;
  background: var(--color-danger-tint-soft);
  border: 1px solid var(--color-danger-border);
  color: var(--color-danger-dark);

  svg {
    flex-shrink: 0;
    margin-top: 0.1rem;
  }
`

export const ReapplyNote = styled.p`
  margin: 0 0 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.4375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.5;
  padding: 0.625rem 0.75rem;
  border-radius: 9px;
  background: var(--color-warning-tint);
  color: var(--color-warning-text);

  svg {
    flex-shrink: 0;
    margin-top: 0.1rem;
  }
`
