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
  PricingCard,
  PopularBadge,
  PricingName,
  PricingCredits,
  PricingPrice,
  PricingDescription,
  DiscountBadge,
} from '../Home.styles'
import { useSelector } from 'react-redux'

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

          <Parallax speed={-1}>
            <PricingGrid>
              {filteredPricingPlans.length > 0 && (
                filteredPricingPlans.map((plan, index) => (
                  <PricingCard
                    key={new Date().getTime() + index}
                    $isPopular={plan.isPopular}
                    data-aos="zoom-in"
                    data-aos-delay={index * 100}
                  >
                    {plan.isPopular && <PopularBadge>Paling Populer</PopularBadge>}
                    <PricingName>{plan.name}</PricingName>
                    <PricingCredits>
                      {plan.bundleType === 'subscription' ? (
                        `${plan.durationDays} Hari Akses`
                      ) : plan.bundleType === 'hybrid' ? (
                        <>
                          {plan.creditsIncluded.toLocaleString()} Kredit
                          <br />
                          {plan.durationDays} Hari
                        </>
                      ) : (
                        `${plan.creditsIncluded.toLocaleString()} Kredit`
                      )}
                    </PricingCredits>
                    <PricingPrice>
                      Rp {Number(plan.price).toLocaleString('id-ID')}
                      {plan.discount > 0 && (
                        <DiscountBadge>Hemat {plan.discount}%</DiscountBadge>
                      )}
                    </PricingPrice>
                    <PricingDescription>
                      {plan.description || 'Akses semua fitur pembelajaran premium'}
                    </PricingDescription>
                    <LinkButton
                      to="/sign-in"
                      variant={plan.isPopular ? 'primary' : 'outline'}
                      fullWidth
                    >
                      Pilih Paket
                    </LinkButton>
                  </PricingCard>
                ))
              )}
            </PricingGrid>
          </Parallax>
        </SectionContent>
      </StyledPricingSection>
    </Parallax>
  )
}
