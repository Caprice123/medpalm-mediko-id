import { Parallax } from 'react-scroll-parallax'
import { LinkButton } from '../Home.styles'
import {
  CTASection as StyledCTASection,
  CTAContent,
  CTATitle,
  CTASubtitle,
} from '../Home.styles'

export default function CTASection() {
  return (
    <Parallax speed={2}>
      <StyledCTASection>
        <CTAContent>
          <CTATitle data-aos="fade-up">
            Siap menjadi #topmedstud?
          </CTATitle>
          <CTASubtitle data-aos="fade-up" data-aos-delay="100">
            Bergabung dengan ribuan mahasiswa kedokteran lainnya.
            Ayo belajar efektif bersama Medpal!
          </CTASubtitle>
          <div data-aos="zoom-in" data-aos-delay="200">
            <LinkButton
              to="/sign-in"
              variant="primary"
              size="large"
              style={{
                fontSize: '1.25rem',
                padding: '1.25rem 3rem',
                borderRadius: '12px'
              }}
            >
              Mulai Belajar Sekarang
            </LinkButton>
          </div>
        </CTAContent>
      </StyledCTASection>
    </Parallax>
  )
}
