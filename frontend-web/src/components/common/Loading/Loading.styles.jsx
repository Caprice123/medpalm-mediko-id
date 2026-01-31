import styled from 'styled-components'

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ gap }) => gap || '1rem'};
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || 'auto'};
  min-height: ${({ minHeight }) => minHeight || 'auto'};
  padding: ${({ padding }) => padding || '0'};
`

export const LoadingText = styled.p`
  margin: 0;
  font-size: ${({ size }) => {
    switch (size) {
      case 'small': return '0.75rem'
      case 'large': return '1rem'
      default: return '0.875rem'
    }
  }};
  color: ${({ color }) => color || '#6b7280'};
  font-weight: ${({ weight }) => weight || '400'};
  text-align: center;
`

export const LoadingOverlay = styled.div`
  position: ${({ overlay }) => overlay ? 'absolute' : 'relative'};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ overlay, overlayColor }) =>
    overlay ? (overlayColor || 'rgba(255, 255, 255, 0.9)') : 'transparent'};
  z-index: ${({ overlay }) => overlay ? '1000' : 'auto'};
  backdrop-filter: ${({ overlay, blur }) =>
    overlay && blur ? 'blur(4px)' : 'none'};
`
