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

export const WebinarBanner = styled.div`
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  border-radius: 16px;
  padding: 1.75rem 2rem;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  color: white;
  box-shadow: 0 4px 20px rgba(107, 185, 232, 0.3);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.25rem;
  }
`

export const WebinarBannerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;

  @media (max-width: 480px) {
    gap: 0.875rem;
  }
`

export const WebinarBannerIcon = styled.div`
  font-size: 2.5rem;
  flex-shrink: 0;
`

export const WebinarBannerText = styled.div`
  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.25rem;
  }
  p {
    font-size: 0.875rem;
    margin: 0;
    opacity: 0.85;
  }
`

export const WebinarBannerActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 100%;
    flex-direction: column;
  }
`

export const WebinarBannerButtonPrimary = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  white-space: nowrap;
  background: white;
  color: #4a9cc7;
  transition: background 0.15s;

  &:hover { background: #f0fdfa; }

  @media (max-width: 640px) { width: 100%; }
`

export const WebinarBannerButtonOutline = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.18);
  color: white;
  border: 1.5px solid rgba(255, 255, 255, 0.65);
  transition: background 0.15s;

  &:hover { background: rgba(255, 255, 255, 0.28); }

  @media (max-width: 640px) { width: 100%; }
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
