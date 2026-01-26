import Modal from '@components/common/Modal'
import TextInput from '@components/common/TextInput'
import NumberInput from '@components/common/NumberInput'
import Textarea from '@components/common/Textarea'
import Button from '@components/common/Button'
import Dropdown from '@components/common/Dropdown'
import Checkbox from '@components/common/Checkbox'
import { FormGroup, FormRow, ButtonGroup } from './PlanModal.styles'

function PlanModal({ isOpen, editingPlan, formData, onChange, onSubmit, onClose }) {
  const showCredits = formData.bundle_type === 'credits' || formData.bundle_type === 'hybrid'
  const showDuration = formData.bundle_type === 'subscription' || formData.bundle_type === 'hybrid'

  // Bundle type options for dropdown
  const bundleTypeOptions = [
    { value: 'credits', label: 'Credits Only' },
    { value: 'subscription', label: 'Subscription Only' },
    { value: 'hybrid', label: 'Hybrid (Credits + Subscription)' }
  ]

  // Payment method options for dropdown
  const paymentMethodOptions = [
    { value: 'xendit', label: 'Xendit (Online Payment)' },
    { value: 'manual', label: 'Manual Transfer' },
    { value: 'xendit,manual', label: 'Both (Xendit & Manual)' }
  ]

  // Get current bundle type value as dropdown option
  const bundleTypeValue = bundleTypeOptions.find(
    option => option.value === formData.bundle_type
  )

  // Get current payment method value as dropdown option
  const paymentMethodValue = paymentMethodOptions.find(
    option => option.value === (formData.allowed_payment_method || 'xendit')
  )

  // Handle bundle type dropdown change
  const handleBundleTypeChange = (selectedOption) => {
    onChange({
      target: {
        name: 'bundle_type',
        value: selectedOption?.value || 'credits'
      }
    })
  }

  // Handle payment method dropdown change
  const handlePaymentMethodChange = (selectedOption) => {
    onChange({
      target: {
        name: 'allowed_payment_method',
        value: selectedOption?.value || 'xendit'
      }
    })
  }

  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    onChange({
      target: {
        name: e.target.name,
        type: 'checkbox',
        checked: e.target.checked
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(e)
  }

  const footerContent = (
    <ButtonGroup>
      <Button variant="secondary" type="button" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" variant="primary" onClick={handleSubmit}>
        {editingPlan ? 'Update Plan' : 'Create Plan'}
      </Button>
    </ButtonGroup>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPlan ? 'Edit Pricing Plan' : 'Add Pricing Plan'}
      footer={footerContent}
      size="large"
      closeOnOverlayClick={false}
    >
      <form onSubmit={handleSubmit}>
        <FormRow>
          <TextInput
            label="Plan Name"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
            placeholder="e.g., Premium Monthly"
          />
          <TextInput
            label="Plan Code"
            name="code"
            value={formData.code || ''}
            onChange={onChange}
            placeholder="e.g., PREMIUM_MONTHLY"
          />
        </FormRow>

        <FormGroup>
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Describe this pricing plan..."
            rows={3}
          />
        </FormGroup>

        <FormRow>
          <Dropdown
            label="Bundle Type"
            options={bundleTypeOptions}
            value={bundleTypeValue}
            onChange={handleBundleTypeChange}
            placeholder="Select bundle type..."
            required
          />
          <Dropdown
            label="Payment Method"
            options={paymentMethodOptions}
            value={paymentMethodValue}
            onChange={handlePaymentMethodChange}
            placeholder="Select payment method..."
            required
          />
        </FormRow>

        {(showCredits || showDuration) && (
          <FormRow>
            {showCredits && (
              <NumberInput
                label="Credits Included"
                name="credits_included"
                value={formData.credits_included}
                onChange={onChange}
                required={showCredits}
                min={0}
                allowNegative={false}
                placeholder="e.g., 100"
              />
            )}
            {showDuration && (
              <NumberInput
                label="Duration (Days)"
                name="duration_days"
                value={formData.duration_days}
                onChange={onChange}
                required={showDuration}
                min={1}
                allowNegative={false}
                placeholder="e.g., 30"
              />
            )}
          </FormRow>
        )}

        <FormRow>
          <NumberInput
            label="Price (IDR)"
            name="price"
            value={formData.price}
            onChange={onChange}
            required
            min={0}
            allowNegative={false}
            allowDecimal={true}
            placeholder="e.g., 99000"
          />
          <NumberInput
            label="Discount (%)"
            name="discount"
            value={formData.discount}
            onChange={onChange}
            min={0}
            max={100}
            allowNegative={false}
            placeholder="e.g., 10"
          />
        </FormRow>

        <FormRow>
          <Checkbox
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleCheckboxChange}
            label="Active (visible to users)"
          />
          <Checkbox
            id="is_popular"
            name="is_popular"
            checked={formData.is_popular}
            onChange={handleCheckboxChange}
            label="Mark as Popular"
          />
        </FormRow>
      </form>
    </Modal>
  )
}

export default PlanModal
