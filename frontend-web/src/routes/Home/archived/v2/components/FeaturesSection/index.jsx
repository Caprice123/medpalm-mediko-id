import { useSelector } from 'react-redux'
import { PillCtaPrimary, SectionContent, SectionHeader, SectionBadge, SectionTitle, SectionSubtitle } from '@routes/Home/Home.styles'
import { featureSlideMascots } from '@routes/Home/utils/mascots'
import { extractYoutubeId } from '@routes/Home/utils/youtube'
import { useFeatureSlider } from './hooks/useFeatureSlider'
import {
  FeaturesWrapper,
  TabsScroller,
  TabsRow,
  Tab,
  SlideCard,
  SlideStage,
  Slide,
  SlideNum,
  SlideIcon,
  SlideTitle,
  SlideDescription,
  SlideVisual,
  Frame,
  FrameBar,
  FrameUrl,
  FramePlaceholder,
  FramePlaceholderIcon,
  FramePlaceholderTitle,
  FramePlaceholderSub,
  VideoThumb,
  VideoPlayButton,
  SlideMascot,
  SlideNavRow,
  NavArrow,
  SlideProgressTrack,
  SlideProgressFill,
} from './FeaturesSection.styles'

const DEFAULT_FEATURES = [
  { icon: '📝', name: 'Ringkasan Materi', description: 'Artikel ringkas dan tersambung flashcards dan quizzes yang dibuat oleh tim akademik MedPal.', tint: '#e3f1fb', slug: 'ringkasan' },
  { icon: '🦴', name: 'Quiz Anatomi Interaktif', description: 'Quiz anatomi berbasis gambar untuk membantu mahasiswa kedokteran memahami dan menghafal struktur anatomi tubuh manusia.', tint: '#e4f6de', slug: 'quiz-anatomi' },
  { icon: '🧬', name: 'Atlas 3D', description: 'Akses model 3D interaktif yang menampilkan konsep basic science, struktur mikrobiologi, serta berbagai prosedur medis untuk membantu memahami materi secara visual.', tint: '#fdf1d8', slug: 'atlas-3d' },
  { icon: '💬', name: 'Chat Assistant', description: 'Multi-mode AI chatbot dengan percakapan bertopik untuk membantu belajar dan riset medis.', tint: '#e0f4ef', slug: 'chat' },
  { icon: '🩺', name: 'OSCE Practice', description: 'Latihan skenario klinis dengan penilaian AI dan feedback real-time.', tint: '#ebe8fb', slug: 'osce' },
  { icon: '📚', name: 'PBL Case Builder', description: 'Tools untuk membuat laporan problem based learning seperti BBDM, SGD, SOOCA, dan sejenisnya.', tint: '#fde6ec', slug: 'pbl' },
  { icon: '✍️', name: 'Bank Soal Preklinik', description: 'Latihan soal dengan mode belajar dan simulasi ujian lengkap dengan statistik.', tint: '#e3f1fb', slug: 'bank-soal' },
  { icon: '🩻', name: 'Quiz Latihan Penunjang', description: 'Quiz untuk melatih kemampuan interpretasi pemeriksaan penunjang, seperti EKG, radiologi, hasil laboratorium, dan pemeriksaan penunjang lainnya.', tint: '#e4f6de', slug: 'penunjang' },
  { icon: '🃏', name: 'Flashcard Belajar Interaktif', description: 'Generate flashcard untuk membantu mahasiswa kedokteran menghafal konsep penting dengan metode active recall.', tint: '#fdf1d8', slug: 'flashcard' },
]

