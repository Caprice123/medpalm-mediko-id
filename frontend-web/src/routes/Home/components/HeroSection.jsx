import { useState, useEffect } from 'react'
import { Parallax } from 'react-scroll-parallax'
import Button from '@components/common/Button'
import { LinkButton } from '../Home.styles'
import {
  HeroSection as StyledHeroSection,
  HeroContent,
  HeroText,
  Badge,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  HeroVisual,
  HeroBrowserMockup,
  HeroBrowserBar,
  HeroBrowserDots,
  HeroBrowserDot,
  HeroBrowserUrl,
  HeroBrowserContent,
  HeroFeatureSlide,
  HeroSlideIcon,
  HeroSlideLabel,
  HeroSlideTitle,
  HeroSlideDesc,
  HeroSlideIndicators,
  HeroSlideIndicator,
} from '../Home.styles'

const DEFAULT_SLIDES = [
  {
    icon: '📝',
    label: 'Bank Soal',
    title: '40.000+ Soal MCQ',
    desc: 'Latihan UKMPPD & ujian blok dengan pembahasan lengkap dari dokter.',
  },
  {
    icon: '🩻',
    label: 'Anatomi 3D',
    title: 'Model Anatomi Interaktif',
    desc: 'Eksplorasi struktur tubuh manusia secara visual dan detail.',
  },
  {
    icon: '🩺',
    label: 'AI OSCE',
    title: 'Simulasi OSCE berbasis AI',
    desc: 'Latihan skenario klinis dengan pasien virtual yang responsif.',
  },
  {
    icon: '🎴',
    label: 'Flashcards',
    title: '45.000+ Flashcards',
    desc: 'Hafal materi kedokteran lebih cepat dengan metode spaced repetition.',
  },
  {
    icon: '💬',
    label: 'AI Assistant',
    title: 'Chat Assistant AI',
    desc: 'Dijawab langsung dengan referensi textbook & jurnal ilmiah.',
  },
]

const DEFAULT_BADGE = '✨ Platform Medis Berbasis AI'
const DEFAULT_TITLE = 'Better Learning.\nBetter Doctors.\nBetter Lives.'
const DEFAULT_SUBTITLE = '1.895+ Model Anatomi 3D Interaktif, AI Chat Khusus Mahasiswa Kedokteran, Simulasi AI OSCE dengan Pasien Virtual, 25.000+ Kuis & Flashcards, 255+ Kuis Interpretasi Klinis, dan 400+ Artikel Kedokteran'

const SLIDE_DURATION = 3500

export default function HeroSection({ scrollToSection, badge, title, subtitle, slides }) {
  const [current, setCurrent] = useState(0)

  const activeSlides = slides || DEFAULT_SLIDES
  const activeBadge = badge || DEFAULT_BADGE
  const activeSubtitle = subtitle || DEFAULT_SUBTITLE

  // Render title: split by newline for <br /> tags
  const titleLines = (title || DEFAULT_TITLE).split('\n')

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent(c => (c + 1) % activeSlides.length)
    }, SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [current, activeSlides.length])

  return (
    <StyledHeroSection>
      <Parallax speed={-5}>
        <HeroContent>
          <HeroText>
            <Badge data-aos="fade-up">{activeBadge}</Badge>
            <HeroTitle data-aos="fade-up" data-aos-delay="100">
              {titleLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < titleLines.length - 1 && <br />}
                </span>
              ))}
            </HeroTitle>
            <HeroSubtitle data-aos="fade-up" data-aos-delay="200">
              {activeSubtitle}
            </HeroSubtitle>
            <HeroButtons data-aos="fade-up" data-aos-delay="300">
              <LinkButton to="/sign-in" variant="primary" size="large">
                Mulai Sekarang
              </LinkButton>
              <Button
                variant="outline"
                size="large"
                onClick={() => scrollToSection('features')}
              >
                Lihat Fitur
              </Button>
            </HeroButtons>
          </HeroText>

          <HeroVisual data-aos="fade-left" data-aos-delay="200">
            <HeroBrowserMockup>
              <HeroBrowserBar>
                <HeroBrowserDots>
                  <HeroBrowserDot $color="#ff5f57" />
                  <HeroBrowserDot $color="#febc2e" />
                  <HeroBrowserDot $color="#28c840" />
                </HeroBrowserDots>
                <HeroBrowserUrl>medpal.id</HeroBrowserUrl>
              </HeroBrowserBar>

              <HeroBrowserContent>
                {activeSlides.map((slide, i) => (
                  <HeroFeatureSlide key={i} $active={i === current}>
                    <HeroSlideIcon>{slide.icon}</HeroSlideIcon>
                    <HeroSlideLabel>{slide.label}</HeroSlideLabel>
                    <HeroSlideTitle>{slide.title}</HeroSlideTitle>
                    <HeroSlideDesc>{slide.desc}</HeroSlideDesc>
                  </HeroFeatureSlide>
                ))}
              </HeroBrowserContent>

              <HeroSlideIndicators>
                {activeSlides.map((_, i) => (
                  <HeroSlideIndicator
                    key={i}
                    $active={i === current}
                    onClick={() => setCurrent(i)}
                  />
                ))}
              </HeroSlideIndicators>
            </HeroBrowserMockup>
          </HeroVisual>
        </HeroContent>
      </Parallax>
    </StyledHeroSection>
  )
}
