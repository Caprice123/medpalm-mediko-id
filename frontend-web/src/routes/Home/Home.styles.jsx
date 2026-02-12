import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from '@config/colors';

export const GlobalStyles = createGlobalStyle`
  .mobile-menu-btn {
    @media (max-width: 768px) {
      display: block !important;
    }
  }
`;

export const LandingContainer = styled.div`
  min-height: 100vh;
  background: #F8FAFC;
  position: relative;
  overflow-x: hidden;
`;

// Navigation
export const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(248, 250, 252, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(25, 118, 210, 0.15);
  padding: 1rem 2rem;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

export const NavContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.primary.main};
  cursor: pointer;
`;

export const LogoIcon = styled.div`
  font-size: 2rem;
  display: flex;
  align-items: center;
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

export const NavLink = styled.a`
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: ${colors.primary.main};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// LinkButton - wraps Link with Button styling
export const LinkButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: ${props => props.size === 'small' ? '0.5rem 0.875rem' :
                      props.size === 'large' ? '0.875rem 1.75rem' :
                      '0.625rem 1.25rem'};
  min-height: ${props => props.size === 'small' ? '36px' : '44px'};
  border-radius: 8px;
  font-weight: 600;
  font-size: ${props => props.size === 'small' ? '0.75rem' : '1rem'};
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(25, 118, 210, 0.4);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 172, 193, 0.5);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
    }
  ` : props.variant === 'outline' ? `
    background: transparent;
    color: ${colors.primary.main};
    border: 2px solid ${colors.primary.main};

    &:hover {
      background: ${colors.primary.main};
      color: white;
      transform: translateY(-2px);
    }

    &:active {
      background: ${colors.primary.dark};
      color: white;
      transform: translateY(0);
    }
  ` : `
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover {
      background: #f9fafb;
    }

    &:active {
      background: #f3f4f6;
    }
  `}

  ${props => props.fullWidth && `
    width: 100%;
    display: flex;
  `}

  &.nav-cta {
    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    font-size: ${props => props.size === 'small' ? '0.8125rem' : '0.9375rem'};
  }
`;

// Mobile Menu
export const MobileMenuOverlay = styled.div`
  display: none;
`;

export const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  padding: 0 2rem;
  z-index: 999;
  opacity: ${props => props.isOpen ? '1' : '0'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  overflow-y: auto;

  @media (min-width: 769px) {
    display: none;
  }
`;

export const MobileNavLink = styled.div`
  padding: 1.5rem 0;
  color: #374151;
  font-weight: 600;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 1px solid #f3f4f6;
  text-align: center;

  &:hover {
    color: ${colors.primary.main};
    background: rgba(107, 185, 232, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

// Hero Section
export const HeroSection = styled.section`
  padding: 8rem 2rem 6rem;
  background: transparent;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 6rem 1.5rem 4rem;
  }
`;

export const HeroContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
  will-change: transform;
  padding-bottom: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
`;

export const HeroText = styled.div`
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    text-align: center;
  }
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(107, 185, 232, 0.1);
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(107, 185, 232, 0.25);
  animation: slideInDown 0.6s ease-out;
  color: ${colors.primary.dark};
  box-shadow: 0 2px 8px rgba(107, 185, 232, 0.15);

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  animation: slideInLeft 0.8s ease-out 0.2s both;
  background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 968px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  animation: slideInLeft 0.8s ease-out 0.4s both;
  color: #374151;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

export const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  animation: slideInLeft 0.8s ease-out 0.6s both;
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;

    button, a {
      width: 100%;
    }
  }
`;

export const HeroVisual = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 968px) {
    display: none;
  }
`;

export const FeaturePreviewCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  animation: slideInRight 0.8s ease-out both, float 3s ease-in-out infinite;

  &:nth-child(1) {
    animation-delay: 0.2s, 0s;
  }

  &:nth-child(2) {
    animation-delay: 0.4s, 0.5s;
    margin-left: 2rem;
  }

  &:nth-child(3) {
    animation-delay: 0.6s, 1s;
  }

  &:hover {
    border-color: ${colors.primary.main};
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 30px rgba(107, 185, 232, 0.2);
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

export const PreviewIcon = styled.div`
  font-size: 2.5rem;
`;

export const PreviewText = styled.div``;

export const PreviewTitle = styled.div`
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
  color: ${colors.primary.dark};
`;

export const PreviewDescription = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

// Features Section
export const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  background: transparent;
  position: relative;
  will-change: transform;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

export const SectionContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

export const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(107, 185, 232, 0.1);
  color: ${colors.primary.dark};
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border: 1px solid rgba(107, 185, 232, 0.25);
`;

export const SectionTitle = styled.h2`
  font-size: 2.75rem;
  font-weight: 800;
  color: ${colors.primary.dark};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  will-change: transform;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const FeatureIcon = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(107, 185, 232, 0.15) 0%, rgba(141, 198, 63, 0.15) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
`;

export const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.primary.dark};
  margin-bottom: 0.75rem;
`;

export const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
`;

