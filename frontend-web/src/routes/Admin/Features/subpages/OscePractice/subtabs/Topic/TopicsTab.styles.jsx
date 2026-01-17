import styled from 'styled-components'
import { colors } from '@config/colors'

export const TabContent = styled.div`
  width: 100%;
`

export const AddTopicButton = styled.button`
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
