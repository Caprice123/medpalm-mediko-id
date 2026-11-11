import styled from 'styled-components'

export const TopBar = styled.div`
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-gray-200);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`

export const SetTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
`

export const SetTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const SetTitleInput = styled.input`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-gray-800);
  padding: 8px 12px;
  border: 2px solid var(--color-brand-blue);
  border-radius: 6px;
  outline: none;
  background: var(--color-surface);
  text-align: center;
  min-width: 300px;

  &:focus {
    border-color: var(--color-brand-blue-deep);
  }

  &::placeholder {
    color: var(--color-gray-400);
    font-weight: 400;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    min-width: auto;
    width: 100%;
    padding: 0.5rem;
  }
`

export const TopActions = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    display: none;
  }
`
