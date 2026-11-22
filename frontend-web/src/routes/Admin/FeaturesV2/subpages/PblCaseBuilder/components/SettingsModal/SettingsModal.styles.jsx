import styled from 'styled-components'

export const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`

export const Label = styled.label`
  display: block;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

export const HintText = styled.div`
  font-size: 0.75rem;
  color: var(--color-gray-500);
  margin-top: 0.5rem;
  line-height: 1.4;
`

export const SectionDivider = styled.div`
  border-top: 1.5px solid var(--color-gray-200);
  margin: 1.5rem 0 1.25rem;
  padding-top: 1.25rem;

  h4 {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-gray-800);
    margin: 0 0 0.35rem 0;
  }

  p {
    font-size: 0.75rem;
    color: var(--color-gray-500);
    margin: 0 0 1.25rem 0;
  }
`

export const TwoUp = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
      background: var(--color-brand-blue);
    }

    &:checked + span:before {
      transform: translateX(24px);
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
  background-color: var(--color-gray-300);
  transition: 0.2s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: var(--color-surface);
    transition: 0.2s;
    border-radius: 50%;
  }
`
