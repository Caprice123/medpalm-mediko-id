import styled from 'styled-components'

export const AttachmentContainer = styled.div`
  margin-top: 0.75rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
`

export const ViewAttachmentsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`

export const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  padding-bottom: 75%; /* 4:3 aspect ratio */
  cursor: pointer;
  overflow: hidden;

  &:hover {
    > div:last-child {
      opacity: 1;
    }
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

export const MainImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
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
`

export const SliderControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 0.5rem;
`

export const SliderButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6BB9E8 0%, #8DC63F 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
`

export const SliderDots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
`

export const Dot = styled.button`
  width: ${props => props.active ? '24px' : '8px'};
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
