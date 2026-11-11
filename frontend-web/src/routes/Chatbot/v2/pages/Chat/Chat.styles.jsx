import styled from 'styled-components'

// Page layout only. The header and search row that V1 kept here moved into
// ConversationList, which is the only component that ever used them.

export const Container = styled.div`
  height: calc(100vh - 44px);
  background: var(--color-brand-blue-tint);
  display: flex;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 100vh;
  }
`

export const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`

// On a phone the two panels are one screen each: the list hands over to the
// thread, so exactly one of them is mounted-visible at a time.
export const LeftPanel = styled.div`
  width: 380px;
  min-width: 320px;
  max-width: 450px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-gray-200);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    border-right: none;
    display: ${props => props.$hidden ? 'none' : 'flex'};
  }
`

export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    display: ${props => props.$hidden ? 'none' : 'flex'};
  }
`

export const PlaceholderPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`

export const PlaceholderIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`

export const PlaceholderTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const PlaceholderDescription = styled.p`
  font-size: 14px;
  color: var(--color-gray-500);
  margin: 0;
  max-width: 400px;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    max-width: 100%;
  }
`

// Shared by ConversationList (paging in older threads) and Conversation
// (paging in older messages).
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--color-gray-500);
  gap: 12px;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
    font-size: 0.875rem;
  }
`

export const LoadingSpinner = styled.div`
  font-size: 2rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
