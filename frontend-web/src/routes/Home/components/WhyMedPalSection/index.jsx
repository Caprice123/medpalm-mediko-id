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

// Figma repeats one placeholder card four times. Shipping four identical cards
// would read as a bug, so these are the four real selling points; the layout,
// spacing and colours still follow the design exactly.
const CARDS = [
  {
    title: 'Materi yang Terarah',
    description: 'Materi tersusun sistematis sesuai kurikulum',
  },
  {
    title: 'Anatomi 3D Interaktif',
    description: 'Pelajari struktur tubuh dari berbagai sudut',
  },
  {
    title: 'Latihan Terukur',
    description: 'Quiz dan flashcard dengan pembahasan lengkap',
  },
  {
    title: 'Progres Terpantau',
    description: 'Lacak perkembangan belajarmu setiap hari',
  },
]

function WhyMedPalSection() {
  return (
    <SectionWrapper id="features">
      <ContentWidth>
        <SectionHeading>Kenapa MedPal.id?</SectionHeading>
        <Subheading>
          Satu platform untuk mendukung perjalanan belajarmu di kedokteran.
        </Subheading>

        <CardRow>
          {CARDS.map((card, index) => (
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
