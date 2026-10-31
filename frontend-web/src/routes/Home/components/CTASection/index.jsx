import { useNavigate } from 'react-router-dom'
import { AuthRoute } from '@routes/Auth/routes'
import ctaDoodle from '@/assets/landing/cta-doodle.png'
import ctaFrameLeft from '@/assets/landing/cta-frame-left.png'
import ctaFrameRight from '@/assets/landing/cta-frame-right.png'
import ctaCapybara from '@/assets/landing/cta-capybara-tablet.png'
import { ContentWidth } from '../../Home.styles'
import {
  SectionWrapper,
  Banner,
  Decoration,
  DoodleLeftFrame,
  DoodleLeftImage,
  DoodleRightFrame,
  DoodleRightImage,
  FrameLeft,
  FrameRight,
  BannerMascot,
  BannerContent,
  Eyebrow,
  Heading,
  Description,
  BannerButton,
} from './CTASection.styles'

function CTASection() {
  const navigate = useNavigate()

  return (
    <SectionWrapper>
      <ContentWidth>
        <Banner>
          <Decoration aria-hidden="true">
            <FrameLeft src={ctaFrameLeft} alt="" />
            <DoodleLeftFrame>
              <DoodleLeftImage src={ctaDoodle} alt="" />
            </DoodleLeftFrame>
            <DoodleRightFrame>
              <DoodleRightImage src={ctaDoodle} alt="" />
            </DoodleRightFrame>
            <FrameRight src={ctaFrameRight} alt="" />
          </Decoration>

          <BannerMascot src={ctaCapybara} alt="" aria-hidden="true" />

          <BannerContent>
            <Eyebrow>Mulai dari sini</Eyebrow>
            <Heading>
              Siap belajar kedokteran
              <br />
              dengan lebih terarah?
            </Heading>
            <Description>
              Mulai belajar bersama MedPal dan akses materi, anatomi, quiz, flashcard,
              serta berbagai fitur pendukung dalam satu platform.
            </Description>
            <BannerButton onClick={() => navigate(AuthRoute.signInRoute)}>
              Mulai Sekarang →
            </BannerButton>
          </BannerContent>
        </Banner>
      </ContentWidth>
    </SectionWrapper>
  )
}

export default CTASection
