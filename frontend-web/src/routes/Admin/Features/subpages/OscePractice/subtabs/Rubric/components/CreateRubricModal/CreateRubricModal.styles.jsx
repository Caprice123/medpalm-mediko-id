import styled from 'styled-components'
import { colors } from '@config/colors'

export const FormSection = styled.div`
  margin-bottom: 1.5rem;
`

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.neutral.gray800};
  margin-bottom: 0.5rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${colors.neutral.gray300};
  border-radius: 6px;
  font-size: 0.875rem;
  color: ${colors.neutral.gray800};

  &:focus {
    outline: none;
    border-color: ${colors.osce.primary};
    box-shadow: 0 0 0 3px ${colors.osce.primaryLight};
  }

  &::placeholder {
    color: ${colors.neutral.gray400};
  }
`

export const Button = styled.button`
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' && `
    background: ${colors.osce.primary};
    color: ${colors.neutral.white};
    border: 1px solid ${colors.osce.primary};

    &:hover {
      background: ${colors.osce.primaryHover};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: ${colors.neutral.white};
    color: ${colors.neutral.gray500};
    border: 1px solid ${colors.neutral.gray300};

    &:hover {
      background: ${colors.neutral.gray50};
    }
  `}
`

export const HelpText = styled.p`
  font-size: 0.75rem;
  color: ${colors.neutral.gray500};
  margin: 0.25rem 0 0.5rem 0;
  line-height: 1.4;
`

export const ErrorText = styled.p`
  font-size: 0.75rem;
  color: ${colors.error.main};
  margin: 0.25rem 0 0 0;
`
