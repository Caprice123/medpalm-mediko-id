import frameLeft from '@/assets/landing/feature-frame-left.png'
import blobUnion from '@/assets/landing/feature-blob-union.svg'
import decorMascot from '@/assets/landing/feature-capybara-laptop.png'
import checkFirst from '@/assets/landing/feature-check-first.svg'
import check from '@/assets/landing/feature-check.svg'
import { ContentWidth } from '../../Home.styles'
import { useFeatureTabs } from './hooks/useFeatureTabs'
import {
  SectionWrapper,
  FrameLeft,
  Heading,
  Description,
  TabRow,
  Tab,
  PanelGrid,
  Illustration,
  VideoFrame,
  PanelBody,
  PanelTitle,
  PanelDescription,
  PointList,
  PointItem,
  PointIcon,
  Decoration,
  BlobUnion,
  DecorMascot,
} from './FeatureDetailSection.styles'

// Figma only draws the Atlas 3D panel. The other six keep the same layout and
// typography; their copy is written here so every tab has real content.
const TABS = [
  {
    key: 'materi',
    youtubeKey: 'summary_notes_youtube_url',
    label: 'Materi',
    title: 'Materi yang tersusun rapi per sistem.',
    description:
      'Pelajari materi kedokteran yang disusun mengikuti kurikulum, dari semester awal hingga akhir.',
    points: [
      'Tersusun per sistem dan blok perkuliahan.',
      'Ringkas, terstruktur, dan mudah diikuti.',
      'Dilengkapi rangkuman high-yield.',
      'Bisa dibaca kapan saja dan di mana saja.',
    ],
  },
  {
    key: 'atlas',
    youtubeKey: 'atlas_youtube_url',
    label: 'Atlas 3D',
    title: 'Pelajari anatomi dari berbagai sudut.',
    description:
      'Jelajahi model anatomi 3D interaktif untuk memahami struktur tubuh dengan cara yang lebih visual dan mudah dipahami.',
    points: [
      'Putar dan amati model dari berbagai sudut.',
      'Pelajari struktur anatomi secara lebih visual.',
      'Gunakan sebagai pendamping materi dan latihan.',
      'Akses pembelajaran anatomi dalam satu platform.',
    ],
  },
  {
    key: 'quiz',
    youtubeKey: 'mcq_youtube_url',
    label: 'Quiz',
    title: 'Uji pemahaman lewat latihan soal.',
    description:
      'Kerjakan kuis per topik dengan pembahasan lengkap untuk mengukur sejauh mana materi sudah dikuasai.',
    points: [
      'Soal dikelompokkan per topik dan sistem.',
      'Pembahasan tersedia untuk setiap soal.',
      'Hasil tersimpan untuk ditinjau ulang.',
      'Cocok untuk persiapan ujian blok.',
    ],
  },
  {
    key: 'flashcard',
    youtubeKey: 'flashcard_youtube_url',
    label: 'Flashcard',
    title: 'Ingat lebih lama dengan kartu kilat.',
    description:
      'Gunakan flashcard berbasis pengulangan terjadwal agar materi yang sudah dipelajari tidak cepat terlupakan.',
    points: [
      'Pengulangan dijadwalkan otomatis.',
      'Tersedia tipe basic, cloze, dan occlusion.',
      'Fokus pada kartu yang belum dikuasai.',
      'Bisa dipelajari dalam sesi singkat.',
    ],
  },
  {
    key: 'chat',
    youtubeKey: 'chatbot_youtube_url',
    label: 'Chat Assistant',
    title: 'Tanya apa saja seputar kedokteran.',
    description:
      'Ajukan pertanyaan dan dapatkan jawaban yang mengacu pada referensi medis terkurasi.',
    points: [
      'Jawaban mengacu pada sumber terkurasi.',
      'Bisa menindaklanjuti dengan pertanyaan susulan.',
      'Membantu memahami konsep yang sulit.',
      'Tersedia kapan pun dibutuhkan.',
    ],
  },
  {
    key: 'osce',
    youtubeKey: 'osce_practice_youtube_url',
    label: 'OSCE',
    title: 'Latihan OSCE dengan pasien virtual.',
    description:
      'Simulasikan skenario klinis dan latih alur anamnesis hingga pemeriksaan fisik sebelum ujian sesungguhnya.',
    points: [
      'Skenario klinis yang beragam.',
      'Latih anamnesis dan pemeriksaan fisik.',
      'Umpan balik berdasarkan rubrik penilaian.',
      'Bisa diulang sampai terbiasa.',
    ],
  },
  {
    key: 'bank-soal',
    youtubeKey: 'diagnostic_youtube_url',
    label: 'Bank Soal',
    title: 'Ribuan soal untuk persiapan ujian.',
    description:
      'Akses kumpulan soal lintas sistem dan topik untuk melatih kecepatan dan ketepatan menjawab.',
    points: [
      'Koleksi soal lintas sistem dan topik.',
      'Bisa difilter sesuai kebutuhan belajar.',
      'Dilengkapi pembahasan tiap soal.',
      'Pantau progres pengerjaanmu.',
    ],
  },
]

function FeatureDetailSection() {
  const { activeKey, setActiveKey, activeTab, videoId } = useFeatureTabs(TABS)

  return (
    <SectionWrapper>
      <FrameLeft src={frameLeft} alt="" aria-hidden="true" />

      <ContentWidth>
        <Heading data-aos="fade-up">
          Semua yang kamu butuhkan
          <span>untuk belajar kedokteran.</span>
        </Heading>
        <Description data-aos="fade-up" data-aos-delay="80">
          Mulai dari memahami materi hingga menguji pemahaman, MedPal menyediakan berbagai
          fitur yang bisa digunakan sesuai kebutuhan belajarmu.
        </Description>

        <TabRow role="tablist" data-aos="fade-up" data-aos-delay="140">
          {TABS.map((tab) => (
            <Tab
              key={tab.key}
              role="tab"
              aria-selected={tab.key === activeKey}
              $active={tab.key === activeKey}
              onClick={() => setActiveKey(tab.key)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabRow>

        <PanelGrid>
          <Illustration key={`video-${activeTab.key}`}>
            {videoId && (
              <VideoFrame
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={`Video ${activeTab.label}`}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </Illustration>

          <PanelBody key={`copy-${activeTab.key}`}>
            <PanelTitle>{activeTab.title}</PanelTitle>
            <PanelDescription>{activeTab.description}</PanelDescription>

            <PointList>
              {activeTab.points.map((point, index) => (
                <PointItem key={point}>
                  {/* Figma uses a distinct glyph on the first row. */}
                  <PointIcon src={index === 0 ? checkFirst : check} alt="" />
                  {point}
                </PointItem>
              ))}
            </PointList>
          </PanelBody>
        </PanelGrid>
      </ContentWidth>

      <Decoration aria-hidden="true">
        <BlobUnion src={blobUnion} alt="" />
        <DecorMascot src={decorMascot} alt="" />
      </Decoration>
    </SectionWrapper>
  )
}

export default FeatureDetailSection
