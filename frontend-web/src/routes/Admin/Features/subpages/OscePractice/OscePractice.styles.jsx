import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  width: 100%;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`

export const BackButton = styled.button`
  background: ${colors.neutral.white};
  color: ${colors.neutral.gray500};
  border: 1px solid ${colors.neutral.gray300};
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: ${colors.neutral.gray50};
    border-color: ${colors.neutral.gray400};
  }
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
  color: ${colors.neutral.gray800};
  margin: 0;
`

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
`

export const ActionButton = styled.button`
  background: ${props => props.secondary ? colors.neutral.white : colors.osce.primary};
  color: ${props => props.secondary ? colors.neutral.gray500 : colors.neutral.white};
  border: 1px solid ${props => props.secondary ? colors.neutral.gray300 : colors.osce.primary};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: ${props => props.secondary ? colors.neutral.gray50 : colors.osce.primaryHover};
  }
`

export const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid ${colors.neutral.gray200};
  margin-bottom: 2rem;
  gap: 0.5rem;
`

export const Tab = styled.button`
  background: ${props => props.active ? colors.osce.primaryLighter : 'transparent'};
  color: ${props => props.active ? colors.osce.primary : colors.neutral.gray500};
  border: none;
  border-bottom: 2px solid ${props => props.active ? colors.osce.primary : 'transparent'};
  padding: 0.75rem 1.5rem;
  font-weight: ${props => props.active ? 600 : 500};
  font-size: 0.875rem;
  cursor: pointer;
  position: relative;
  bottom: -2px;

  &:hover {
    background: ${props => props.active ? colors.osce.primaryLighter : colors.neutral.gray50};
  }
`
