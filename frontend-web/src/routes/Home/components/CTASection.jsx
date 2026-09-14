import { Parallax } from 'react-scroll-parallax'
import {
  CTASection as StyledCTASection,
  CTAPanel,
  CTAPanelBlob,
  CTAContent,
  CTATitle,
  CTASubtitle,
  HeroCtaPrimary,
} from '../Home.styles'

export default function CTASection() {
  return (
    <Parallax speed={2}>
      <StyledCTASection>
        <CTAPanel data-aos="zoom-in">
          <CTAPanelBlob />
          <CTAContent>
            <CTATitle>
              Siap menjadi #topmedstud?
            </CTATitle>
            <CTASubtitle>
              Bergabung dengan ribuan mahasiswa kedokteran lainnya. Ayo belajar lebih efektif bersama MedPal!
            </CTASubtitle>
            <HeroCtaPrimary to="/sign-in">
              Mulai Belajar Sekarang
            </HeroCtaPrimary>
          </CTAContent>
        </CTAPanel>
      </StyledCTASection>
    </Parallax>
  )
}
