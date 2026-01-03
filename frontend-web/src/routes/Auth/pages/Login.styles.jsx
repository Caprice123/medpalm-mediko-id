import { Link } from 'react-router-dom';
import { colors } from '@config/colors';
import styled from 'styled-components';

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: ${colors.background.default};

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`

export const LeftPanel = styled.div`
  background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  color: white;

  @media (max-width: 968px) {
    padding: 5rem 2rem 2rem;
    min-height: auto;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

export const BackButton = styled(Link)`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.625rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(-4px);
  }

  @media (max-width: 968px) {
    font-size: 0.85rem;
    padding: 0.5rem 0.875rem;
    top: 1rem;
    left: 1rem;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 2.5rem;
    left: 1rem;
  }
`

export const BrandSection = styled.div`
  margin-bottom: 3rem;
`

export const LogoText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  font-weight: 700;

  @media (max-width: 968px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`

export const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));

  img {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    padding: 6px;
  }
`

export const Tagline = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;

  @media (max-width: 968px) {
    font-size: 2rem;
  }
`

export const Description = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.6;
`

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 968px) {
    gap: 1rem;
    margin-bottom: 2rem;
  }
`

export const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

export const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 0.75rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`

export const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
`

export const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 968px) {
    gap: 1.5rem;
  }
`

export const StatItem = styled.div`
  text-align: center;
`

export const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, ${colors.gradient.light1} 0%, ${colors.gradient.light2} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.85;
`

export const RightPanel = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
  position: relative;

  @media (max-width: 968px) {
    padding: 2rem 1.5rem;
  }

  @media (max-width: 768px) {
    background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
    min-height: 100vh;
    padding: 2rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`

export const MobileLogo = styled.div`
  display: none;
  text-align: center;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    display: block;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    margin-top: 1rem;
  }
`

export const MobileLogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  filter: drop-shadow(0 4px 12px rgba(107, 185, 232, 0.3));

  img {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 8px;
  }
`

export const MobileLogoText = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`

export const MobileTagline = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: white;
  line-height: 1.5;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  opacity: 0.95;
`

export const SignInCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(107, 185, 232, 0.15);
  border: 1px solid ${colors.neutral.gray200};

  @media (max-width: 768px) {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
  }
`

export const SignInHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

export const SignInTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`

export const SignInSubtitle = styled.p`
  font-size: 1rem;
  color: ${colors.text.secondary};
`

export const GoogleButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  width: 100%;

  > div {
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
    max-width: 400px;
  }

  @media (max-width: 480px) {
    margin-top: 1.5rem;
  }
`

export const ErrorMessage = styled.div`
  background: ${colors.error.light}20;
  color: ${colors.error.dark};
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  border: 1px solid ${colors.error.light};
  text-align: center;
`

export const Divider = styled.div`
  text-align: center;
  margin: 2rem 0;
  color: ${colors.text.secondary};
  font-size: 0.875rem;
  position: relative;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 45%;
    height: 1px;
    z-index: 1;
    background: ${colors.neutral.gray300};
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    width: 45%;
    height: 1px;
    z-index: 1;
    background: ${colors.neutral.gray300};
  }
`