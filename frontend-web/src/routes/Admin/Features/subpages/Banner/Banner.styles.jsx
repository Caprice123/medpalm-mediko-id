import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`

export const TitleSection = styled.div``

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem;
`

export const Subtitle = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`

export const FilterCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const FilterField = styled.div``

export const FilterLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
  display: block;
`

export const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const BannerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const BannerCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`

export const CardPreview = styled.div`
  height: 120px;
  position: relative;
  background: ${props => props.$gradientStart && props.$gradientEnd
    ? `linear-gradient(135deg, ${props.$gradientStart} 0%, ${props.$gradientEnd} 100%)`
    : 'linear-gradient(135deg, #0369a1 0%, #15803d 100%)'};
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const CardBody = styled.div`
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex: 1;
`

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`

export const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
`

export const ActiveBadge = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  background: ${props => props.$active ? '#dcfce7' : '#f3f4f6'};
  color: ${props => props.$active ? '#16a34a' : '#6b7280'};
`

export const CardMeta = styled.p`
  color: #6b7280;
  font-size: 0.8125rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const CardDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export const CardFooter = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
`