const ICON_BG_PALETTE = ['#e3f1fb', '#e4f6de', '#fdf1d8', '#e0f4ef', '#ebe8fb', '#fde6ec']

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function FeaturesSection() {
  const features = useSelector((state) => state.feature.features)
  const activeFeatures = features.filter(f => f.isActive === true || f.isActive === 'true')
  const items = (activeFeatures.length > 0 ? activeFeatures : DEFAULT_FEATURES).map((f, i) => ({
    icon: f.icon,
    name: f.name,
    description: f.description,
    tint: f.tint || ICON_BG_PALETTE[i % ICON_BG_PALETTE.length],
    slug: f.slug || slugify(f.name || `fitur-${i + 1}`),
    mascot: featureSlideMascots[i % featureSlideMascots.length],
    videoId: extractYoutubeId(f.youtubeUrl),
  }))

  const {
    current, progress, go, playingVideo, playVideo,
    onMouseEnter, onMouseLeave, onFocus, onBlur, onPointerDown, onPointerUp,
  } = useFeatureSlider(items.length)

  return (
    <FeaturesWrapper id="features">
      <SectionContent>
        <SectionHeader data-aos="fade-up">
          <SectionBadge>Fitur Unggulan</SectionBadge>
          <SectionTitle>Semua yang Kamu Butuhkan untuk Belajar</SectionTitle>
          <SectionSubtitle>
            Dirancang khusus untuk cara belajar mahasiswa kedokteran, bukan sekadar rangkuman.
          </SectionSubtitle>
        </SectionHeader>

        <div
          data-aos="fade-up"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <TabsScroller>
            <TabsRow role="tablist">
              {items.map((item, i) => (
                <Tab
                  key={item.name + i}
                  role="tab"
                  $active={i === current}
                  aria-selected={i === current}
                  onClick={() => go(i)}
                >
                  <span>{item.icon}</span>{item.name}
                </Tab>
              ))}
            </TabsRow>
          </TabsScroller>

          <SlideCard>
            <SlideStage onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
              {items.map((item, i) => (
                <Slide key={item.name + i} $active={i === current} role="tabpanel" aria-label={item.name}>
                  <div>
                    <SlideNum>
                      {String(i + 1).padStart(2, '0')}
                      <i> / {String(items.length).padStart(2, '0')}</i>
                    </SlideNum>
                    <SlideIcon $bg={item.tint}>{item.icon}</SlideIcon>
                    <SlideTitle>{item.name}</SlideTitle>
                    <SlideDescription>{item.description}</SlideDescription>
                    <PillCtaPrimary to="/sign-in">Coba Sekarang</PillCtaPrimary>
                  </div>

                  <SlideVisual>
                    <Frame>
                      <FrameBar>
                        <i /><i /><i />
                        <FrameUrl>medpal.id/{item.slug}</FrameUrl>
                      </FrameBar>
                      {item.videoId ? (
                        <VideoThumb onClick={() => i === current && playVideo()}>
                          {playingVideo && i === current ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1`}
                              title={item.name}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <>
                              <img src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`} alt={item.name} loading="lazy" />
                              <VideoPlayButton>
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </VideoPlayButton>
                            </>
                          )}
                        </VideoThumb>
                      ) : (
                        <FramePlaceholder $tint={item.tint}>
                          <FramePlaceholderIcon>{item.icon}</FramePlaceholderIcon>
                          <FramePlaceholderTitle>{item.name}</FramePlaceholderTitle>
                          <FramePlaceholderSub>Screenshot fitur</FramePlaceholderSub>
                        </FramePlaceholder>
                      )}
                    </Frame>
                    <SlideMascot src={item.mascot} alt="" loading="lazy" />
                  </SlideVisual>
                </Slide>
              ))}
            </SlideStage>

            <SlideNavRow>
              <NavArrow aria-label="Fitur sebelumnya" onClick={() => go(current - 1)}>‹</NavArrow>
              <SlideProgressTrack>
                <SlideProgressFill $progress={progress} />
              </SlideProgressTrack>
              <NavArrow aria-label="Fitur berikutnya" onClick={() => go(current + 1)}>›</NavArrow>
            </SlideNavRow>
          </SlideCard>
        </div>
      </SectionContent>
    </FeaturesWrapper>
  )
}
