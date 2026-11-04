import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-brand-blue-tint);
  padding: 1.5rem;
  min-height: calc(100vh - 44px);

  @media (max-width: 768px) {
    min-height: 100vh;
  }
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
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: white;
  box-shadow: 0 4px 15px rgba(30, 115, 170, 0.3);
`

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-brand-blue);
  margin: 0 0 0.5rem 0;
`

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin: 0;
  line-height: 1.5;
  max-width: 500px;
  margin: 0 auto;
`

export const PermissionCard = styled.div`
  background: var(--color-surface-page);
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 2px solid ${props => props.granted ? 'var(--color-brand-green)' : 'var(--color-gray-200)'};
  transition: all 0.3s;
`

export const PermissionIconCircle = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%);
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
  color: var(--color-gray-800);
  margin: 0 0 0.375rem 0;
`

export const PermissionDescription = styled.p`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
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
  background: ${props => props.granted ? 'var(--color-brand-green-tint)' : 'var(--color-gray-500)'};
  color: ${props => props.granted ? 'var(--color-brand-green-darker)' : 'white'};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`

export const PermissionButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%);
  color: white;
  border: none;
  border-radius: 7px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 12px rgba(30, 115, 170, 0.3);
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 18px rgba(30, 115, 170, 0.4);
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
  background: linear-gradient(135deg, var(--color-brand-blue-tint) 0%, var(--color-brand-blue-tint-strong) 100%);
  border: 1px solid var(--color-brand-blue);
  border-radius: 8px;
  padding: 1rem;
`

export const InfoBoxTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-brand-blue);
  margin-bottom: 0.375rem;
`

export const InfoBoxIcon = styled.div`
  font-size: 1rem;
`

export const InfoBoxText = styled.p`
  font-size: 0.75rem;
  color: var(--color-gray-600);
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
    background: linear-gradient(135deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%);
    color: white;
    border: none;
    box-shadow: 0 3px 12px rgba(30, 115, 170, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 18px rgba(30, 115, 170, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(30, 115, 170, 0.2);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: white;
    color: var(--color-gray-700);
    border: 1px solid var(--color-gray-300);

    &:hover {
      background: var(--color-gray-50);
    }

    &:active {
      background: var(--color-gray-100);
    }
  `}
`

export const ErrorMessage = styled.div`
  background: var(--color-danger-tint-soft);
  border-left: 3px solid var(--color-danger);
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  color: #991B1B;
  font-size: 0.8125rem;
`

export const HelpText = styled.p`
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  text-align: center;
  margin: 1rem 0 0 0;
  line-height: 1.4;
`
