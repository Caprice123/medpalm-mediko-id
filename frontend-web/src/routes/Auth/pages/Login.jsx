import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { GoogleLogin } from '@react-oauth/google'
import {
  BrandSection,
  LeftPanel,
  LoginContainer,
  LogoIcon,
  LogoText,
  Tagline,
  Description,
  FeaturesGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  BackButton,
  RightPanel,
  MobileLogo,
  MobileLogoIcon,
  MobileLogoText,
  MobileTagline,
  SignInCard,
  SignInHeader,
  SignInTitle,
  SignInSubtitle,
  GoogleButtonWrapper,
  Divider,
  StatsSection,
  StatItem,
  StatValue,
  StatLabel
} from './Login.styles'
import { login } from '@store/auth/action'

export function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleGoogleSuccess = async (credentialResponse) => {
    const onSuccess = () => {
        navigate('/dashboard')
    }

    await dispatch(login(credentialResponse.credential, onSuccess))
  }

  const handleGoogleError = () => {
    console.error('Google login failed')
  }

  return (
    <LoginContainer>
      {/* Back Button - Always visible across all screen sizes */}
      <BackButton to="/">
        ← Kembali ke Beranda
      </BackButton>

      {/* Left Panel - Branding & Features */}
      <LeftPanel>
        <BrandSection>
          <LogoText>
            <LogoIcon>
              <img src="/icon.png" alt="MedPalm Logo" style={{ height: '60px' }} />
            </LogoIcon>
          </LogoText>
          <Tagline>Platform Belajar Kedokteran Berbasis AI</Tagline>
          <Description>
            18.000+ flashcards, 20.000+ soal UKMPPD, simulasi OSCE AI, dan medical calculator — semua dalam satu platform.
          </Description>
        </BrandSection>

        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>📚</FeatureIcon>
            <FeatureTitle>18.000+ Flashcards</FeatureTitle>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📝</FeatureIcon>
            <FeatureTitle>20.000+ Soal UKMPPD</FeatureTitle>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>Simulasi OSCE AI</FeatureTitle>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🧮</FeatureIcon>
            <FeatureTitle>Medical Calculator</FeatureTitle>
          </FeatureCard>
        </FeaturesGrid>
      </LeftPanel>

      {/* Right Panel - Sign In Form */}
      <RightPanel>
        <MobileLogo>
          <MobileLogoIcon>
            <img src="/icon.jpg" alt="MedPalm Logo" style={{ height: '60px' }} />
          </MobileLogoIcon>
          <MobileLogoText>MedPal</MobileLogoText>
          <MobileTagline>Platform Belajar Kedokteran Berbasis AI</MobileTagline>
        </MobileLogo>

        <SignInCard>
          <SignInHeader>
            <SignInTitle>Selamat Datang Kembali</SignInTitle>
            <SignInSubtitle>
              Masuk untuk mengakses platform pembelajaran kedokteran berbasis AI
            </SignInSubtitle>
          </SignInHeader>

          <GoogleButtonWrapper>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
            />
          </GoogleButtonWrapper>
        </SignInCard>
      </RightPanel>
    </LoginContainer>
  )
}

export default Login
