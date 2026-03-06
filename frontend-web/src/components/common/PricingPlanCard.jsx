import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  PricingCard,
  PopularBadge,
  PricingName,
  PricingCredits,
  PricingPrice,
  PricingDescription,
  DiscountBadge,
} from '@routes/Home/Home.styles'

function PricingPlanCard({ plan, index, renderButton }) {
  return (
    <div data-aos="zoom-in" data-aos-delay={index * 100} style={{ height: '100%' }}>
      <PricingCard $isPopular={plan.isPopular} style={{ height: '100%' }}>
        {plan.isPopular && <PopularBadge>Paling Populer</PopularBadge>}

        <PricingName>{plan.name}</PricingName>

        <PricingCredits>
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
        </PricingCredits>

        <PricingPrice>
          Rp {Number(plan.price || 0).toLocaleString('id-ID')}
          {plan.discount > 0 && <DiscountBadge>Hemat {plan.discount}%</DiscountBadge>}
        </PricingPrice>

        <PricingDescription>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{plan.description}</ReactMarkdown>
        </PricingDescription>

        <div style={{ flex: 1 }} />

        {renderButton(plan)}
      </PricingCard>
    </div>
  )
}

export default PricingPlanCard
