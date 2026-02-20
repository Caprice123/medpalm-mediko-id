import styled from 'styled-components'

export const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  background: white;
`

export const ConversationItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$isSelected ? '#ecfeff' : 'white'};
  border-left: 3px solid ${props => props.$isSelected ? '#06b6d4' : 'transparent'};

  &:hover {
    background: ${props => props.$isSelected ? '#ecfeff' : '#f9fafb'};
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
  color: #1f2937;
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
  color: #9ca3af;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.6875rem;
  }
`

export const ConversationPreview = styled.div`
  font-size: 13px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #6b7280;
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

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`

export const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 12px;
  opacity: 0.3;
`

export const EmptyText = styled.div`
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`
