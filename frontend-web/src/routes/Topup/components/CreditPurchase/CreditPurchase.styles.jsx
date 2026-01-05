import styled from 'styled-components'

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    max-width: 100%;
    border-radius: 16px 16px 0 0;
    max-height: 95vh;
  }
`

export const ModalHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  border-radius: 16px 16px 0 0;
`

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0891b2;
  margin: 0;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`

export const ModalBody = styled.div`
  padding: 2rem;
`

export const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`

export const FilterTab = styled.button`
  background: ${props => props.$active
    ? 'linear-gradient(135deg, #6BB9E8, #8DC63F)'
    : 'transparent'};
  color: ${props => props.$active ? 'white' : '#6b7280'};
  border: 2px solid ${props => props.$active ? 'transparent' : '#e5e7eb'};
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    ${props => !props.$active && `
      border-color: #6BB9E8;
      color: #6BB9E8;
      background: rgba(107, 185, 232, 0.05);
    `}
  }
`

export const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

export const PlanCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  border: 2px solid #e5e7eb;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 350px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(107, 185, 232, 0.25);
    border-color: #6BB9E8;
  }
`

export const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: white;
  padding: 0.375rem 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const PlanName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  text-align: center;
`

export const PlanCredits = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.3;
`

export const PlanPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  text-align: center;
  margin-bottom: 1rem;

  span {
    font-size: 0.875rem;
    font-weight: 400;
    color: #6b7280;
  }
`

export const DiscountBadge = styled.span`
  background: #FEF3C7;
  color: #D97706;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
`

export const PlanDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  min-height: 42px;
`

export const PurchaseButton = styled.button`
  width: 100%;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  display: block;
  border: none;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(107, 185, 232, 0.4);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(141, 198, 63, 0.5);
  }

  &:disabled {
    background: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

export const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1rem;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  font-size: 0.875rem;
`

export const PaymentMethodSelector = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`

export const PaymentMethodTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0891b2;
  margin: 0 0 1.5rem 0;
  text-align: center;
`

export const PaymentMethodOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`

export const PaymentMethodOption = styled.button`
  padding: 1rem 1.5rem;
  border-radius: 10px;
  border: 2px solid ${props => props.$selected ? '#6BB9E8' : '#e5e7eb'};
  background: ${props => props.$selected ? 'rgba(107, 185, 232, 0.1)' : 'white'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 0.9375rem;

  &:hover {
    border-color: #6BB9E8;
    background: rgba(107, 185, 232, 0.05);
  }
`

export const PaymentMethodName = styled.div`
  font-weight: 600;
  color: #0891b2;
  margin-bottom: 0.25rem;
`

export const PaymentMethodDescription = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
`

export const PaymentMethodActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`

export const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;

  &:hover {
    background: #f9fafb;
  }
`

export const ConfirmButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(107, 185, 232, 0.4);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(141, 198, 63, 0.5);
  }

  &:disabled {
    background: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

// Legacy exports for backward compatibility
export const IconWrapper = styled.div`
  display: none;
`

export const StatsContainer = styled.div`
  display: contents;
`

export const CreditsLabel = styled.div`
  display: none;
`

export const PriceContainer = styled.div`
  display: contents;
`

export const PricePerCredit = styled.div`
  display: none;
`

export const PlanFeatures = styled.ul`
  display: none;
`

export const FeatureItem = styled.li`
  display: none;
`

export const InfoSection = styled.div`
  display: none;
`

export const InfoTitle = styled.h4`
  display: none;
`

export const InfoText = styled.p`
  display: none;
`

export const StepsList = styled.ol`
  display: none;
`

export const DiscountInfo = styled.div`
  display: none;
`

export const OriginalPrice = styled.div`
  display: none;
`
