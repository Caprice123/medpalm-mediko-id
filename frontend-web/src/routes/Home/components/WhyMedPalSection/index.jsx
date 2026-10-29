import capybaraTablet from '@/assets/landing/why-capybara-tablet.png'
import blobUnion from '@/assets/landing/why-blob-union.svg'
import ellipseSmall from '@/assets/landing/why-ellipse-small.svg'
import ellipseLarge from '@/assets/landing/why-ellipse-large.svg'
import { ContentWidth, SectionHeading } from '../../Home.styles'
import {
  SectionWrapper,
  Subheading,
  CardRow,
  FeatureCard,
  CardNumber,
  CardTitle,
  CardDescription,
  Decoration,
  BlobUnion,
  EllipseSmall,
  EllipseLarge,
  DecorMascot,
} from './WhyMedPalSection.styles'
import { useWhyMedPal } from './hooks/useWhyMedPal'

// The copy is editable under Pengaturan Global; the layout, spacing and colours
// still follow the design exactly, and the 01/02/… markers are always derived
// from position so a reordered or shortened list cannot skip a number.
function WhyMedPalSection() {
  const { heading, subtitle, cards } = useWhyMedPal()

  return (
    <SectionWrapper id="features">
      <ContentWidth>
        <SectionHeading>{heading}</SectionHeading>
        <Subheading>{subtitle}</Subheading>

        <CardRow>
          {cards.map((card, index) => (
            <FeatureCard key={card.title} data-aos="fade-up" data-aos-delay={index * 80}>
              <CardNumber>{String(index + 1).padStart(2, '0')}</CardNumber>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </FeatureCard>
          ))}
        </CardRow>
      </ContentWidth>

      <Decoration aria-hidden="true">
        <BlobUnion src={blobUnion} alt="" />
        <EllipseLarge src={ellipseLarge} alt="" />
        <EllipseSmall src={ellipseSmall} alt="" />
        <DecorMascot src={capybaraTablet} alt="" />
      </Decoration>
    </SectionWrapper>
  )
}

export default WhyMedPalSection
