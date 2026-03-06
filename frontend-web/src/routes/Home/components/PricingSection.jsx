import { useState } from 'react'
import { Parallax } from 'react-scroll-parallax'
import Button from '@components/common/Button'
import { LinkButton } from '../Home.styles'
import {
  PricingSection as StyledPricingSection,
  SectionContent,
  SectionHeader,
  SectionBadge,
  SectionTitle,
  SectionSubtitle,
  PricingFilterContainer,
  PricingGrid,
} from '../Home.styles'
import { useSelector } from 'react-redux'
import PricingPlanCard from '@components/common/PricingPlanCard'

export default function PricingSection() {
  const [pricingFilter, setPricingFilter] = useState('all')
  const pricingPlans = useSelector((state) => state.pricing.plans)

  const filteredPricingPlans = pricingFilter === 'all'
    ? pricingPlans
    : pricingPlans.filter(plan => plan.bundleType === pricingFilter)

  return (
    <Parallax speed={2}>
      <StyledPricingSection id="pricing">
        <SectionContent>
          <SectionHeader data-aos="fade-up">
            <SectionBadge>💰 Paket Kredit</SectionBadge>
            <SectionTitle>Pilih Paket yang Sesuai</SectionTitle>
            <SectionSubtitle>
              Dapatkan kredit untuk mengakses semua fitur pembelajaran premium
            </SectionSubtitle>
          </SectionHeader>

          <PricingFilterContainer data-aos="fade-up" data-aos-delay="100">
            <Button
              variant={pricingFilter === 'all' ? 'primary' : 'outline'}
              onClick={() => setPricingFilter('all')}
              style={{ borderRadius: '50px' }}
            >
              Semua Paket
            </Button>
            <Button
              variant={pricingFilter === 'credits' ? 'primary' : 'outline'}
              onClick={() => setPricingFilter('credits')}
              style={{ borderRadius: '50px' }}
            >
              Kredit
            </Button>
            <Button
              variant={pricingFilter === 'subscription' ? 'primary' : 'outline'}
              onClick={() => setPricingFilter('subscription')}
              style={{ borderRadius: '50px' }}
            >
              Berlangganan
            </Button>
            <Button
              variant={pricingFilter === 'hybrid' ? 'primary' : 'outline'}
              onClick={() => setPricingFilter('hybrid')}
              style={{ borderRadius: '50px' }}
            >
              Paket Hybrid
            </Button>
          </PricingFilterContainer>

            <PricingGrid>
                {filteredPricingPlans.map((plan, index) => (
                    <PricingPlanCard
                        key={pricingFilter + plan.id}
                        plan={plan}
                        index={index}
                        renderButton={(p) => (
                            <LinkButton
                                to="/topup"
                                variant={p.isPopular ? 'primary' : 'outline'}
                                fullWidth
                            >
                                Pilih Paket
                            </LinkButton>
                        )}
                    />
                ))}
            </PricingGrid>
        </SectionContent>
      </StyledPricingSection>
    </Parallax>
  )
}
