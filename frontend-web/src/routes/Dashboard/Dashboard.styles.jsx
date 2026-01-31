import styled from 'styled-components'

export const DashboardContainer = styled.div`
  min-height: calc(100vh - 90px);
  background: #f0fdfa;
`

export const MainContent = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #06b6d4;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`

export const PageSubtitle = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1.05rem;
`

export const CatalogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`

export const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1rem;
`

export const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #06b6d4;
  margin-bottom: 0.5rem;
`

export const FeatureDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.6;
`

export const FeatureFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
`

export const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`

export const EmptyStateText = styled.div`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
`

export const EmptyStateSubtext = styled.div`
  font-size: 0.875rem;
`

export const RequirementBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  background: ${props => props.$locked ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.$locked ? '#dc2626' : '#16a34a'};
  border: 1px solid ${props => props.$locked ? '#fecaca' : '#bbf7d0'};
`

export const LockIcon = styled.span`
  font-size: 1rem;
`

export const CardWrapper = styled.div`
  position: relative;
  opacity: ${props => props.$locked ? '0.65' : '1'};
  transition: opacity 0.3s ease;

  &:hover {
    opacity: ${props => props.$locked ? '0.75' : '1'};
  }
`

export const RequirementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
`

export const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.$met ? '#16a34a' : '#dc2626'};

  span:first-child {
    font-size: 1rem;
  }
`
