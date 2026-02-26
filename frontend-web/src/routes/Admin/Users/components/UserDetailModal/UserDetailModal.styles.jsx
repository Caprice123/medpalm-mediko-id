import styled from 'styled-components'

export const UserSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const UserInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const UserInfoLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  min-width: 80px;
`

export const UserInfoValue = styled.span`
  font-size: 0.875rem;
  color: #111827;
  font-weight: ${props => props.bold ? 600 : 400};
`

export const CreditSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`

export const CreditBalance = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`

export const BalanceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const BalanceLabel = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const BalanceValue = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.value > 0 ? '#059669' : '#6b7280'};
`

export const CreditActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const CreditForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  align-items: flex-start;
`

export const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const SubscriptionSection = styled.div`
  margin-bottom: 1.5rem;
`

export const SubscriptionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`

export const SubscriptionTable = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
`

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$hasActions ? '1fr 1fr 1fr 100px 130px' : '1fr 1fr 1fr 100px'};
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;

  /* Right-align the Actions cell (5th column, superadmin only) */
  ${props => props.$hasActions && `
    > *:nth-child(5) {
      justify-self: end;
    }
  `}

  ${props => props.header && `
    background-color: #f9fafb;
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
  `}

  ${props => !props.header && `
    background-color: white;
    font-size: 0.875rem;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #f9fafb;
    }
  `}
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;

  ${props => {
    if (props.status === 'active') {
      return `
        background-color: #d1fae5;
        color: #065f46;
      `
    } else if (props.status === 'not_active') {
      return `
        background-color: #fef3c7;
        color: #92400e;
      `
    } else if (props.status === 'expired') {
      return `
        background-color: #fee2e2;
        color: #991b1b;
      `
    }
  }}
`

export const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
`

export const SubscriptionForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
`

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`

export const ErrorText = styled.span`
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
`

export const HintText = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`
