import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  display: flex;
  height: calc(100vh - 300px);
  overflow: hidden;
  background: #f0fdfa;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    overflow: hidden;
  }
`

export const AttachmentContainer = styled.div``

export const MessagesWrapper = styled.div`
  padding: 1rem;
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: white;
  flex: 1;

  @media (max-width: 768px) {
    max-height: calc(100vh - 100px);
  }
`

export const ViewAttachmentsButton = styled.button`
  background: ${colors.neutral.gray100};
  border: 2px solid ${colors.neutral.gray300};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.neutral.gray700};
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${colors.neutral.gray200};
    border-color: ${colors.primary.main};
    color: ${colors.primary.main};
  }
`
