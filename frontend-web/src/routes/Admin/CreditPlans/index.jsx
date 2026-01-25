
import { useCreditPlans } from './hooks/useCreditPlans'
import { usePlanModal } from './hooks/usePlanModal'
import PlansList from './components/PlansList/index'
import PlanModal from './components/PlanModal/index'
import { Container, HeaderSection, SectionTitle, AddButton, LoadingState, ErrorMessage } from './CreditPlans.styles'
import Button from '@components/common/Button'

function CreditPlans() {
  const {
    plans,
    loading,
    error,
    createPlan,
    updatePlan,
    toggleStatus,
  } = useCreditPlans()

  const {
    isModalOpen,
    editingPlan,
    formData,
    openModal,
    closeModal,
    handleChange
  } = usePlanModal()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingPlan) {
        await updatePlan(editingPlan.id, formData)
    } else {
        await createPlan(formData)
    }
    closeModal()

  }

  const handleToggleStatus = async (plan) => {
      await toggleStatus(plan)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return <LoadingState>Loading credit plans...</LoadingState>
  }

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <HeaderSection>
        <SectionTitle>Credit Plans</SectionTitle>
        <Button variant="primary" onClick={() => openModal()}>
          <span>+</span>
          Add New Plan
        </Button>
      </HeaderSection>

      <PlansList
        plans={plans}
        onEdit={openModal}
        onToggle={handleToggleStatus}
        formatPrice={formatPrice}
      />

      <PlanModal
        isOpen={isModalOpen}
        editingPlan={editingPlan}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />
    </Container>
  )
}

export default CreditPlans
