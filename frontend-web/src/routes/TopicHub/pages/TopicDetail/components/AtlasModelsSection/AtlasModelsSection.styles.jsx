import styled from 'styled-components'

export const AtlasSection = styled.div`
  margin-top: 2.5rem;
`

export const AtlasSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.375rem;
`

export const AtlasSectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const AtlasSectionIcon = styled.span`
  color: #10b981;
  display: flex;
  align-items: center;
`

export const AtlasSectionSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.25rem;
`

export const AtlasModuleGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child { margin-bottom: 0; }
`

export const AtlasModuleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.75rem;
`

export const AtlasModuleTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.1875rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ $type }) => $type === 'patologi' ? '#fee2e2' : '#d1fae5'};
  color: ${({ $type }) => $type === 'patologi' ? '#b91c1c' : '#047857'};
`

export const AtlasModuleTitle = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
`

export const AtlasGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const AtlasCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: #a7f3d0;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
  }
`

export const AtlasCardIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 8px;
  background: #d1fae5;
  color: #047857;
  font-size: 1rem;
  flex-shrink: 0;
`

export const AtlasCardTitle = styled.span`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
`

export const AtlasCardArrow = styled.span`
  color: #9ca3af;
  font-size: 1.125rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`
