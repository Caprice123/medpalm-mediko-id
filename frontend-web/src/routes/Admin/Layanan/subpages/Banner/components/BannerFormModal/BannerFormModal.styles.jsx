import styled from 'styled-components'

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.25rem;
`

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
  display: block;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`

export const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const ColorSwatch = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: ${props => props.$color || '#cccccc'};
  flex-shrink: 0;
`

export const ColorInput = styled.input`
  width: 48px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  padding: 2px;
`

export const ActiveToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: pointer;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    inset: 0;
    background: ${props => props.$active ? '#22c55e' : '#d1d5db'};
    border-radius: 24px;
    transition: background 0.2s;

    &::before {
      content: '';
      position: absolute;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: white;
      top: 3px;
      left: ${props => props.$active ? '23px' : '3px'};
      transition: left 0.2s;
    }
  }
`

export const ToggleLabel = styled.span`
  font-size: 0.875rem;
  color: #374151;
`

export const ErrorText = styled.p`
  font-size: 0.8125rem;
  color: #ef4444;
  margin-top: 0.25rem;
`

export const PreviewBanner = styled.div`
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  background: ${props => props.$gradientStart && props.$gradientEnd
    ? `linear-gradient(135deg, ${props.$gradientStart} 0%, ${props.$gradientEnd} 100%)`
    : 'linear-gradient(135deg, #0369a1 0%, #15803d 100%)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
`

export const PreviewText = styled.div`
  h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    font-weight: 700;
  }
  p {
    margin: 0;
    font-size: 0.8125rem;
    opacity: 0.9;
  }
`

export const PreviewButton = styled.div`
  background: white;
  color: #0369a1;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
`
