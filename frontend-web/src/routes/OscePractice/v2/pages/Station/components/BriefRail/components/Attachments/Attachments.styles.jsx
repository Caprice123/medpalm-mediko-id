import styled from 'styled-components'
import { Numeric } from '../../../../Station.styles'

export const Frame = styled.div`
  position: relative;
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  overflow: hidden;
  background: var(--color-gray-50);
`

export const Shot = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;

  img {
    display: block;
    width: 100%;
    height: 150px;
    object-fit: contain;
    background: var(--color-surface);
  }
`

export const Hint = styled.span`
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.3125rem;
  background: rgba(4, 74, 119, 0.86);
  color: var(--color-surface);
  font-size: 0.75rem;
  font-weight: 600;
  pointer-events: none;
`

export const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.5rem;
`

export const Step = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  border: 1px solid var(--color-gray-300);
  background: var(--color-surface);
  color: var(--color-brand-blue-deep);

  &:disabled {
    color: var(--color-gray-400);
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    border-color: var(--color-brand-blue);
  }
`

export const Counter = styled(Numeric)`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-gray-600);
`
