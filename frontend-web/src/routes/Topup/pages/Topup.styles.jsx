import styled from 'styled-components'
import colors from '@config/colors'

export const PageContainer = styled.div`
    background: var(--color-surface-app);
`

export const Container = styled.div`
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

export const CreditBalanceCard = styled.div`
  background: linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main});
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(30, 115, 170, 0.3);
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
          background: var(--color-brand-green-tint);
          color: var(--color-brand-green-dark);
          border: 1px solid var(--color-brand-green);
        `
      case 'pending':
        return `
          background: var(--color-warning-tint);
          color: #92400E;
          border: 1px solid var(--color-warning);
        `
      case 'waiting_approval':
        return `
          background: var(--color-brand-blue-tint);
          color: var(--color-brand-blue-deep);
          border: 1px solid var(--color-brand-blue);
        `
      case 'failed':
        return `
          background: var(--color-danger-tint-soft);
          color: var(--color-danger-dark);
          border: 1px solid var(--color-danger);
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
          background: var(--color-brand-blue-tint);
          color: var(--color-brand-blue-deep);
          border: 1px solid var(--color-brand-blue);
        `
      case 'subscription':
        return `
          background: var(--color-surface-page);
          color: #075985;
          border: 1px solid var(--color-brand-blue-light);
        `
      case 'hybrid':
        return `
          background: var(--color-warning-tint);
          color: #92400E;
          border: 1px solid var(--color-warning);
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

// TabsRow is a fit-to-content pill, so it needs a full-width row of its own to
// be centred against — the pill cannot centre itself.
export const TabsBar = styled.div`
  display: flex;
  justify-content: center;
`

// Segmented control, not underlined tabs. There are only ever two views here
// and they are a destination choice ("buy" vs "look at what I bought"), so a
// pill switch that shows both options as equal, tappable targets reads better
// than a tab rule — and it survives narrow screens, where it stacks the two
// segments instead of letting them spill off the edge.
export const TabsRow = styled.div`
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.3125rem;
  margin-bottom: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-gray-200);
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(17, 26, 43, 0.06);

  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }
`

export const Tab = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 11px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;

  svg {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
  }

  ${props => props.$active ? `
    background: linear-gradient(103deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%);
    color: var(--color-surface);
  ` : `
    background: transparent;
    color: var(--color-gray-500);

    &:hover {
      background: var(--color-brand-blue-tint);
      color: var(--color-brand-blue);
    }
  `}

  @media (max-width: 640px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
  }
`

// Deliberately not a panel. The plan cards are white with their own border, so
// a white card behind them flattens the whole block — they sit straight on the
// page wash instead, the way the landing page's pricing section stages
// them.
export const PlansSection = styled.div`
  padding-block: 0.5rem 1rem;
`
