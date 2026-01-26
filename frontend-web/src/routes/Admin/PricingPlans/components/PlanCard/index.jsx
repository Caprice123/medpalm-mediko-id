import {
  Card,
  PopularBadge,
  PlanName,
  PlanDescription,
  PlanCredits,
  PriceContainer,
  PlanPrice,
  DiscountBadge,
  ActionButtons,
  ActionButton
} from './PlanCard.styles'
import Button from '@components/common/Button'

function PlanCard({ plan, onEdit, onToggle, formatPrice }) {
  const getBundleText = () => {
    const bundleType = plan.bundle_type || plan.bundleType
    const credits = plan.credits_included || plan.creditsIncluded || 0
    const days = plan.duration_days || plan.durationDays || 0

    if (bundleType === 'subscription') {
      return `${days} Hari Akses`
    } else if (bundleType === 'hybrid') {
      return (
        <>
          {credits.toLocaleString()} Kredit
          <br />
          {days} Hari
        </>
      )
    } else {
      return `${credits.toLocaleString()} Kredit`
    }
  }

  const isActive = plan.is_active !== undefined ? plan.is_active : plan.isActive
  const isPopular = plan.is_popular !== undefined ? plan.is_popular : plan.isPopular

  return (
    <Card isActive={isActive}>
      {isPopular && <PopularBadge>Paling Populer</PopularBadge>}

      <PlanName>{plan.name}</PlanName>

      <PlanCredits>{getBundleText()}</PlanCredits>

      <PriceContainer>
        <PlanPrice>
          {formatPrice(plan.price)}
          {plan.discount > 0 && (
            <DiscountBadge>Hemat {plan.discount}%</DiscountBadge>
          )}
        </PlanPrice>
      </PriceContainer>

        <div style={{ flex: 1 }}></div>
      {plan.description && <PlanDescription>{plan.description}</PlanDescription>}

        <div style={{ flex: 1 }}></div>
      <ActionButtons>
        <Button fullWidth onClick={() => onEdit(plan)}>
          Edit
        </Button>
        <Button
          variant="primary"
          fullWidth
          onClick={() => onToggle(plan)}
        >
          {(plan.is_active !== undefined ? plan.is_active : plan.isActive) ? 'Disable' : 'Enable'}
        </Button>
      </ActionButtons>
    </Card>
  )
}

export default PlanCard
