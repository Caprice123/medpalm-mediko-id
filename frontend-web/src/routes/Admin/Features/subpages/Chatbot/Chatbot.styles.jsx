import styled from 'styled-components'

export const Container = styled.div`
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`

export const BackButton = styled.button`
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`

export const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const TitleSection = styled.div`
  flex: 1;
`

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`

export const ActionButton = styled.button`
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  background: #3b82f6;
  color: white;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => props.secondary && `
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover:not(:disabled) {
      background: #f9fafb;
    }
  `}
`

export const ContentSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

export const TabsContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 1.5rem;
`

export const Tab = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  border-bottom: 2px solid ${({ active }) => active ? '#3b82f6' : 'transparent'};
  margin-bottom: -2px;
  background: none;
  color: ${({ active }) => active ? '#3b82f6' : '#6b7280'};
  font-weight: ${({ active }) => active ? '600' : '500'};
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { color: #3b82f6; }
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`

export const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
`

export const EmptyStateDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
`
