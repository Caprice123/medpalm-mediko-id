import styled from 'styled-components'

export const Note = styled.div`
  flex: none;
  border-bottom: 1px solid var(--color-gray-100);
  background: var(--color-brand-blue-tint);
`

export const Toggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  width: 100%;
  padding: 0.5625rem 1rem;
  border: none;
  background: none;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-brand-blue-deep);
  text-align: left;

  svg {
    flex: none;
  }
`

export const Body = styled.div`
  padding: 0 1rem 0.875rem;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--color-gray-700);
  white-space: pre-line;
  max-height: 11rem;
  overflow-y: auto;
`
