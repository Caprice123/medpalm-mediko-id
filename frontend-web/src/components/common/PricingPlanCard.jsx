import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import checkIcon from '@/assets/landing/check-icon.svg'
import {
  PricingCard,
  PopularBadge,
  PlanLabel,
  PlanCredits,
  PriceRow,
  PlanPrice,
  DiscountBadge,
  Divider,
  FeatureList,
  ButtonSlot,
} from './PricingPlanCard.styles'

// The inclusions every plan shares. The landing page lists these on each card
// regardless of plan, so a plan with no description of its own falls back to
// them here rather than showing an empty card.
const DEFAULT_PLAN_FEATURES = [
  'Materi kedokteran Semester 1–7',
  'AI Chat berbasis referensi medis terkurasi',
  'Anatomi 3D & simulasi AI OSCE',
  '35.000 kuis, flashcard & latihan klinis',
  '400 artikel ringkas dan high-yield',
]

const DEFAULT_FEATURES_MARKDOWN = DEFAULT_PLAN_FEATURES.map(feature => `- ${feature}`).join('\n')

// The pricing API returns `price` as a string (Prisma serialises Decimal that
// way), so coerce before formatting rather than trusting the type — and if it
// is not a number at all, show what the API sent instead of a silent "Rp 0".
const formatPrice = (price) => {
  const value = Number(price)
  return Number.isFinite(value) ? `Rp ${value.toLocaleString('id-ID')}` : price
}

// `creditsIncluded`/`durationDays` describe a plan differently per bundle type:
// credits packs sell an amount, subscriptions sell a window, hybrids sell both.
const describePlan = (plan) => {
  if (plan.bundleType === 'subscription') {
    return `${plan.durationDays || 0} Hari Akses`
  }

  const credits = `${(plan.creditsIncluded || 0).toLocaleString('id-ID')} Kredit`
  if (plan.bundleType === 'hybrid') {
    return `${credits} ${plan.durationDays || 0} Hari`
  }
  return credits
}

function PricingPlanCard({ plan, index, renderButton }) {
  const features = plan.description?.trim() ? plan.description : DEFAULT_FEATURES_MARKDOWN

  return (
    <PricingCard
      $isPopular={plan.isPopular}
      data-aos="fade-up"
      data-aos-delay={index * 80}
    >
      {plan.isPopular && <PopularBadge>PALING POPULER</PopularBadge>}

      <PlanLabel>{plan.name}</PlanLabel>
      <PlanCredits>{describePlan(plan)}</PlanCredits>

      <PriceRow>
        <PlanPrice>{formatPrice(plan.price)}</PlanPrice>
        {plan.discount > 0 && <DiscountBadge>HEMAT {plan.discount}%</DiscountBadge>}
      </PriceRow>

      <Divider />

      <FeatureList $checkIcon={checkIcon}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{features}</ReactMarkdown>
      </FeatureList>

      <ButtonSlot>{renderButton(plan)}</ButtonSlot>
    </PricingCard>
  )
}

export default PricingPlanCard
