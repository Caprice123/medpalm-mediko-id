import styled from 'styled-components'

export const ChatPanel = styled.div`
  width: 100%;
  height: 100%;
  background: var(--color-surface);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    height: 100vh;
    flex-shrink: 0;
    border-right: none;
    border-bottom: 1px solid var(--color-gray-200);
  }
`

export const ChatHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`

export const ChatTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`

export const ChatMessages = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-gray-300);
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.625rem;
  }
`
