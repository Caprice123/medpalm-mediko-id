import styled, { keyframes } from 'styled-components'
import { colors } from '@config/colors'

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`

export const PanelCard = styled.div`
  background: ${colors.neutral.white};
  border-radius: 18px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
  animation: ${fadeSlideUp} 0.4s ease both;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 0.75rem;
  gap: 1rem;
  margin-bottom: 1rem;
`

export const PanelHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`

export const PanelTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const PanelTitle = styled.span`
  font-size: 1.125rem;
  font-weight: 800;
  color: ${colors.neutral.gray900};
`

export const PanelSubtitle = styled.span`
  font-size: 0.9375rem;
  color: ${colors.neutral.gray500};
`

export const PanelFootnote = styled.p`
  margin: 0.6rem 0 0;
  font-size: 0.8125rem;
  color: ${colors.neutral.gray500};
  line-height: 1.55;
`
