import styled from 'styled-components'

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`

export const ModalContainer = styled.div`
  background: white;
  border-radius: ${props => props.size === 'fullscreen' ? '0' : '12px'};
  max-width: ${props => props.size === 'small' ? '400px' :
                       props.size === 'large' ? '900px' :
                       props.size === 'fullscreen' ? '100%' :
                       '600px'};
  width: ${props => props.size === 'fullscreen' ? '100vw' : '100%'};
  max-height: ${props => props.size === 'fullscreen' ? '100vh' : '90vh'};
  height: ${props => props.size === 'fullscreen' ? '100vh' : 'auto'};
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.size === 'fullscreen' ? 'none' : '0 20px 50px rgba(0, 0, 0, 0.3)'};
  animation: ${props => props.size === 'fullscreen' ? 'fadeIn 0.2s ease' : 'slideUp 0.3s ease'};
  position: relative;
  overflow: visible;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 95vh;
    border-radius: 8px;
  }
`

export const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  transition: all 0.2s ease;
  border-radius: 4px;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(107, 185, 232, 0.1);
    color: #6BB9E8;
  }

  @media (max-width: 768px) {
    min-width: 40px;
    min-height: 40px;
    font-size: 1.75rem;
  }
`

export const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  position: relative;

  /* Allow dropdowns to overflow the scrollable area */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`

export const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    padding: 1.25rem;
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`
