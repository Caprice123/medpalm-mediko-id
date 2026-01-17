import styled from 'styled-components'
import { colors } from '@config/colors'

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${colors.osce.primaryLight} 0%, ${colors.neutral.white} 100%);
  padding: 2rem;
`

export const Card = styled.div`
  background: ${colors.neutral.white};
  border-radius: 16px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`

export const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

export const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${colors.neutral.gray900};
  margin: 0 0 0.5rem 0;
`

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${colors.neutral.gray600};
  margin: 0;
`

export const TopicInfo = styled.div`
  background: ${colors.osce.primaryLight};
  border-left: 4px solid ${colors.osce.primary};
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`

export const TopicTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.neutral.gray900};
  margin: 0 0 0.5rem 0;
`

export const TopicMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: ${colors.neutral.gray600};
  margin-top: 0.75rem;
`

export const PermissionSection = styled.div`
  margin-bottom: 2rem;
`

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.neutral.gray800};
  margin: 0 0 1rem 0;
`

export const PermissionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.granted ? colors.success.lighter : colors.neutral.gray50};
  border: 2px solid ${props => props.granted ? colors.success.main : colors.neutral.gray200};
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.2s;
`

export const PermissionIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`

export const PermissionText = styled.div`
  flex: 1;
`

export const PermissionLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.neutral.gray900};
  margin-bottom: 0.25rem;
`

export const PermissionStatus = styled.div`
  font-size: 0.75rem;
  color: ${props => props.granted ? colors.success.darker : colors.neutral.gray500};
  font-weight: 500;
`

export const StatusBadge = styled.div`
  padding: 0.375rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.granted ? colors.success.lighter : colors.neutral.gray200};
  color: ${props => props.granted ? colors.success.darker : colors.neutral.gray600};
  flex-shrink: 0;
`

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`

export const Button = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' && `
    background: ${colors.osce.primary};
    color: ${colors.neutral.white};
    border: none;

    &:hover:not(:disabled) {
      background: ${colors.osce.primaryHover};
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: ${colors.neutral.white};
    color: ${colors.neutral.gray700};
    border: 2px solid ${colors.neutral.gray300};

    &:hover {
      background: ${colors.neutral.gray50};
      border-color: ${colors.neutral.gray400};
    }
  `}
`

export const ErrorMessage = styled.div`
  background: ${colors.error.lighter};
  border-left: 4px solid ${colors.error.main};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: ${colors.error.dark};
  font-size: 0.875rem;
`

export const HelpText = styled.p`
  font-size: 0.875rem;
  color: ${colors.neutral.gray500};
  text-align: center;
  margin: 1.5rem 0 0 0;
  line-height: 1.5;
`
