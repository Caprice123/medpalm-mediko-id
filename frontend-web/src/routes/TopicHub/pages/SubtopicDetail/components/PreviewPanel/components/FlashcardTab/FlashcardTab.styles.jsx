import styled from 'styled-components'

export const PlayerActionRow = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const PlayerRatingBtn = styled.button`
  flex: 1;
  padding: 0.625rem 0.25rem;
  border: 2px solid ${p => p.$color};
  background: #fff;
  color: ${p => p.$color};
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) { background: ${p => p.$color}; color: #fff; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

export const PlayerDoneWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
  text-align: center;
`

export const PlayerDoneText = styled.p`
  font-size: 0.9375rem;
  color: var(--color-gray-700);
  margin: 0;
  font-weight: 500;
`
