import { Parallax } from 'react-scroll-parallax'
import {
  HowItWorksSection as StyledHowItWorksSection,
  SectionContent,
  SectionHeader,
  SectionBadge,
  SectionTitle,
  SectionSubtitle,
} from '../Home.styles'

export default function HowItWorksSection() {
  return (
    <Parallax speed={2}>
      <StyledHowItWorksSection id="how-it-works">
        <SectionContent>
          <SectionHeader data-aos="fade-up">
            <SectionBadge>🎬 Lihat Demo</SectionBadge>
            <SectionTitle>Cara Kerja MedPal</SectionTitle>
            <SectionSubtitle>
              Tonton video demo untuk melihat bagaimana MedPal dapat membantu pembelajaran Anda
            </SectionSubtitle>
          </SectionHeader>

          <Parallax speed={-1}>
            <div
              data-aos="zoom-in"
              data-aos-delay="200"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(107, 185, 232, 0.2)'
              }}
            >
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                  title="MedPal Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px'
                  }}
                />
              </div>
            </div>
          </Parallax>
        </SectionContent>
      </StyledHowItWorksSection>
    </Parallax>
  )
}
