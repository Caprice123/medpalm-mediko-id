import { useState } from 'react'
import { Parallax } from 'react-scroll-parallax'
import {
  PricingSection as StyledPricingSection,
  SectionContent,
  SectionHeader,
  SectionBadge,
  SectionTitle,
  SectionSubtitle,
  PricingFilterContainer,
  PricingTab,
  PricingGrid,
  HeroCtaPrimary,
  HeroCtaSecondary,
} from '../Home.styles'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PricingPlanCard from '@components/common/PricingPlanCard'

const FILTERS = [
  { key: 'all', label: 'Semua Paket' },
  { key: 'credits', label: 'Kredit' },
  { key: 'subscription', label: 'Berlangganan' },
  { key: 'hybrid', label: 'Paket Hybrid' },
]

export default function PricingSection() {
  const [pricingFilter, setPricingFilter] = useState('all')
  const pricingPlans = useSelector((state) => state.pricing.plans)
  const navigate = useNavigate()

  const filteredPricingPlans = pricingFilter === 'all'
    ? pricingPlans
    : pricingPlans.filter(plan => plan.bundleType === pricingFilter)

  const availableBundleTypes = new Set(pricingPlans.map(plan => plan.bundleType))
  const visibleFilters = FILTERS.filter(f => f.key === 'all' || availableBundleTypes.has(f.key))

  return (
    <Parallax speed={2}>
      <StyledPricingSection id="pricing">
        <SectionContent>
          <SectionHeader data-aos="fade-up">
            <SectionBadge>Paket Kredit</SectionBadge>
            <SectionTitle>Pilih Paket yang Paling Pas Buatmu</SectionTitle>
            <SectionSubtitle>
              Kredit dipakai untuk membuka semua fitur belajar premium, kapan pun kamu perlu.
            </SectionSubtitle>
          </SectionHeader>

          {visibleFilters.length > 1 && (
            <PricingFilterContainer data-aos="fade-up" data-aos-delay="100">
              {visibleFilters.map(f => (
                <PricingTab
                  key={f.key}
                  $active={pricingFilter === f.key}
                  onClick={() => setPricingFilter(f.key)}
                >
                  {f.label}
                </PricingTab>
              ))}
            </PricingFilterContainer>
          )}

            <PricingGrid>
                {filteredPricingPlans.map((plan, index) => (
                    <PricingPlanCard
                        key={pricingFilter + plan.id}
                        plan={plan}
                        index={index}
                        renderButton={(p) => (
                            p.isPopular ? (
                              <HeroCtaPrimary as="button" onClick={() => navigate('/topup')} style={{ width: '100%' }}>
                                Pilih Paket
                              </HeroCtaPrimary>
                            ) : (
                              <HeroCtaSecondary onClick={() => navigate('/topup')} style={{ width: '100%' }}>
                                Pilih Paket
                              </HeroCtaSecondary>
                            )
                        )}
                    />
                ))}
            </PricingGrid>
        </SectionContent>
      </StyledPricingSection>
    </Parallax>
  )
}
