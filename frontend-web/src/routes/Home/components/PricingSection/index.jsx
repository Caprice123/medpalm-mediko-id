import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import EmptyState from '@components/common/EmptyState'
import pricingMascot from '@/assets/landing/pricing-capybara-idea.png'
import checkIcon from '@/assets/landing/check-icon.svg'
import { ContentWidth, SectionHeading } from '../../Home.styles'
import {
  SectionWrapper,
  HeaderBlock,
  Description,
  Mascot,
  PlanCard,
  PopularBadge,
  PlanLabel,
  PlanCredits,
  PriceRow,
  PlanPrice,
  DiscountBadge,
  Divider,
  FeatureList,
  FeatureItem,
  CheckIcon,
  PlanButton,
} from './PricingSection.styles'

// Every plan in the design lists the same five inclusions — only the credits,
// duration and price differ per card.
const PLAN_FEATURES = [
  'Materi kedokteran Semester 1–7',
  'AI Chat berbasis referensi medis terkurasi',
  'Anatomi 3D & simulasi AI OSCE',
  '35.000 kuis, flashcard & latihan klinis',
  '400 artikel ringkas dan high-yield',
]

// The pricing API returns `price` as a string (Prisma Decimal serialises that
// way), so coerce before formatting rather than trusting the type.
const formatPrice = (price) => {
  const value = Number(price)
  return Number.isFinite(value) ? `Rp ${value.toLocaleString('id-ID')}` : price
}

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
          <Row className="g-4 mt-1">
            {plans.map((plan, index) => (
              <Col key={plan.id} xs={12} sm={6} xl={3}>
                <PlanCard
                  $popular={plan.isPopular}
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                >
                  {plan.isPopular && <PopularBadge>PALING POPULER</PopularBadge>}

                  <PlanLabel>{plan.name}</PlanLabel>
                  <PlanCredits>
                    {plan.creditsIncluded} Kredit {plan.durationDays} Hari
                  </PlanCredits>

                  <PriceRow>
                    <PlanPrice>{formatPrice(plan.price)}</PlanPrice>
                    {plan.discount ? <DiscountBadge>HEMAT {plan.discount}%</DiscountBadge> : null}
                  </PriceRow>

                  <Divider />

                  <FeatureList>
                    {PLAN_FEATURES.map((feature) => (
                      <FeatureItem key={feature}>
                        <CheckIcon src={checkIcon} alt="" />
                        {feature}
                      </FeatureItem>
                    ))}
                  </FeatureList>

                  <PlanButton $popular={plan.isPopular} onClick={() => navigate('/topup')}>
                    Pilih Paket
                  </PlanButton>
                </PlanCard>
              </Col>
            ))}
          </Row>
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
