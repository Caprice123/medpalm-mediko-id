import { useState } from 'react'
import { Parallax } from 'react-scroll-parallax'
import {
  HowItWorksSection as StyledHowItWorksSection,
  SectionContent,
  DemoPanel,
  DemoPanelBlob,
  DemoPanelGrid,
  DemoBadge,
  DemoTitle,
  DemoSubtitle,
  DemoSteps,
  DemoStep,
  DemoStepNumber,
  DemoStepText,
  DemoVideoWrap,
  DemoPlayButton,
} from '../Home.styles'

const STEPS = [
  'Pilih topik atau sistem tubuh yang mau dipelajari',
  'Jelajahi model 3D & kerjakan quiz interaktif',
  'Uji pemahaman lewat simulasi OSCE pasien virtual',
]

function extractVideoId(url) {
  if (!url) return null
  const match = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

export default function HowItWorksSection({ youtubeUrl }) {
  const [playing, setPlaying] = useState(false)
  const videoId = extractVideoId(youtubeUrl)

  return (
    <Parallax speed={2}>
      <StyledHowItWorksSection id="how-it-works">
        <SectionContent>
          <DemoPanel data-aos="zoom-in">
            <DemoPanelBlob />
            <DemoPanelGrid>
              <div>
                <DemoBadge>Cara Kerja</DemoBadge>
                <DemoTitle>Belajar kedokteran, dibuat semudah main game</DemoTitle>
                <DemoSubtitle>
                  Tonton demo singkat dan lihat bagaimana MedPal menemanimu dari materi sampai simulasi pasien.
                </DemoSubtitle>

                <DemoSteps>
                  {STEPS.map((step, i) => (
                    <DemoStep key={i}>
                      <DemoStepNumber>{i + 1}</DemoStepNumber>
                      <DemoStepText>{step}</DemoStepText>
                    </DemoStep>
                  ))}
                </DemoSteps>
              </div>

              <DemoVideoWrap onClick={() => videoId && setPlaying(true)}>
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
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        alt="MedPal Demo"
                      />
                    )}
                    <DemoPlayButton>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </DemoPlayButton>
                  </>
                )}
              </DemoVideoWrap>
            </DemoPanelGrid>
          </DemoPanel>
        </SectionContent>
      </StyledHowItWorksSection>
    </Parallax>
  )
}
