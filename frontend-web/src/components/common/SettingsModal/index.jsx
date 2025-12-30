import Button from '@components/common/Button'
import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  LoadingSpinner
} from './SettingsModal.styles'

/**
 * Standardized Settings Modal Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {Function} props.onSave - Save handler
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disable save button
 * @param {string} props.saveButtonText - Custom save button text
 * @param {string} props.cancelButtonText - Custom cancel button text
 */
function SettingsModal({
  isOpen,
  onClose,
  title = 'Settings',
  children,
  onSave,
  loading = false,
  disabled = false,
  saveButtonText = 'Save',
  cancelButtonText = 'Cancel'
}) {
  const handleSave = () => {
    if (onSave && !loading && !disabled) {
      onSave()
    }
  }

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {children}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} disabled={loading}>
            {cancelButtonText}
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading || disabled}
          >
            {loading && <LoadingSpinner />}
            {loading ? 'Saving...' : saveButtonText}
          </Button>
        </ModalFooter>
      </Modal>
    </Overlay>
  )
}

export default SettingsModal

// Re-export styled components for form elements
export {
  FormGroup,
  Label,
  Input,
  Textarea,
  Select,
  HintText,
  VariableBadge,
  ToggleSwitch,
  ToggleSlider
} from './SettingsModal.styles'
