import styled from 'styled-components'

export const Container = styled.div`
  min-height: calc(100vh - 90px);
  background: #f9fafb;
  padding: 0;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`

export const BackButton = styled.button`
  background: transparent;
  border: 1px solid #d1d5db;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`

export const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const Title = styled.h1`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`

export const ActionsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

export const ActionButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;

  &:hover {
    background: #2563eb;
  }
`

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem 1.5rem;
`

export const GroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const GroupCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid ${props => props.isExpanded ? '#d1d5db' : '#e5e7eb'};
`

export const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  cursor: pointer;
  background: transparent;

  &:hover {
    background: #f9fafb;
  }
`

export const CollapseIcon = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  transition: transform 0.2s;
  transform: ${props => props.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'};
  display: inline-block;
`

export const GroupTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  text-transform: uppercase;
`

export const GroupBadge = styled.span`
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`

export const GroupActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

export const IconButton = styled.button`
  background: ${props => props.danger ? '#fee2e2' : '#f3f4f6'};
  color: ${props => props.danger ? '#dc2626' : '#374151'};
  border: none;
  padding: ${props => props.small ? '0.25rem 0.5rem' : '0.375rem 0.625rem'};
  border-radius: 4px;
  font-size: ${props => props.small ? '0.6875rem' : '0.75rem'};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.danger ? '#fecaca' : '#e5e7eb'};
  }
`

export const GroupContent = styled.div`
  padding: 0 1rem 0.875rem 1rem;
  border-top: 1px solid #f3f4f6;
`

export const TagsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.5rem;
  margin-top: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const TagItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9fafb;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;

  &:hover {
    border-color: #d1d5db;
    background: #f3f4f6;
  }
`

export const TagName = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  flex: 1;
`

export const TagActions = styled.div`
  display: flex;
  gap: 0.375rem;
  align-items: center;
`

export const EmptyGroupState = styled.div`
  text-align: center;
  padding: ${props => props.small ? '1.5rem 1rem' : '2rem 1rem'};
  color: #9ca3af;
`

export const EmptyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
`

export const EmptyText = styled.p`
  font-size: ${props => props.small ? '0.75rem' : '0.875rem'};
  color: #6b7280;
  margin: 0;
`

export const LoadingState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #6b7280;
  font-size: 0.875rem;
`

export const IconLarge = styled.div`
  font-size: 1.5rem;
  line-height: 1;
`
