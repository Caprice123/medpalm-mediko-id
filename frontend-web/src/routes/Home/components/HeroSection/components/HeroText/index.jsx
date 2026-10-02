import { PillCtaPrimary, PillCtaSecondary } from '@routes/Home/Home.styles'
import { useHeroStats } from './hooks/useHeroStats'
import {
  TextWrap,
  Title,
  TitleHighlight,
  Lead,
  Buttons,
  Stats,
  StatValue,
  StatLabel,
} from './HeroText.styles'

const DEFAULT_SUBTITLE = '1.895+ Model Anatomi 3D Interaktif, AI Chat Khusus Mahasiswa Kedokteran, Simulasi AI OSCE dengan Pasien Virtual, 25.000+ Quiz & Flashcard, dan 400+ Artikel Kedokteran — semua dalam satu platform.'

const HERO_STATS = [
  { count: 1895, label: 'Model Anatomi 3D' },
  { count: 25000, label: 'Quiz & Flashcard' },
  { count: 400, label: 'Artikel Kedokteran' },
]

export default function HeroText({ scrollToSection, title, subtitle }) {
  const activeSubtitle = subtitle || DEFAULT_SUBTITLE
  const customTitleLines = title ? title.split('\n') : null
  const { containerRef, displayValues } = useHeroStats(HERO_STATS)

  return (
    <TextWrap>
      <Title data-aos="fade-up" data-aos-delay="100">
        {customTitleLines ? (
          customTitleLines.map((line, i) => <span key={i}>{line}</span>)
        ) : (
          <>
            <span>Better Learning.</span>
            <span>Better Doctors.</span>
            <TitleHighlight>Better Lives.</TitleHighlight>
          </>
        )}
      </Title>

      <Lead data-aos="fade-up" data-aos-delay="200">
        {activeSubtitle}
      </Lead>

      <Buttons data-aos="fade-up" data-aos-delay="300">
        <PillCtaPrimary to="/sign-in">Mulai Sekarang 🚀</PillCtaPrimary>
        <PillCtaSecondary onClick={() => scrollToSection('how-it-works')}>
          Lihat Demo
        </PillCtaSecondary>
      </Buttons>

      <Stats ref={containerRef} data-aos="fade-up" data-aos-delay="400">
        {HERO_STATS.map((stat, i) => (
          <div key={stat.label}>
            <StatValue>{displayValues[i] || `${stat.count.toLocaleString('id-ID')}+`}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </div>
        ))}
      </Stats>
    </TextWrap>
  )
}
