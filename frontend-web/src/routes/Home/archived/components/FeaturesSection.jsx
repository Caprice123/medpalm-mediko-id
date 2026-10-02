import { Parallax } from 'react-scroll-parallax'
import { useSelector } from 'react-redux'
import {
  FeaturesSection as StyledFeaturesSection,
  SectionContent,
  SectionHeader,
  SectionBadge,
  SectionTitle,
  SectionSubtitle,
  FeaturesGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
} from '../Home.styles'

const DEFAULT_FEATURES = [
  {
    icon: '🫀',
    name: 'Atlas 3D Anatomi',
    description: 'Putar, potong, dan jelajahi struktur tubuh manusia secara visual dan detail — bukan cuma hafalan gambar datar.',
  },
  {
    icon: '🧠',
    name: 'Quiz Anatomi Interaktif',
    description: 'Quiz berbasis gambar 3D yang membantu kamu memahami dan mengingat struktur tubuh lebih lama.',
  },
  {
    icon: '💬',
    name: 'AI Chat Assistant',
    description: 'Tanya apa saja soal materi kedokteran, dijawab dari database jurnal ilmiah — siap 24 jam.',
  },
  {
    icon: '🩻',
    name: 'Simulasi OSCE',
    description: 'Latihan menghadapi pasien virtual seperti ujian OSCE sungguhan, lengkap dengan feedback.',
  },
  {
    icon: '🗂️',
    name: 'Flashcard Active Recall',
    description: '35.000+ flashcard yang dirancang untuk membantu materi menempel lebih lama di ingatan.',
  },
  {
    icon: '📚',
    name: 'Bank Soal & Artikel',
    description: '400+ artikel ringkas dan bank soal latihan penunjang: EKG, radiologi, lab, dan lainnya.',
  },
]

const ICON_BG_PALETTE = ['#DCEEFB', '#E3F7E0', '#FDF3D9', '#DFF3EF', '#E4E7FB', '#FCE4EC']

export default function FeaturesSection() {
  const features = useSelector((state) => state.feature.features)
  const activeFeatures = features.filter(f => f.isActive === true || f.isActive === 'true')
  const items = activeFeatures.length > 0 ? activeFeatures : DEFAULT_FEATURES

  return (
    <StyledFeaturesSection id="features">
      <Parallax speed={3}>
        <SectionContent>
          <SectionHeader data-aos="fade-up">
            <SectionBadge>Fitur Unggulan</SectionBadge>
            <SectionTitle>Semua yang Kamu Butuhkan untuk Belajar</SectionTitle>
            <SectionSubtitle>
              Dirancang khusus untuk cara belajar mahasiswa kedokteran, bukan sekadar rangkuman.
            </SectionSubtitle>
          </SectionHeader>

          <FeaturesGrid>
            {items.map((feature, i) => (
              <FeatureCard key={i} data-aos="fade-up" data-aos-delay={(i % 2) * 100}>
                <FeatureIcon $bg={ICON_BG_PALETTE[i % ICON_BG_PALETTE.length]}>
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle>{feature.name}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </SectionContent>
      </Parallax>
    </StyledFeaturesSection>
  )
}
