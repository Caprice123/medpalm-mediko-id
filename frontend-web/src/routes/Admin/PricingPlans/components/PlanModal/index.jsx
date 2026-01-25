import Dropdown from '@components/common/Dropdown'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Select,
  TextArea,
  CheckboxGroup,
  Checkbox,
  CheckboxLabel,
  ButtonGroup,
  Button
} from './PlanModal.styles'

function PlanModal({ isOpen, editingPlan, formData, onChange, onSubmit, onClose }) {
  if (!isOpen) return null

  const showCredits = formData.bundle_type === 'credits' || formData.bundle_type === 'hybrid'
  const showDuration = formData.bundle_type === 'subscription' || formData.bundle_type === 'hybrid'

  // Payment method options for dropdown
  const paymentMethodOptions = [
    { value: 'xendit', label: 'Xendit (Online Payment)' },
    { value: 'manual', label: 'Manual Transfer' },
    { value: 'xendit,manual', label: 'Both (Xendit & Manual)' }
  ]

  // Get current payment method value as dropdown option
  const paymentMethodValue = paymentMethodOptions.find(
    option => option.value === (formData.allowed_payment_method || 'xendit')
  )

  // Handle payment method dropdown change
  const handlePaymentMethodChange = (selectedOption) => {
    onChange({
      target: {
        name: 'allowed_payment_method',
        value: selectedOption?.value || 'xendit'
      }
    })
  }

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{editingPlan ? 'Edit Pricing Plan' : 'Add Pricing Plan'}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
          <ModalBody onSubmit={onSubmit}>
            <FormGroup>
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                placeholder="e.g., Premium Monthly"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="code">Plan Code</Label>
              <Input
                type="text"
                id="code"
                name="code"
                value={formData.code || ''}
                onChange={onChange}
                placeholder="e.g., PREMIUM_MONTHLY (unique identifier)"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="Describe this pricing plan..."
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="bundle_type">Bundle Type *</Label>
              <Select
                id="bundle_type"
                name="bundle_type"
                value={formData.bundle_type}
                onChange={onChange}
                required
              >
                <option value="credits">Credits Only</option>
                <option value="subscription">Subscription Only</option>
                <option value="hybrid">Hybrid (Credits + Subscription)</option>
              </Select>
            </FormGroup>

            {showCredits && (
              <FormGroup>
                <Label htmlFor="credits_included">Credits Included *</Label>
                <Input
                  type="number"
                  id="credits_included"
                  name="credits_included"
                  value={formData.credits_included}
                  onChange={onChange}
                  required={showCredits}
                  min="0"
                  placeholder="e.g., 100"
                />
              </FormGroup>
            )}

            {showDuration && (
              <FormGroup>
                <Label htmlFor="duration_days">Duration (Days) *</Label>
                <Input
                  type="number"
                  id="duration_days"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={onChange}
                  required={showDuration}
                  placeholder="e.g., 30"
                />
              </FormGroup>
            )}

            <FormGroup>
              <Label htmlFor="price">Price (IDR) *</Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={onChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g., 99000"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={onChange}
                min="0"
                max="100"
                placeholder="e.g., 10"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="order">Display Order</Label>
              <Input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={onChange}
                min="0"
                placeholder="e.g., 0"
              />
            </FormGroup>

            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={onChange}
              />
              <CheckboxLabel htmlFor="is_active">Active (visible to users)</CheckboxLabel>
            </CheckboxGroup>

            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                id="is_popular"
                name="is_popular"
                checked={formData.is_popular}
                onChange={onChange}
              />
              <CheckboxLabel htmlFor="is_popular">Mark as Popular</CheckboxLabel>
            </CheckboxGroup>

            <FormGroup>
              <Dropdown
                label="Payment Method"
                options={paymentMethodOptions}
                value={paymentMethodValue}
                onChange={handlePaymentMethodChange}
                placeholder="Select payment method..."
                required
              />
            </FormGroup>
          </ModalBody>
        <ModalFooter>
        <ButtonGroup>
            <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
            </Button>
            <Button type="submit" variant="primary" onClick={onSubmit}>
            {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
        </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PlanModal
