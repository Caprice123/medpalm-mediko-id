import styled from 'styled-components'

export const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1100;
  backdrop-filter: blur(4px);
`

export const ConfirmDialog = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 450px;
  width: 90%;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: scaleIn 0.2s ease;

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`

export const ConfirmIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`

export const ConfirmTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 0.5rem 0;
  text-align: center;
`

export const ConfirmMessage = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  text-align: center;
  line-height: 1.5;
`

export const ConfirmActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => {
    if (props.variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        &:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
      `
    } else {
      return `
        background: #f3f4f6;
        color: #374151;
        &:hover {
          background: #e5e7eb;
        }
      `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`
