import styled from 'styled-components'
import colors from '@config/colors'

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`

export const ModalContent = styled.div`
  background: ${colors.background.paper};
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
`

export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${colors.neutral.gray200};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${colors.text.secondary};
  cursor: pointer;
  padding: 0.25rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.neutral.gray200};
    color: ${colors.text.primary};
  }
`

export const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`

export const DetailSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.text.secondary};
  letter-spacing: 0.5px;
  margin: 0 0 1rem 0;
`

export const DetailGrid = styled.div`
  display: grid;
  gap: 1rem;
`

export const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`

export const DetailLabel = styled.div`
  font-size: 0.9375rem;
  color: ${colors.text.secondary};
  font-weight: 500;
`

export const DetailValue = styled.div`
  font-size: 0.9375rem;
  color: ${colors.text.primary};
  font-weight: 600;
  text-align: right;
`

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #10b981;
        `
      case 'pending':
        return `
          background: #FEF3C7;
          color: #92400E;
          border: 1px solid #F59E0B;
        `
      case 'waiting_approval':
        return `
          background: #EFF6FF;
          color: #1E40AF;
          border: 1px solid #3B82F6;
        `
      case 'failed':
      case 'rejected':
        return `
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #EF4444;
        `
      default:
        return `
          background: ${colors.neutral.gray200};
          color: ${colors.text.secondary};
        `
    }
  }}
`

export const TypeBadge = styled.span`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  ${props => {
    switch (props.type) {
      case 'credits':
        return `
          background: #EFF6FF;
          color: #1E40AF;
          border: 1px solid #3B82F6;
        `
      case 'subscription':
        return `
          background: #F0F9FF;
          color: #075985;
          border: 1px solid #0EA5E9;
        `
      case 'hybrid':
        return `
          background: #FEF3C7;
          color: #92400E;
          border: 1px solid #F59E0B;
        `
      default:
        return `
          background: ${colors.neutral.gray200};
          color: ${colors.text.secondary};
        `
    }
  }}
`

export const EvidenceSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${colors.neutral.gray100};
  border-radius: 12px;
`

export const EvidenceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const EvidenceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${colors.background.paper};
  border-radius: 8px;
  color: ${colors.text.primary};
  border: 1px solid ${colors.neutral.gray200};
`

export const FileIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`

export const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const FileName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const FileDate = styled.div`
  font-size: 0.75rem;
  color: ${colors.text.secondary};
  margin-top: 0.25rem;
`

export const LoadingState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.text.secondary};
  font-size: 0.9375rem;
`

export const ErrorState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: ${colors.error.main};
  font-size: 0.9375rem;
`

export const ActionButtons = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${colors.neutral.gray200};
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`

export const UserInfo = styled.div`
  padding: 1rem;
  background: ${colors.neutral.gray100};
  border-radius: 12px;
`

export const UserName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 0.25rem;
`

export const UserEmail = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
`
