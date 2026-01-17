import styled from 'styled-components'
import { colors } from '@config/colors'

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.neutral.gray800};
  margin-bottom: 0.5rem;
`

export const HintText = styled.p`
  font-size: 0.75rem;
  color: ${colors.neutral.gray500};
  margin-top: 0.5rem;
  line-height: 1.4;
`

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 51px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
      background-color: ${colors.osce.primary};
    }

    &:checked + span:before {
      transform: translateX(26px);
    }

    &:focus + span {
      box-shadow: 0 0 1px ${colors.osce.primary};
    }
  }
`

export const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${colors.neutral.gray300};
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: ${colors.neutral.white};
    transition: 0.4s;
    border-radius: 50%;
  }
`
