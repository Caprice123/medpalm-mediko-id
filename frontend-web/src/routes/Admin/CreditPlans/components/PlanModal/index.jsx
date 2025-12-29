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
  TextArea,
  CheckboxGroup,
  Checkbox,
  CheckboxLabel,
  ButtonGroup,
  Button
} from './PlanModal.styles'

function PlanModal({ isOpen, editingPlan, formData, onChange, onSubmit, onClose }) {
  if (!isOpen) return null

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{editingPlan ? 'Edit Credit Plan' : 'Add Credit Plan'}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="name">Plan Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                placeholder="e.g., Starter Pack"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="Describe this credit plan..."
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="credits">Credits *</Label>
              <Input
                type="number"
                id="credits"
                name="credits"
                value={formData.credits}
                onChange={onChange}
                required
                placeholder="e.g., 100"
              />
            </FormGroup>

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
                placeholder="e.g., 50000"
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
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={onChange}
              />
              <CheckboxLabel htmlFor="isActive">Active (visible to users)</CheckboxLabel>
            </CheckboxGroup>

            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                id="isPopular"
                name="isPopular"
                checked={formData.isPopular}
                onChange={onChange}
              />
              <CheckboxLabel htmlFor="isPopular">Mark as Popular</CheckboxLabel>
            </CheckboxGroup>
          </ModalBody>
        <ModalFooter>
        <ButtonGroup>
            <Button type="button" onClick={onClose}>
            Cancel
            </Button>
            <Button type="submit" variant="primary">
            {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
        </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default PlanModal
