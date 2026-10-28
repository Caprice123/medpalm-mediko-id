import { SectionContent } from '@routes/Home/Home.styles'
import { mascots } from '@routes/Home/utils/mascots'
import { useDemoVideo } from './hooks/useDemoVideo'
import {
  HowItWorksWrapper,
  DemoPanel,
  DemoPanelBlob,
  DemoGrid,
  DemoBadge,
  DemoTitle,
  DemoSubtitle,
  DemoSteps,
  DemoStep,
  DemoStepNumber,
  VideoWrap,
  VideoFrame,
  PlayButton,
  VideoMascot,
} from './HowItWorksSection.styles'

const STEPS = [
  'Pilih topik atau sistem tubuh yang mau dipelajari',
  'Jelajahi model 3D & kerjakan quiz interaktif',
  'Uji pemahaman lewat simulasi OSCE pasien virtual',
]

export default function HowItWorksSection({ youtubeUrl }) {
  const { playing, videoId, play } = useDemoVideo(youtubeUrl)

  return (
    <HowItWorksWrapper id="how-it-works">
      <SectionContent>
        <DemoPanel data-aos="zoom-in">
          <DemoPanelBlob />
          <DemoGrid>
            <div>
              <DemoBadge>Cara Kerja</DemoBadge>
              <DemoTitle>Belajar kedokteran, dibuat semudah main game</DemoTitle>
              <DemoSubtitle>
                Tonton demo singkat dan lihat bagaimana MedPal menemanimu dari materi sampai simulasi pasien.
              </DemoSubtitle>

              <DemoSteps>
                {STEPS.map((step, i) => (
                  <DemoStep key={step}>
                    <DemoStepNumber>{i + 1}</DemoStepNumber>
                    {step}
                  </DemoStep>
                ))}
              </DemoSteps>
            </div>

            <VideoWrap>
              <VideoFrame onClick={play}>
                {playing && videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="MedPal Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    {videoId && (
                      <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="MedPal Demo" />
                    )}
                    <PlayButton>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </PlayButton>
                  </>
                )}
              </VideoFrame>
              <VideoMascot src={mascots.checklistClipboard} alt="Maskot kapibara MedPal dengan checklist" />
            </VideoWrap>
          </DemoGrid>
        </DemoPanel>
      </SectionContent>
    </HowItWorksWrapper>
  )
}
