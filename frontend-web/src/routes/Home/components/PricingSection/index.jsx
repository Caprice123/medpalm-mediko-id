import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import PricingPlanCard from '@components/common/PricingPlanCard'
import { PricingGrid } from '@components/common/PricingPlanCard.styles'
import pricingMascot from '@/assets/landing/pricing-capybara-idea.png'
import { TopupRoute } from '@routes/Topup/routes'
import { ContentWidth, SectionHeading } from '../../Home.styles'
import {
  SectionWrapper,
  HeaderBlock,
  Description,
  Mascot,
} from './PricingSection.styles'

// The card itself is `@components/common/PricingPlanCard`, the same component
// /topup renders. It used to be a second copy of the card living in this
// folder, which also meant the inclusions under each plan were a hardcoded
// list here while /topup showed the plan's own `description` — so the two
// pages disagreed about what a plan included. Both now read the card, and the
// inclusions, from the pricing API.
function PricingSection() {
  const navigate = useNavigate()
  const plans = useSelector((state) => state.pricing.plans)

  return (
    <SectionWrapper id="pricing">
      <Mascot src={pricingMascot} alt="" aria-hidden="true" />

      <ContentWidth>
        <HeaderBlock>
          <SectionHeading>Pilih paket sesuai kebutuhan belajarmu.</SectionHeading>
          <Description>
            Akses fitur MedPal sesuai durasi dan kebutuhan belajarmu. Pilih paket yang
            paling sesuai untuk mendukung proses belajar sehari-hari.
          </Description>
        </HeaderBlock>

        {plans && plans.length > 0 ? (
          <PricingGrid>
            {plans.map((plan, index) => (
              <PricingPlanCard
                key={plan.id}
                plan={plan}
                index={index}
                renderButton={(p) => (
                  <Button
                    variant={p.isPopular ? 'primary' : 'secondary'}
                    fullWidth
                    onClick={() => navigate(TopupRoute.moduleRoute)}
                  >
                    Pilih Paket
                  </Button>
                )}
              />
            ))}
          </PricingGrid>
        ) : (
          <EmptyState
            title="Paket belum tersedia"
            description="Paket berlangganan sedang disiapkan. Silakan cek kembali nanti."
          />
        )}
      </ContentWidth>
    </SectionWrapper>
  )
}

export default PricingSection
