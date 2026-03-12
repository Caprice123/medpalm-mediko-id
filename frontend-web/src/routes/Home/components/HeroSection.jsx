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

const SLIDES = [
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

const SLIDE_DURATION = 3500

export default function HeroSection({ scrollToSection }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent(c => (c + 1) % SLIDES.length)
    }, SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [current])

  return (
    <StyledHeroSection>
      <Parallax speed={-5}>
        <HeroContent>
          <HeroText>
            <Badge data-aos="fade-up">✨ Platform Medis Berbasis AI</Badge>
            <HeroTitle data-aos="fade-up" data-aos-delay="100">
              Better Learning. Better Doctors. Better Lives.
            </HeroTitle>
            <HeroSubtitle data-aos="fade-up" data-aos-delay="200">
              1.895+ Model Anatomi 3D Interaktif, AI Chat Khusus Mahasiswa Kedokteran, Simulasi AI OSCE dengan Pasien Virtual, 25.000+ Kuis & Flashcards, 255+ Kuis Interpretasi Klinis, dan 400+ Artikel Kedokteran
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
                {SLIDES.map((slide, i) => (
                  <HeroFeatureSlide key={i} $active={i === current}>
                    <HeroSlideIcon>{slide.icon}</HeroSlideIcon>
                    <HeroSlideLabel>{slide.label}</HeroSlideLabel>
                    <HeroSlideTitle>{slide.title}</HeroSlideTitle>
                    <HeroSlideDesc>{slide.desc}</HeroSlideDesc>
                  </HeroFeatureSlide>
                ))}
              </HeroBrowserContent>

              <HeroSlideIndicators>
                {SLIDES.map((_, i) => (
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
