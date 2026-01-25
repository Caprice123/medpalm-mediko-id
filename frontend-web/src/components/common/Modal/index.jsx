import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter
} from './Modal.styles'

/**
 * Reusable Modal component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close callback
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer content
 * @param {string} props.size - Modal size: 'small', 'medium', 'large'
 * @param {boolean} props.showCloseButton - Show close button (default: true)
 * @param {boolean} props.closeOnOverlayClick - Close on overlay click (default: true)
 * @param {string} props.className - Additional CSS class
 */
function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = false,
  className = ''
}) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget && onClose) {
      onClose()
    }
  }

  // Use portal to render modal at document body level (like Bootstrap)
  return createPortal(
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer size={size} className={className}>
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            {showCloseButton && (
              <CloseButton onClick={onClose} aria-label="Close modal">
                ×
              </CloseButton>
            )}
          </ModalHeader>
        )}

        <ModalBody>
          {children}
        </ModalBody>

        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>,
    document.body
  )
}

export default Modal
