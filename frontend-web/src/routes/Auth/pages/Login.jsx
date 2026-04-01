import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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
import { fetchPublicConstants } from '@store/constant/userAction'

const LOGIN_CONSTANT_KEYS = [
  'home_hero_badge',
  'home_hero_subtitle',
  'home_hero_slides',
  'login_signin_title',
  'login_signin_subtitle',
]

const DEFAULT_FEATURES = [
  { icon: '📚', title: '18.000+ Flashcards' },
  { icon: '📝', title: '20.000+ Soal UKMPPD' },
  { icon: '🤖', title: 'Simulasi OSCE AI' },
  { icon: '🧮', title: 'Medical Calculator' },
]

function parseFeatures(value) {
  if (!value) return null
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null
  } catch {
    return null
  }
}

export function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const constants = useSelector(state => state.constant.constants)

  useEffect(() => {
    dispatch(fetchPublicConstants(LOGIN_CONSTANT_KEYS))
  }, [dispatch])

  const handleGoogleSuccess = async (credentialResponse) => {
    const onSuccess = () => {
        navigate('/dashboard')
    }

    await dispatch(login(credentialResponse.credential, onSuccess))
  }

  const handleGoogleError = () => {
    console.error('Google login failed')
  }

  const tagline = constants.home_hero_badge || 'Platform Belajar Kedokteran Berbasis AI'
  const description = constants.home_hero_subtitle || '18.000+ flashcards, 20.000+ soal UKMPPD, simulasi OSCE AI, dan medical calculator — semua dalam satu platform.'
  const features = parseFeatures(constants.home_hero_slides) || DEFAULT_FEATURES
  const signinTitle = constants.login_signin_title || 'Selamat Datang Kembali'
  const signinSubtitle = constants.login_signin_subtitle || 'Masuk untuk mengakses platform pembelajaran kedokteran berbasis AI'

  return (
    <LoginContainer>
      {/* Back Button - Always visible across all screen sizes */}
      <BackButton to="/">
        ← Kembali
      </BackButton>

      {/* Left Panel - Branding & Features */}
      <LeftPanel>
        <BrandSection>
          <LogoText>
            <LogoIcon>
              <img src="/icon.png" alt="MedPal Logo" style={{ height: '60px' }} />
            </LogoIcon>
          </LogoText>
          <Tagline>{tagline}</Tagline>
          <Description>{description}</Description>
        </BrandSection>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title || feature.label}</FeatureTitle>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </LeftPanel>

      {/* Right Panel - Sign In Form */}
      <RightPanel>
        <MobileLogo>
          <MobileLogoIcon>
            <img src="/icon.jpg" alt="MedPal Logo" style={{ height: '60px' }} />
          </MobileLogoIcon>
          <MobileLogoText>MedPal</MobileLogoText>
          <MobileTagline>{tagline}</MobileTagline>
        </MobileLogo>

        <SignInCard>
          <SignInHeader>
            <SignInTitle>{signinTitle}</SignInTitle>
            <SignInSubtitle>{signinSubtitle}</SignInSubtitle>
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
