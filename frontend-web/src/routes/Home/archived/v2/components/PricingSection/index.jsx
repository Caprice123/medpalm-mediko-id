import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PricingPlanCard from '@components/common/PricingPlanCard'
import EmptyState from '@components/common/EmptyState'
import {
  SectionContent,
  SectionHeader,
  SectionBadge,
  SectionTitle,
  SectionSubtitle,
  PricingFilterContainer,
  PricingTab,
  PricingGrid,
  PillCtaPrimary,
  PillCtaSecondary,
} from '@routes/Home/Home.styles'
import { mascots } from '@routes/Home/utils/mascots'
import { usePricingFilter } from './hooks/usePricingFilter'
import { PricingWrapper, PricingHead, HeadMascot, EmptyMascot } from './PricingSection.styles'

export default function PricingSection() {
  const pricingPlans = useSelector((state) => state.pricing.plans)
  const navigate = useNavigate()
  const { filter, setFilter, filteredPlans, visibleFilters } = usePricingFilter(pricingPlans)

  return (
    <PricingWrapper id="pricing">
      <SectionContent>
        <PricingHead>
          <HeadMascot src={mascots.coffeeMug} alt="Maskot kapibara MedPal minum kopi" />
          <SectionHeader data-aos="fade-up">
            <SectionBadge>Paket Kredit</SectionBadge>
            <SectionTitle>Pilih Paket yang Paling Pas Buatmu</SectionTitle>
            <SectionSubtitle>
              Kredit dipakai untuk membuka semua fitur belajar premium, kapan pun kamu perlu.
            </SectionSubtitle>
          </SectionHeader>
        </PricingHead>

        {visibleFilters.length > 1 && (
          <PricingFilterContainer data-aos="fade-up" data-aos-delay="100">
            {visibleFilters.map(f => (
              <PricingTab key={f.key} $active={filter === f.key} onClick={() => setFilter(f.key)}>
                {f.label}
              </PricingTab>
            ))}
          </PricingFilterContainer>
        )}

        {filteredPlans.length > 0 ? (
          <PricingGrid>
            {filteredPlans.map((plan, index) => (
              <PricingPlanCard
                key={filter + plan.id}
                plan={plan}
                index={index}
                renderButton={(p) => (
                  p.isPopular ? (
                    <PillCtaPrimary as="button" onClick={() => navigate('/topup')} style={{ width: '100%' }}>
                      Pilih Paket
                    </PillCtaPrimary>
                  ) : (
                    <PillCtaSecondary onClick={() => navigate('/topup')} style={{ width: '100%' }}>
                      Pilih Paket
                    </PillCtaSecondary>
                  )
                )}
              />
            ))}
          </PricingGrid>
        ) : (
          <EmptyState
            data-aos="fade-up"
            icon={<EmptyMascot src={mascots.sleepingBooks} alt="Maskot kapibara MedPal tertidur di tumpukan buku" />}
            title="Paket segera hadir"
            description="Pal lagi siapin paketnya. Sementara itu, cek dulu Semua Paket ya!"
          />
        )}
      </SectionContent>
    </PricingWrapper>
  )
}
