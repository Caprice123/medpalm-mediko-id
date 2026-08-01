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

export const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
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

