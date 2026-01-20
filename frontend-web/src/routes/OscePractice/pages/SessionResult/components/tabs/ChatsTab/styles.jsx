import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  display: flex;
  height: calc(100vh - 300px);
  overflow: hidden;
  background: #f0fdfa;
`

export const AttachmentContainer = styled.div``

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
