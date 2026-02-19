import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export const AttachmentContainer = styled.div`
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
`

export const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const MainImageContainer = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e5e5;
`

export const MainImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`

export const MainImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #f5f5f5;
`

export const ImageLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(248, 250, 252, 0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  gap: 0.625rem;
  z-index: 2;
  font-size: 0.8125rem;
  font-weight: 500;
`

export const LoadingSpinnerIcon = styled.span`
  display: flex;
  animation: ${spin} 1s linear infinite;
  color: #6BB9E8;
`

export const MainImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  font-size: 0.875rem;
  font-weight: 500;

  ${MainImageWrapper}:hover & {
    opacity: 1;
  }
`

export const SliderControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 0.25rem;
`

export const SliderButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

export const SliderInfo = styled.div`
  flex: 1;
  text-align: center;
`

export const SliderCounter = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: #555;
  background: white;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
`

export const SliderDots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.25rem 0;
`

export const Dot = styled.button`
  width: ${props => props.active ? '22px' : '8px'};
  height: 8px;
  border-radius: 4px;
  border: none;
  background: ${props => props.active
    ? 'linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%)'
    : '#d0d0d0'};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    background: ${props => props.active
      ? 'linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%)'
      : '#b0b0b0'};
  }
`
