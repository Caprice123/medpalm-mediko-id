import styled from 'styled-components'

export const Card = styled.div`
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border: 2px solid ${props => props.isActive ? '#6BB9E8' : '#e5e7eb'};
  position: relative;
  transition: all 0.3s ease;
  box-shadow: ${props => props.isActive ? '0 10px 40px rgba(107, 185, 232, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.05)'};
  width: 100%;
  opacity: ${props => props.isActive ? 1 : 0.6};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(107, 185, 232, 0.25);
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

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`

export const IconWrapper = styled.div`
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, rgba(107, 185, 232, 0.1), rgba(141, 198, 63, 0.1));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  ${Card}:hover & {
    transform: rotate(10deg) scale(1.1);
    background: linear-gradient(135deg, rgba(107, 185, 232, 0.2), rgba(141, 198, 63, 0.2));
  }
`

export const PlanName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  text-align: center;
`

export const PlanDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`

export const StatsContainer = styled.div`
  background: rgba(107, 185, 232, 0.05);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(107, 185, 232, 0.15);
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

export const CreditsLabel = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
`

export const PriceContainer = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`

export const PlanPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  text-align: center;
  margin-bottom: 0;

  span {
    font-size: 0.875rem;
    font-weight: 400;
    color: #6b7280;
  }
`

export const PricePerCredit = styled.div`
  font-size: 0.7rem;
  color: #6b7280;
  font-weight: 500;
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

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
`

export const ActionButton = styled.button`
  flex: 1;
  background: ${props => {
    if (props.variant === 'danger') return '#ef4444';
    if (props.variant === 'warning') return '#f59e0b';
    return 'linear-gradient(135deg, #6BB9E8, #8DC63F)';
  }};
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }
`
