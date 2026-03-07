import { useState, useEffect, useRef } from 'react'
import { Parallax } from 'react-scroll-parallax'
import { useSelector } from 'react-redux'
import {
  FeaturesSection as StyledFeaturesSection,
  SectionContent,
  SectionHeader,
  SectionBadge,
  SectionTitle,
  SectionSubtitle,
  SlideCard,
  SlideTopBar,
  SlideProgressFill,
  SlideInner,
  SlideLeft,
  SlideNumber,
  SlideRight,
  VideoWrapper,
  SlideDecoration,
  SlideDecorationIcon,
  SlideFeatureIcon,
  SlideFeatureName,
  SlideFeatureDescription,
  SlideAccessBadge,
  SlideNavRow,
  NavArrow,
  SlideCounter,
  FeatureTabsScroller,
  FeatureTabsRow,
  FeatureTab,
  FeatureTabIcon,
  FeatureTabName,
} from '../Home.styles'

const DEFAULT_FEATURES = [
  {
    icon: '🎓',
    name: 'Bank Soal',
    description: '20.000+ soal latihan untuk persiapan UKMPPD dan ujian blok dengan pembahasan lengkap.',
    youtubeUrl: ''
  },
  {
    icon: '🎴',
    name: 'Flashcards',
    description: '18.000+ flashcard interaktif untuk membantu mengingat materi kedokteran dengan efektif.',
    youtubeUrl: ''
  },
  {
    icon: '📝',
    name: 'Summary Notes',
    description: 'Ringkasan materi yang terstruktur untuk review cepat sebelum ujian.',
    youtubeUrl: ''
  },
]

const SLIDE_DURATION = 5000

function extractVideoId(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0]
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v')
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/embed/')[1].split('?')[0]
    }
    return null
  } catch {
    return null
  }
}

// Load YouTube IFrame API script once, idempotent
function loadYouTubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev()
      resolve(window.YT)
    }
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(tag)
    }
  })
}

export default function FeaturesSection() {
  const features = useSelector((state) => state.feature.features)
  const activeFeatures = features.filter(f => f.isActive === true || f.isActive === 'true')
  const slides = activeFeatures.length > 0 ? activeFeatures : DEFAULT_FEATURES

  const [current, setCurrent] = useState(0)
  const [enterDir, setEnterDir] = useState('right')
  const [animKey, setAnimKey] = useState(0)
  const [progressKey, setProgressKey] = useState(0)
  const [paused, setPaused] = useState(false)

  const playerRef = useRef(null)
  const playerContainerRef = useRef(null)
  const slidesLengthRef = useRef(slides.length)

  // Keep slidesLengthRef in sync so onStateChange closure always has current value
  useEffect(() => {
    slidesLengthRef.current = slides.length
  }, [slides.length])

  const goNext = () => {
    setEnterDir('right')
    setCurrent(c => (c + 1) % slidesLengthRef.current)
    setAnimKey(k => k + 1)
    setProgressKey(k => k + 1)
  }

  const prevSlide = () => {
    setEnterDir('left')
    setCurrent(c => ((c - 1) % slides.length + slides.length) % slides.length)
    setAnimKey(k => k + 1)
    setProgressKey(k => k + 1)
  }

  const nextSlide = () => {
    setEnterDir('right')
    setCurrent(c => (c + 1) % slides.length)
    setAnimKey(k => k + 1)
    setProgressKey(k => k + 1)
  }

  const goTo = (index) => {
    if (index === current) return
    setEnterDir(index > current ? 'right' : 'left')
    setCurrent(index)
    setAnimKey(k => k + 1)
    setProgressKey(k => k + 1)
  }

  const feature = slides[current]
  const videoId = extractVideoId(feature?.youtubeUrl)

  // Create YT.Player when slide has a YouTube video — detects end via onStateChange
  useEffect(() => {
    if (!videoId) return

    let cancelled = false

    const destroyPlayer = () => {
      if (playerRef.current) {
        try { playerRef.current.destroy() } catch {}
        playerRef.current = null
      }
    }

    destroyPlayer()

    loadYouTubeApi().then((YT) => {
      if (cancelled || !playerContainerRef.current) return

      playerRef.current = new YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: { autoplay: 1, mute: 1, playsinline: 1, rel: 0 },
        events: {
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) {
              goNext()
            }
          }
        }
      })
    })

    return () => {
      cancelled = true
      destroyPlayer()
    }
  // Re-run whenever the video changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

  // For slides without a YouTube video, auto-advance with setTimeout
  useEffect(() => {
    if (paused || slides.length <= 1 || videoId) return

    const timer = setTimeout(() => {
      setEnterDir('right')
      setCurrent(c => (c + 1) % slides.length)
      setAnimKey(k => k + 1)
      setProgressKey(k => k + 1)
    }, SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [current, paused, slides, videoId])

  const slideNum = String(current + 1).padStart(2, '0')
  const totalNum = String(slides.length).padStart(2, '0')

  return (
    <StyledFeaturesSection id="features">
      <Parallax speed={3}>
        <SectionContent>
          <SectionHeader data-aos="fade-up">
            <SectionBadge>🚀 Fitur Unggulan</SectionBadge>
            <SectionTitle>Semua yang Anda Butuhkan untuk Belajar</SectionTitle>
            <SectionSubtitle>
              Fitur pembelajaran yang dirancang khusus untuk mahasiswa kedokteran
            </SectionSubtitle>
          </SectionHeader>

          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <SlideCard>
              <SlideTopBar>
                {!videoId && (
                  <SlideProgressFill
                    key={progressKey}
                    $paused={paused}
                    $duration={SLIDE_DURATION}
                  />
                )}
              </SlideTopBar>

              <SlideInner key={animKey} $dir={enterDir}>
                <SlideLeft>
                  <SlideNumber>{slideNum}</SlideNumber>
                  <SlideFeatureIcon>{feature.icon}</SlideFeatureIcon>
                  <SlideFeatureName>{feature.name}</SlideFeatureName>
                  <SlideFeatureDescription>{feature.description}</SlideFeatureDescription>
                </SlideLeft>

                <SlideRight>
                  {videoId ? (
                    <VideoWrapper>
                      {/* div gets replaced by YT.Player iframe */}
                      <div ref={playerContainerRef} style={{ width: '100%', height: '100%' }} />
                    </VideoWrapper>
                  ) : (
                    <SlideDecoration>
                      <SlideDecorationIcon>{feature.icon}</SlideDecorationIcon>
                    </SlideDecoration>
                  )}
                </SlideRight>
              </SlideInner>

              <SlideNavRow>
                <NavArrow onClick={prevSlide} aria-label="Previous">&#8592;</NavArrow>
                <SlideCounter>{slideNum} / {totalNum}</SlideCounter>
                <NavArrow onClick={nextSlide} aria-label="Next">&#8594;</NavArrow>
              </SlideNavRow>
            </SlideCard>
          </div>
        </SectionContent>
      </Parallax>

      {slides.length > 1 && (
        <SectionContent>
          <FeatureTabsScroller>
            <FeatureTabsRow>
              {slides.map((slide, index) => (
                <FeatureTab
                  key={index}
                  $active={index === current}
                  onClick={() => goTo(index)}
                  title={slide.name}
                >
                  <FeatureTabIcon>{slide.icon}</FeatureTabIcon>
                  <FeatureTabName>{slide.name}</FeatureTabName>
                </FeatureTab>
              ))}
            </FeatureTabsRow>
          </FeatureTabsScroller>
        </SectionContent>
      )}
    </StyledFeaturesSection>
  )
}
