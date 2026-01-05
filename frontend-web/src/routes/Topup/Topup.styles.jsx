import styled from 'styled-components'
import colors from '@config/colors'

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

export const HeaderSection = styled.div`
  margin-bottom: 2rem;
`

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

export const PageSubtitle = styled.p`
  font-size: 0.9375rem;
  color: ${colors.text.secondary};
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
`

export const TopupButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main});
  color: ${colors.text.inverse};
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(107, 185, 232, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(107, 185, 232, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`

export const CreditBalanceCard = styled.div`
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main});
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(107, 185, 232, 0.3);
`

export const BalanceGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$hasSubscription ? '1fr 1fr' : '1fr'};
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

export const BalanceSection = styled.div`
  ${props => props.$withBorder && `
    padding-left: 1.5rem;
    border-left: 1px solid rgba(255,255,255,0.3);

    @media (max-width: 768px) {
      padding-left: 0;
      padding-top: 1rem;
      border-left: none;
      border-top: 1px solid rgba(255,255,255,0.3);
    }
  `}
`

export const BalanceLabel = styled.div`
  font-size: 0.875rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  opacity: 0.95;
`

export const BalanceAmount = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

export const TableSection = styled.div`
  background: ${colors.background.paper};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

export const AmountText = styled.span`
  font-weight: 600;
  color: ${colors.text.primary};
`
