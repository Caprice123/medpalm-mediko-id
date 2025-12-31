import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPricingPlans, purchasePricingPlan } from '@store/pricing/action'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  PlansGrid,
  PlanCard,
  PopularBadge,
  PlanName,
  PlanCredits,
  PlanPrice,
  DiscountBadge,
  PurchaseButton,
  LoadingState,
  EmptyState,
  ErrorMessage,
  FilterTabs,
  FilterTab,
  PlanDescription
} from './CreditPurchase.styles'

function CreditPurchase({ isOpen, onClose, onPurchaseSuccess }) {
  const dispatch = useDispatch()
  const plans = useSelector(state => state.pricing.plans)
  const loading = useSelector(state => state.pricing.loading.isPlansLoading)
  const error = useSelector(state => state.pricing.error)
  const purchasing = useSelector(state => state.pricing.loading.isPurchaseLoading)

  const [activeFilter, setActiveFilter] = useState('all')
  const [purchasingPlanId, setPurchasingPlanId] = useState(null)

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchPricingPlans())
    }
  }, [isOpen, dispatch])

  const handlePurchase = async (plan) => {
    try {
      setPurchasingPlanId(plan.id)

      const result = await dispatch(purchasePricingPlan(plan.id, 'xendit'))

      console.log('Purchase result:', result)
      console.log('Payment info received:', result.data)

      const { paymentInfo } = result.data

      // If Xendit invoice URL is available, redirect to it
      if (paymentInfo?.invoiceUrl) {
        window.open(paymentInfo.invoiceUrl, '_blank')

        alert(
          `Payment page opened in new window!\n\n` +
          `Plan: ${plan.name}\n` +
          `Type: ${getBundleTypeLabel(plan.bundleType)}\n` +
          `Amount: Rp ${Number(plan.price).toLocaleString('id-ID')}\n\n` +
          `Please complete the payment. ${getPlanBenefitText(plan)}\n\n` +
          `If the payment window didn't open, click OK to open it.`
        )

        window.open(paymentInfo.invoiceUrl, '_blank')
      } else {
        alert(
          `Purchase initiated!\n\n` +
          `Plan: ${plan.name}\n` +
          `Type: ${getBundleTypeLabel(plan.bundleType)}\n` +
          `Amount: Rp ${Number(plan.price).toLocaleString('id-ID')}\n\n` +
          `Payment Reference: ${paymentInfo?.reference || 'Pending'}\n\n` +
          `Please complete the manual payment and wait for admin approval.`
        )
      }

      if (onPurchaseSuccess) {
        onPurchaseSuccess(result)
      }

      onClose()
    } catch (err) {
      alert('Purchase failed: ' + (err.response?.data?.message || err.message))
      console.error('Purchase error:', err)
    } finally {
      setPurchasingPlanId(null)
    }
  }

  const getBundleTypeLabel = (type) => {
    const labels = {
      credits: 'Paket Kredit',
      subscription: 'Langganan',
      hybrid: 'Paket Hybrid'
    }
    return labels[type] || type
  }

  const getPlanBenefitText = (plan) => {
    if (plan.bundleType === 'credits') {
      return `You will receive ${plan.creditsIncluded} credits after payment confirmation.`
    } else if (plan.bundleType === 'subscription') {
      return `Your subscription will be activated for ${plan.durationMonths} month(s) after payment confirmation.`
    } else if (plan.bundleType === 'hybrid') {
      return `You will receive ${plan.creditsIncluded} credits and ${plan.durationMonths} month(s) subscription after payment confirmation.`
    }
    return 'Your purchase will be processed after payment confirmation.'
  }

  const filteredPlans = plans.filter(plan => {
    if (activeFilter === 'all') return true
    return plan.bundleType === activeFilter
  })

  if (!isOpen) return null

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Pilih Paket yang Sesuai</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FilterTabs>
            <FilterTab
              $active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            >
              Semua Paket
            </FilterTab>
            <FilterTab
              $active={activeFilter === 'credits'}
              onClick={() => setActiveFilter('credits')}
            >
              Kredit
            </FilterTab>
            <FilterTab
              $active={activeFilter === 'subscription'}
              onClick={() => setActiveFilter('subscription')}
            >
              Berlangganan
            </FilterTab>
            <FilterTab
              $active={activeFilter === 'hybrid'}
              onClick={() => setActiveFilter('hybrid')}
            >
              Paket Hybrid
            </FilterTab>
          </FilterTabs>

          {loading ? (
            <LoadingState>Memuat paket...</LoadingState>
          ) : filteredPlans.length > 0 ? (
            <PlansGrid>
              {filteredPlans.map((plan) => (
                <PlanCard key={plan.id}>
                  {plan.isPopular && <PopularBadge>Paling Populer</PopularBadge>}
                  <PlanName>{plan.name}</PlanName>

                  <PlanCredits>
                    {plan.bundleType === 'subscription' ? (
                      `${plan.durationDays || 0} Hari Akses`
                    ) : plan.bundleType === 'hybrid' ? (
                      <>
                        {(plan.creditsIncluded || 0).toLocaleString()} Kredit
                        <br />
                        {plan.durationDays || 0} Hari
                      </>
                    ) : (
                      `${(plan.creditsIncluded || 0).toLocaleString()} Kredit`
                    )}
                  </PlanCredits>

                  <PlanPrice>
                    Rp {Number(plan.price || 0).toLocaleString('id-ID')}
                    {plan.discount > 0 && (
                      <DiscountBadge>Hemat {plan.discount}%</DiscountBadge>
                    )}
                  </PlanPrice>

                  <PlanDescription>
                    {plan.description || 'Akses semua fitur pembelajaran premium'}
                  </PlanDescription>

                  <PurchaseButton
                    onClick={() => handlePurchase(plan)}
                    disabled={purchasingPlanId === plan.id}
                  >
                    {purchasingPlanId === plan.id ? 'Memproses...' : 'Pilih Paket'}
                  </PurchaseButton>
                </PlanCard>
              ))}
            </PlansGrid>
          ) : (
            <EmptyState>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
              <div>Tidak ada paket tersedia</div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Pilih kategori lain atau coba lagi nanti
              </div>
            </EmptyState>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreditPurchase
