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
  border-bottom: 1px solid var(--color-gray-200);
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
  color: var(--color-brand-blue-deep);
  margin: 0;
`

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-gray-500);
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: var(--color-gray-100);
    color: var(--color-gray-700);
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
    ? 'linear-gradient(135deg, var(--color-brand-blue), var(--color-brand-blue-light))'
    : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--color-gray-500)'};
  border: 2px solid ${props => props.$active ? 'transparent' : 'var(--color-gray-200)'};
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    ${props => !props.$active && `
      border-color: var(--color-brand-blue);
      color: var(--color-brand-blue);
      background: rgba(30, 115, 170, 0.05);
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
  border: 2px solid var(--color-gray-200);
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 350px;
  margin: 0 auto;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(30, 115, 170, 0.25);
    border-color: var(--color-brand-blue);
  }
`

export const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%);
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
  color: var(--color-gray-800);
  margin-bottom: 0.5rem;
  text-align: center;
`

export const PlanCredits = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.3;
`

export const PlanPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-gray-700);
  text-align: center;
  margin-bottom: 1rem;

  span {
    font-size: 0.875rem;
    font-weight: 400;
    color: var(--color-gray-500);
  }
`

export const DiscountBadge = styled.span`
  background: var(--color-warning-tint);
  color: var(--color-warning-dark);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
`

export const PlanDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-gray-500);
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  min-height: 42px;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--color-gray-500);
`

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger-dark);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  font-size: 0.875rem;
`
