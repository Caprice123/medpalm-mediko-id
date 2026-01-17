import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  width: 100%;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`

export const HeaderButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
`

export const AddButton = styled.button`
  background: ${colors.osce.primary};
  color: ${colors.neutral.white};
  border: 1px solid ${colors.osce.primary};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: ${colors.osce.primaryHover};
  }
`

export const GroupSection = styled.div`
  margin-bottom: 2.5rem;
`

export const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid ${colors.osce.primary};
`

export const GroupTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.osce.primary};
  margin: 0;
  text-transform: uppercase;
`

export const ObservationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const ObservationCard = styled.div`
  background: ${colors.neutral.white};
  border: 1px solid ${colors.neutral.gray200};
  border-radius: 8px;
  padding: 0.875rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.neutral.gray300};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`

export const ObservationCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex: 1;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`

export const ObservationLabel = styled.span`
  font-size: 0.875rem;
  color: ${colors.neutral.gray800};
  font-weight: 500;
`

export const ObservationActions = styled.div`
  display: flex;
  gap: 0.375rem;
`

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  padding: 0.25rem;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  ${props => props.danger && `
    &:hover {
      filter: brightness(1.2);
    }
  `}
`

export const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: ${colors.neutral.gray500};
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${colors.neutral.gray500};

  p {
    margin-top: 0.5rem;
    font-size: 1rem;
  }
`
