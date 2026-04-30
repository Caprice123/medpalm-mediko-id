import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`

export const HeaderContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
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
`


export const WebinarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const CardThumbnail = styled.div`
  height: 140px;
  border-radius: 6px;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  overflow: hidden;
  cursor: ${({ $hasImage }) => $hasImage ? 'zoom-in' : 'default'};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s;
  }

  &:hover img {
    transform: ${({ $hasImage }) => $hasImage ? 'scale(1.04)' : 'none'};
  }
`

export const WebinarCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
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

export const StatusBadge = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  background: ${({ status }) =>
    status === 'published' ? '#dcfce7' :
    status === 'cancelled' ? '#fee2e2' : '#e0e7ff'};
  color: ${({ status }) =>
    status === 'published' ? '#16a34a' :
    status === 'cancelled' ? '#dc2626' : '#4f46e5'};
`

export const CardMeta = styled.p`
  color: #6b7280;
  font-size: 0.8125rem;
  margin: 0;
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

export const CardStats = styled.div`
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.8125rem;
  color: #374151;
`

export const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
`

export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 2rem;
`

export const TabBtn = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  background: none;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ $active }) => $active ? '#06b6d4' : '#6b7280'};
  border-bottom: 2px solid ${({ $active }) => $active ? '#06b6d4' : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  transition: color 0.15s;

  &:hover { color: #06b6d4; }
`

export const UserCell = styled.div`
  font-size: 0.875rem;
`

export const UserCellName = styled.div`
  font-weight: 500;
  color: #111827;
`

export const UserCellEmail = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`

export const DateCell = styled.div`
  font-size: 0.875rem;
`

export const DateCellMain = styled.div`
  font-weight: 500;
  color: #111827;
`

export const DateCellSub = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`

export const RegistrationStatusBadge = styled.span`
  display: inline-flex;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $s }) =>
    $s === 'approved' ? '#dcfce7' :
    $s === 'rejected' ? '#fee2e2' : '#fef9c3'};
  color: ${({ $s }) =>
    $s === 'approved' ? '#16a34a' :
    $s === 'rejected' ? '#dc2626' : '#854d0e'};
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

