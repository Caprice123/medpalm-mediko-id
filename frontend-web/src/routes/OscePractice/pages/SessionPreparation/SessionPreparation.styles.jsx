import styled from 'styled-components'

export const Container = styled.div`
  min-height: calc(100vh - 93px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0fdfa;
  padding: 1.5rem;
`

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
`

export const Header = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`

export const IconCircle = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: white;
  box-shadow: 0 4px 15px rgba(107, 185, 232, 0.3);
`

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #6BB9E8;
  margin: 0 0 0.5rem 0;
`

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #64748B;
  margin: 0;
  line-height: 1.5;
  max-width: 500px;
  margin: 0 auto;
`

export const PermissionCard = styled.div`
  background: #F8FAFC;
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 2px solid ${props => props.granted ? '#10B981' : '#E2E8F0'};
  transition: all 0.3s;
`

export const PermissionIconCircle = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  flex-shrink: 0;
`

export const PermissionContent = styled.div`
  flex: 1;
`

export const PermissionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 0.375rem 0;
`

export const PermissionDescription = styled.p`
  font-size: 0.8125rem;
  color: #64748B;
  margin: 0;
  line-height: 1.4;
`

export const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 5px;
  font-size: 0.6875rem;
  font-weight: 600;
  background: ${props => props.granted ? '#D1FAE5' : '#64748B'};
  color: ${props => props.granted ? '#065F46' : 'white'};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`

export const PermissionButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: white;
  border: none;
  border-radius: 7px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 12px rgba(107, 185, 232, 0.3);
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 18px rgba(107, 185, 232, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const InfoBox = styled.div`
  background: linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 100%);
  border: 1px solid #6BB9E8;
  border-radius: 8px;
  padding: 1rem;
`

export const InfoBoxTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6BB9E8;
  margin-bottom: 0.375rem;
`

export const InfoBoxIcon = styled.div`
  font-size: 1rem;
`

export const InfoBoxText = styled.p`
  font-size: 0.75rem;
  color: #475569;
  margin: 0;
  line-height: 1.4;
`

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`

export const Button = styled.button`
  flex: 1;
  padding: 0.75rem 1.25rem;
  border-radius: 7px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
    color: white;
    border: none;
    box-shadow: 0 3px 12px rgba(107, 185, 232, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 18px rgba(107, 185, 232, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(107, 185, 232, 0.2);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: white;
    color: #374151;
    border: 1px solid #D1D5DB;

    &:hover {
      background: #F9FAFB;
    }

    &:active {
      background: #F3F4F6;
    }
  `}
`

export const ErrorMessage = styled.div`
  background: #FEF2F2;
  border-left: 3px solid #EF4444;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  color: #991B1B;
  font-size: 0.8125rem;
`

export const HelpText = styled.p`
  font-size: 0.8125rem;
  color: #64748B;
  text-align: center;
  margin: 1rem 0 0 0;
  line-height: 1.4;
`