// How It Works Section
export const HowItWorksSection = styled.section`
  padding: 6rem 2rem;
  background: transparent;
  position: relative;
  will-change: transform;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

export const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
  will-change: transform;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const StepCard = styled.div`
  text-align: center;
  position: relative;
  padding: 2rem 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  will-change: transform;

  &:hover {
    background: white;
    border-color: ${colors.primary.main};
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(107, 185, 232, 0.15);
  }

  &:not(:last-child)::after {
    content: '→';
    position: absolute;
    right: -3rem;
    top: 2rem;
    font-size: 2rem;
    color: ${colors.gradient.end};
    animation: pulse 2s ease-in-out infinite;

    @media (max-width: 768px) {
      content: '↓';
      right: auto;
      bottom: -2rem;
      top: auto;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1);
    }
  }
`;

export const StepNumber = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 15px rgba(107, 185, 232, 0.4);
  transition: all 0.3s ease;

  ${StepCard}:hover & {
    transform: scale(1.15);
    box-shadow: 0 6px 25px rgba(141, 198, 63, 0.5);
  }
`;

export const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.primary.dark};
  margin-bottom: 0.75rem;
`;

export const StepDescription = styled.p`
  font-size: 0.938rem;
  color: #6b7280;
  line-height: 1.6;
`;

// Stats Section
export const StatsSection = styled.section`
  padding: 6rem 2rem;
  background: transparent;
  position: relative;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  text-align: center;

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

export const StatCard = styled.div``;

export const StatValue = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 1.125rem;
  color: #6b7280;
`;

// CTA Section
export const CTASection = styled.section`
  padding: 6rem 2rem;
  background: transparent;
  text-align: center;
  position: relative;
  overflow: hidden;
  will-change: transform;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

export const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

export const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  color: ${colors.primary.dark};
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const CTASubtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2.5rem;
  line-height: 1.6;
`;

// Footer
export const Footer = styled.footer`
  padding: 3rem 2rem 2rem;
  background: ${colors.neutral.gray900};
  color: ${colors.neutral.gray300};

  @media (max-width: 768px) {
    padding: 2rem 1.5rem 1.5rem;
  }
`;

export const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const FooterColumn = styled.div``;

export const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #e5e7eb;
  margin-bottom: 1rem;
`;

export const FooterLogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));

  img {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 10px;
    padding: 6px;
  }
`;

export const FooterDescription = styled.p`
  font-size: 0.938rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: #9ca3af;
`;

export const FooterTitle = styled.h4`
  color: #e5e7eb;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const FooterLink = styled.a`
  color: #9ca3af;
  font-size: 0.938rem;
  transition: color 0.3s;
  cursor: pointer;

  &:hover {
    color: ${colors.primary.main};
  }
`;

export const FooterBottom = styled.div`
  padding-top: 2rem;
  border-top: 1px solid #1f2937;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
`;

// Additional UI Elements
export const TrustBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(107, 185, 232, 0.08);
  padding: 0.625rem 1.25rem;
  border-radius: 50px;
  font-size: 0.875rem;
  border: 1px solid rgba(107, 185, 232, 0.2);
  margin-top: 2rem;
  color: #6b7280;
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    margin-top: 1.5rem;
  }
`;

export const TestimonialSection = styled.section`
  padding: 6rem 2rem;
  background: transparent;
  position: relative;
  will-change: transform;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

export const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  will-change: transform;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const TestimonialText = styled.p`
  position: relative;
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  z-index: 1;

  &::before {
    content: '"';
    position: absolute;
    top: -1rem;
    left: -1rem;
    font-size: 3.5rem;
    color: ${colors.gradient.end};
    opacity: 0.1;
    font-family: Georgia, serif;
  }
`;

export const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const AuthorAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
`;

export const AuthorInfo = styled.div``;

export const AuthorName = styled.div`
  font-weight: 600;
  color: ${colors.primary.dark};
  margin-bottom: 0.25rem;
`;

export const AuthorRole = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

// Pricing Section
export const PricingSection = styled.section`
  padding: 6rem 2rem;
  background: transparent;
  position: relative;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

export const PricingFilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 350px));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  justify-content: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const PricingCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  border: 2px solid ${props => props.$isPopular ? colors.primary.main : '#e5e7eb'};
  position: relative;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$isPopular ? '0 10px 40px rgba(107, 185, 232, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.05)'};
  width: 100%;
  max-width: 350px;
  margin: 0 auto;

  ${props => props.$isPopular && `
    transform: scale(1.05);

    @media (max-width: 768px) {
      transform: scale(1);
    }
  `}

  &:hover {
    transform: ${props => props.$isPopular ? 'scale(1.08)' : 'translateY(-4px)'};
    box-shadow: 0 15px 40px rgba(107, 185, 232, 0.25);
    border-color: ${colors.primary.main};

    @media (max-width: 768px) {
      transform: translateY(-4px);
    }
  }
`;

export const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
  color: white;
  padding: 0.375rem 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const PricingName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.primary.dark};
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const PricingCredits = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.3;
`;

export const PricingPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  text-align: center;
  margin-bottom: 1rem;

  span {
    font-size: 0.875rem;
    font-weight: 400;
    color: #6b7280;
  }
`;

export const PricingDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

export const DiscountBadge = styled.span`
  background: #FEF3C7;
  color: #D97706;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;
