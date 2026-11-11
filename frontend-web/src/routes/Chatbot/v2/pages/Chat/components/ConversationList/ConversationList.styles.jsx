import styled from 'styled-components'

// Includes the panel header and search row, which V1 kept in the page-level
// styles file even though this is their only consumer.

export const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid var(--color-gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-surface);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const SearchContainer = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-gray-200);
  background: var(--color-surface);

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--color-brand-blue);
    box-shadow: 0 0 0 3px rgba(30, 115, 170, 0.1);
  }

  &::placeholder {
    color: var(--color-gray-400);
  }

  @media (max-width: 768px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
  }
`

export const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  background: var(--color-surface);
`

export const ConversationItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-gray-200);
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$isSelected ? 'var(--color-brand-blue-tint)' : 'var(--color-surface)'};
  border-left: 3px solid ${props => props.$isSelected ? 'var(--color-brand-blue)' : 'transparent'};

  &:hover {
    background: ${props => props.$isSelected ? 'var(--color-brand-blue-tint)' : 'var(--color-gray-50)'};
  }

  &:active {
    transform: scale(0.99);
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
  }
`

export const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
`

export const ConversationTopic = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--color-gray-800);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`

export const ConversationTime = styled.div`
  font-size: 12px;
  color: var(--color-gray-400);
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.6875rem;
  }
`

export const ConversationPreview = styled.div`
  font-size: 13px;
  color: var(--color-gray-500);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`
