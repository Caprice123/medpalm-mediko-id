import styled from 'styled-components'

export const Container = styled.div`
  min-height: calc(100vh - 63px);
  background: #f8fafc;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`

export const BackButton = styled.button`
  background: #f3f4f6;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: #06b6d4;
    color: white;
  }
`

export const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
`

export const TitleSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`

export const IconLarge = styled.div`
  font-size: 3rem;
  line-height: 1;
`

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
`

export const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
`

export const ActionsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`

export const ActionButton = styled.button`
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);

  span {
    font-size: 1.25rem;
    font-weight: 700;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(6, 182, 212, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
`

export const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`

export const GroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const GroupCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 2px solid ${props => props.isExpanded ? '#06b6d4' : '#e5e7eb'};
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 16px rgba(6, 182, 212, 0.1);
  }
`

export const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.theme === 'active' ? 'rgba(6, 182, 212, 0.03)' : 'transparent'};

  &:hover {
    background: rgba(6, 182, 212, 0.05);
  }
`

export const CollapseIcon = styled.span`
  font-size: 1rem;
  color: #06b6d4;
  transition: transform 0.3s ease;
  transform: ${props => props.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'};
  display: inline-block;
  font-weight: 700;
`

export const GroupTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  text-transform: capitalize;
`

export const GroupBadge = styled.span`
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.05));
  color: #0891b2;
  padding: 0.375rem 0.875rem;
  border-radius: 50px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid rgba(6, 182, 212, 0.2);
`

export const GroupActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

export const IconButton = styled.button`
  background: ${props => props.danger ? '#fee2e2' : 'rgba(6, 182, 212, 0.1)'};
  color: ${props => props.danger ? '#dc2626' : '#06b6d4'};
  border: none;
  width: ${props => props.small ? '32px' : '40px'};
  height: ${props => props.small ? '32px' : '40px'};
  border-radius: 10px;
  font-size: ${props => props.small ? '0.875rem' : '1.125rem'};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.danger ? '#fecaca' : '#06b6d4'};
    color: ${props => props.danger ? '#991b1b' : 'white'};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`

export const GroupContent = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  animation: slideDown 0.3s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 1000px;
    }
  }
`

export const TagsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const TagItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    border-color: #06b6d4;
    background: rgba(6, 182, 212, 0.03);
    transform: translateX(4px);
  }
`

export const TagName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
  flex: 1;
`

export const TagActions = styled.div`
  display: flex;
  gap: 0.375rem;
  align-items: center;
`

export const EmptyGroupState = styled.div`
  text-align: center;
  padding: ${props => props.small ? '2rem 1rem' : '4rem 2rem'};
  color: #94a3b8;
`

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`

export const EmptyText = styled.p`
  font-size: ${props => props.small ? '0.875rem' : '1rem'};
  color: #64748b;
  margin: 0;
  font-weight: 500;
`

export const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  font-size: 1.125rem;
  font-weight: 500;
`
