import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { usePricingPlans } from './hooks/usePricingPlans'
import { usePlanModal } from './hooks/usePlanModal'
import PlansList from './components/PlansList/index'
import PlanModal from './components/PlanModal/index'
import Pagination from '@components/Pagination'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import {
  Container,
  HeaderSection,
  SectionTitle,
  LoadingState,
  ErrorMessage,
  FiltersSection,
  SearchForm,
  FilterButtonsGroup
} from './PricingPlans.styles'

function PricingPlans() {
  const {
    plans,
    loading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    toggleStatus,
  } = usePricingPlans()

  const [bundleTypeFilter, setBundleTypeFilter] = useState('all')
  const [searchNameInput, setSearchNameInput] = useState('')
  const [searchCodeInput, setSearchCodeInput] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pagination = useSelector(state => state.pricing.pagination) || { page: 1, limit: 10, isLastPage: true }

  // Fetch plans when filters or page changes
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      bundle_type: bundleTypeFilter,
    }
    fetchPlans(params)
  }, [currentPage, bundleTypeFilter])

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

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page
    const params = {
      page: 1,
      limit: 10,
      bundle_type: bundleTypeFilter,
      search_name: searchNameInput || undefined,
      search_code: searchCodeInput || undefined,
    }
    fetchPlans(params)
  }

  const handleClearName = () => {
    setSearchNameInput('')
    // Trigger new search without name
    setCurrentPage(1)
    const params = {
      page: 1,
      limit: 10,
      bundle_type: bundleTypeFilter,
      search_code: searchCodeInput || undefined,
    }
    fetchPlans(params)
  }

  const handleClearCode = () => {
    setSearchCodeInput('')
    // Trigger new search without code
    setCurrentPage(1)
    const params = {
      page: 1,
      limit: 10,
      bundle_type: bundleTypeFilter,
      search_name: searchNameInput || undefined,
    }
    fetchPlans(params)
  }

  const handleFilterClick = (filterType) => {
    setBundleTypeFilter(filterType)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const bundleTypeOptions = [
    { value: 'all', label: 'All Plans' },
    { value: 'credits', label: 'Credits' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'hybrid', label: 'Hybrid' }
  ]

  if (loading) {
    return <LoadingState>Loading pricing plans...</LoadingState>
  }

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <HeaderSection>
        <SectionTitle>Pricing Plans</SectionTitle>
        <Button variant="primary" onClick={() => openModal()}>
          <span>+</span>
          Add New Plan
        </Button>
      </HeaderSection>

      <FiltersSection>
        <SearchForm onSubmit={handleSearch}>
          <TextInput
            placeholder="Search by name..."
            value={searchNameInput}
            onChange={(e) => setSearchNameInput(e.target.value)}
          />
          <TextInput
            placeholder="Search by code..."
            value={searchCodeInput}
            onChange={(e) => setSearchCodeInput(e.target.value)}
          />
          <Button variant="primary" type="submit">
            🔍 Search
          </Button>
        </SearchForm>

        <FilterButtonsGroup>
          {bundleTypeOptions.map((option) => (
            <Button
              key={option.value}
              variant={bundleTypeFilter === option.value ? 'primary' : 'secondary'}
              onClick={() => handleFilterClick(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </FilterButtonsGroup>
      </FiltersSection>

      <PlansList
        plans={plans || []}
        onEdit={openModal}
        onToggle={handleToggleStatus}
        formatPrice={formatPrice}
      />

      {(currentPage > 1 || !pagination.isLastPage) && (
        <Pagination
          currentPage={currentPage}
          isLastPage={pagination.isLastPage}
          onPageChange={handlePageChange}
          isLoading={loading}
          variant="admin"
          language="en"
        />
      )}

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

export default PricingPlans
