import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from '@config/colors';

export const GlobalStyles = createGlobalStyle`
  html, body {
    overflow-x: hidden;
  }
  body, button, input, textarea, select {
    font-family: 'Baloo 2', 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
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
  overflow: hidden;
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

export const NavCtaGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavCtaSecondary = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9375rem;
  color: ${colors.primary.dark};
  background: white;
  border: 1.5px solid #e5e7eb;
  box-shadow: 0 4px 0 #e5e7eb;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${colors.primary.main};
    background: rgba(107, 185, 232, 0.06);
    transform: translateY(2px);
    box-shadow: 0 2px 0 #e5e7eb;
  }
`;

export const NavCtaPrimary = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9375rem;
  color: white;
  background: linear-gradient(180deg, ${colors.secondary.light} 0%, ${colors.secondary.main} 100%);
  box-shadow: 0 5px 0 ${colors.secondary.dark};
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    transform: translateY(2px);
    box-shadow: 0 3px 0 ${colors.secondary.dark};
  }

  &:active {
    transform: translateY(5px);
    box-shadow: 0 0 0 ${colors.secondary.dark};
  }
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
  background: #ffffff;
  padding: 0.5rem 1.25rem 0.5rem 0.625rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid #eef2f6;
  animation: slideInDown 0.6s ease-out;
  color: ${colors.primary.dark};
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);

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

export const BadgeIcon = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9375rem;
  background: linear-gradient(135deg, ${colors.gradient.light1} 0%, ${colors.gradient.light2} 100%);
  flex-shrink: 0;
`;

export const HeroTitle = styled.h1`
  font-size: 3rem;
  line-height: 1.15;
  font-weight: 800;
  margin-bottom: 1.5rem;
  animation: slideInLeft 0.8s ease-out 0.2s both;
  color: ${colors.text.primary};
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

export const HeroTitleGradientText = styled.span`
  background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const HeroTitleHighlight = styled.span`
  color: ${props => props.$color === 'green' ? colors.secondary.dark : colors.primary.dark};
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

export const HeroStats = styled.div`
  display: flex;
  gap: 2.5rem;
  margin-top: 2.5rem;
  animation: slideInLeft 0.8s ease-out 0.7s both;
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    gap: 1.5rem;
    flex-wrap: wrap;
  }
`;

export const HeroStatItem = styled.div``;

export const HeroStatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${colors.primary.dark};
  line-height: 1.2;
`;

export const HeroStatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.125rem;
`;

// Hero CTA buttons — solid green primary + neutral outline secondary
export const HeroCtaPrimary = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  min-height: 44px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  text-decoration: none;
  text-align: center;
  color: white;
  background: linear-gradient(180deg, ${colors.secondary.light} 0%, ${colors.secondary.main} 100%);
  box-shadow: 0 7px 0 ${colors.secondary.dark};
  transition: all 0.15s ease;

  &:hover {
    transform: translateY(2px);
    box-shadow: 0 5px 0 ${colors.secondary.dark};
  }

  &:active {
    transform: translateY(7px);
    box-shadow: 0 0 0 ${colors.secondary.dark};
  }
`;

export const HeroCtaSecondary = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  min-height: 44px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  background: white;
  color: ${colors.text.primary};
  border: 1.5px solid #e5e7eb;
  box-shadow: 0 7px 0 #e5e7eb;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${colors.primary.main};
    color: ${colors.primary.dark};
    transform: translateY(2px);
    box-shadow: 0 5px 0 #e5e7eb;
  }

  &:active {
    transform: translateY(7px);
    box-shadow: 0 0 0 #e5e7eb;
  }
`;

export const HeroVisual = styled.div`
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    display: none;
  }
`;

// Hero leaderboard visual
export const LeaderboardCard = styled.div`
  position: relative;
  background: white;
  border-radius: 28px;
  border: 2px solid ${colors.primary.main};
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.1), 0 4px 12px rgba(15, 23, 42, 0.05);
  padding: 1.75rem;
  max-width: 380px;
  margin: 0 auto;
  animation: floatCard 4s ease-in-out infinite;

  @keyframes floatCard {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

export const LeaderboardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

export const LeaderboardTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.text.primary};
`;

export const WeeklyBadge = styled.span`
  background: #fef3c7;
  color: #d97706;
  padding: 0.3125rem 0.875rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
`;

export const LeaderboardCrown = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.secondary.light} 0%, ${colors.secondary.dark} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 20px rgba(141, 198, 63, 0.4);
`;

export const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const LeaderboardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  border-radius: 14px;
  background: ${props => props.$highlight ? 'rgba(107, 185, 232, 0.08)' : 'transparent'};
  border: 1.5px solid ${props => props.$highlight ? 'rgba(74, 158, 212, 0.3)' : 'transparent'};
`;

export const RowAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${props => props.$color || colors.gradient.light1};
`;

export const RowInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const RowName = styled.div`
  font-weight: 700;
  font-size: 0.9375rem;
  color: ${colors.text.primary};
`;

export const RowMeta = styled.div`
  font-size: 0.8125rem;
  color: #9ca3af;
`;

export const RowScore = styled.div`
  font-weight: 700;
  font-size: 0.9375rem;
  color: ${colors.secondary.dark};
  white-space: nowrap;
`;

export const StreakBadge = styled.div`
  position: absolute;
  top: -2.5rem;
  right: -2.25rem;
  background: white;
  border-radius: 18px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
  padding: 0.875rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: floatBadge 3.5s ease-in-out infinite;

  @media (max-width: 1100px) {
    right: 0.5rem;
  }

  @keyframes floatBadge {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
`;

export const StreakIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff1e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

export const StreakValue = styled.div`
  font-weight: 800;
  font-size: 1.0625rem;
  color: ${colors.text.primary};
  line-height: 1.2;
`;

export const StreakLabel = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
`;

// Hero Browser Mockup
export const HeroBrowserMockup = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow:
    0 32px 72px rgba(0, 0, 0, 0.1),
    0 8px 24px rgba(107, 185, 232, 0.12);
  overflow: hidden;
  width: 100%;
`;

export const HeroBrowserBar = styled.div`
  background: #f3f4f6;
  padding: 0.625rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const HeroBrowserDots = styled.div`
  display: flex;
  gap: 0.375rem;
`;

export const HeroBrowserDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

export const HeroBrowserUrl = styled.div`
  flex: 1;
  background: white;
  border-radius: 6px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;
  border: 1px solid #e5e7eb;
  font-family: monospace;
`;

export const HeroBrowserContent = styled.div`
  height: 340px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f0f7ff 0%, #eef5fc 100%);
`;

export const HeroFeatureSlide = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: ${props => props.$active ? 1 : 0};
  transform: ${props => props.$active ? 'translateY(0)' : 'translateY(16px)'};
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: ${props => props.$active ? 'auto' : 'none'};
`;

export const HeroSlideIcon = styled.div`
  font-size: 4.5rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 16px rgba(107, 185, 232, 0.3));
`;

export const HeroSlideLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(107, 185, 232, 0.1);
  color: ${colors.primary.main};
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  border: 1px solid rgba(107, 185, 232, 0.2);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const HeroSlideTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.primary.dark};
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const HeroSlideDesc = styled.div`
  font-size: 0.9375rem;
  color: #6b7280;
  text-align: center;
  max-width: 320px;
  line-height: 1.6;
`;

export const HeroSlideIndicators = styled.div`
  display: flex;
  gap: 0.375rem;
  justify-content: center;
  padding: 0.875rem;
  background: white;
  border-top: 1px solid #f3f4f6;
`;

export const HeroSlideIndicator = styled.div`
  height: 6px;
  width: ${props => props.$active ? '22px' : '6px'};
  border-radius: 99px;
  background: ${props => props.$active
    ? `linear-gradient(90deg, ${colors.gradient.start}, ${colors.gradient.end})`
    : '#e5e7eb'};
  transition: all 0.35s ease;
  cursor: pointer;
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
  background: ${colors.success.lighter};
  color: ${colors.secondary.dark};
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
  border: 1px solid rgba(141, 198, 63, 0.25);
`;

export const SectionTitle = styled.h2`
  font-size: 2.75rem;
  font-weight: 800;
  color: ${colors.text.primary};
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
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  will-change: transform;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const FeatureCard = styled.div`
  background: white;
  border: 1.5px solid #eef1f5;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 6px 0 #eef1f5;
  cursor: pointer;
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;

  &:hover {
    border-color: ${colors.primary.main};
    transform: translateY(2px);
    box-shadow: 0 4px 0 #dbe9f5;
  }

  &:active {
    border-color: ${colors.primary.main};
    transform: translateY(6px);
    box-shadow: 0 0 0 #dbe9f5;
  }
`;

export const FeatureIcon = styled.div`
  width: 52px;
  height: 52px;
  background: ${props => props.$bg || 'rgba(107, 185, 232, 0.15)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.25rem;
  transition: all 0.3s ease;
`;

export const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin-bottom: 0.5rem;
`;

export const FeatureDescription = styled.p`
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
`;

// Slideshow keyframes
const slideInFromRight = keyframes`
  from { opacity: 0; transform: translateX(36px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const slideInFromLeft = keyframes`
  from { opacity: 0; transform: translateX(-36px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const fillProgress = keyframes`
  from { width: 0%; }
  to   { width: 100%; }
`;

export const SlideCard = styled.div`
  background: white;
  border-radius: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.07), 0 2px 8px rgba(107, 185, 232, 0.06);
  overflow: hidden;
`;

export const SlideTopBar = styled.div`
  height: 3px;
  background: #f3f4f6;
  overflow: hidden;
`;

export const SlideProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${colors.gradient.start}, ${colors.gradient.end});
  animation: ${fillProgress} ${props => (props.$duration || 5000) / 1000}s linear forwards;
  animation-play-state: ${props => props.$paused ? 'paused' : 'running'};
`;

export const SlideInner = styled.div`
  display: flex;
  align-items: stretch;
  animation: ${props => props.$dir === 'left' ? slideInFromLeft : slideInFromRight} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

export const SlideLeft = styled.div`
  flex: 1;
  min-width: 0;
  padding: 2.75rem 3rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: 1px solid #f3f4f6;

  @media (max-width: 968px) {
    border-right: none;
    border-bottom: 1px solid #f3f4f6;
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

export const SlideNumber = styled.div`
  font-size: 8rem;
  font-weight: 900;
  line-height: 1;
  color: rgba(107, 185, 232, 0.07);
  position: absolute;
  top: 1.25rem;
  right: 1.75rem;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  user-select: none;
  letter-spacing: -0.04em;

  @media (max-width: 480px) {
    font-size: 5.5rem;
    top: 0.75rem;
    right: 1rem;
  }
`;

export const SlideRight = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;

  @media (max-width: 968px) {
    width: 100%;
    flex: none;
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

export const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  width: 100%;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

export const SlideDecoration = styled.div`
  width: 100%;
  min-height: 240px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(107, 185, 232, 0.06) 0%, rgba(141, 198, 63, 0.06) 100%);
  border: 2px dashed rgba(107, 185, 232, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  @media (max-width: 968px) {
    min-height: 160px;
  }
`;

export const SlideDecorationIcon = styled.div`
  font-size: 5.5rem;
  filter: drop-shadow(0 4px 20px rgba(107, 185, 232, 0.25));

  @media (max-width: 480px) {
    font-size: 4rem;
  }
`;

export const SlideFeatureIcon = styled.div`
  width: 68px;
  height: 68px;
  background: linear-gradient(135deg, rgba(107, 185, 232, 0.15) 0%, rgba(141, 198, 63, 0.12) 100%);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.125rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 16px rgba(107, 185, 232, 0.18);
  border: 1px solid rgba(107, 185, 232, 0.18);

  @media (max-width: 480px) {
    width: 56px;
    height: 56px;
    font-size: 1.75rem;
    margin-bottom: 1rem;
    border-radius: 14px;
  }
`;

export const SlideFeatureName = styled.h3`
  font-size: 1.625rem;
  font-weight: 700;
  color: ${colors.primary.dark};
  margin-bottom: 0.875rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.375rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const SlideFeatureDescription = styled.p`
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 1.25rem;
  max-width: 480px;

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }
`;

export const SlideAccessBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(107, 185, 232, 0.08);
  color: ${colors.primary.dark};
  padding: 0.375rem 0.875rem;
  border-radius: 50px;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid rgba(107, 185, 232, 0.2);
`;

export const SlideNavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 2rem;
  border-top: 1px solid #f3f4f6;

  @media (max-width: 480px) {
    padding: 0.875rem 1.5rem;
  }
`;

export const SlideCounter = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
`;

export const NavArrow = styled.button`
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.125rem;
  color: ${colors.primary.dark};
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${colors.primary.main};
    color: white;
    border-color: ${colors.primary.main};
    box-shadow: 0 2px 12px rgba(107, 185, 232, 0.4);
    transform: scale(1.06);
  }

  &:active {
    transform: scale(0.96);
  }
`;

/* Scroll container — plain block, not flex */
export const FeatureTabsScroller = styled.div`
  overflow-x: auto;
  width: 100%;
  margin-top: 1.25rem;
  padding-bottom: 6px;
  scrollbar-width: thin;
  scrollbar-color: rgba(107, 185, 232, 0.4) transparent;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(107, 185, 232, 0.4);
    border-radius: 99px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(107, 185, 232, 0.7);
  }

  @media (max-width: 480px) {
    margin-top: 1rem;
  }
`;

/* Inner flex row — sized by content so it overflows the scroller */
export const FeatureTabsRow = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 0.5rem;

  @media (max-width: 480px) {
    gap: 0.375rem;
  }
`;

export const FeatureTab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4375rem 0.875rem;
  border-radius: 50px;
  border: 1.5px solid ${props => props.$active ? colors.primary.main : '#e5e7eb'};
  background: ${props => props.$active ? 'rgba(107, 185, 232, 0.1)' : 'white'};
  color: ${props => props.$active ? colors.primary.dark : '#6b7280'};
  font-size: 0.8125rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    border-color: ${colors.primary.main};
    color: ${colors.primary.dark};
    background: rgba(107, 185, 232, 0.07);
  }
`;

export const FeatureTabIcon = styled.span`
  font-size: 1rem;
  line-height: 1;
`;

export const FeatureTabName = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

// FAQ Section
export const FAQSection = styled.section`
  padding: 6rem 2rem;
  background: transparent;
  position: relative;
  will-change: transform;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

export const FAQList = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

export const FAQItem = styled.div`
  background: white;
  border: 1.5px solid ${props => props.$open ? colors.primary.main : '#eef1f5'};
  border-radius: 20px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: ${props => props.$open
    ? `0 4px 0 ${colors.primary.light}`
    : '0 4px 0 #eef1f5'};
`;

export const FAQQuestion = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.text.primary};
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.primary.main};
  }

  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
    font-size: 0.9375rem;
  }
`;

export const FAQIcon = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$open ? colors.primary.main : 'rgba(107, 185, 232, 0.12)'};
  color: ${props => props.$open ? 'white' : colors.primary.dark};
  transition: background 0.25s ease, color 0.25s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.$open ? 'rotate(45deg)' : 'rotate(0deg)'};

  svg {
    width: 14px;
    height: 14px;
    display: block;
  }
`;

export const FAQAnswer = styled.div`
  max-height: ${props => props.$open ? '400px' : '0'};
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const FAQAnswerInner = styled.div`
  padding: 0 1.5rem 1.25rem;
  font-size: 0.9375rem;
  color: #4b5563;
  line-height: 1.75;

  @media (max-width: 480px) {
    padding: 0 1.25rem 1rem;
  }
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

// Demo / Cara Kerja panel
export const DemoPanel = styled.div`
  position: relative;
  background: linear-gradient(135deg, #1B5E7A 0%, #12876F 100%);
  border-radius: 32px;
  padding: 3.5rem;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(15, 60, 80, 0.25);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 24px;
  }
`;

export const DemoPanelBlob = styled.div`
  position: absolute;
  bottom: -80px;
  right: -60px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  pointer-events: none;
`;

export const DemoPanelGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const DemoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.4375rem 1rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.16);
  color: white;
  font-size: 0.8125rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
`;

export const DemoTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const DemoSubtitle = styled.p`
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 420px;
`;

export const DemoSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
`;

export const DemoStep = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
`;

export const DemoStepNumber = styled.div`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${colors.warning.main};
  color: white;
  font-weight: 800;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DemoStepText = styled.div`
  color: white;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.4;
  padding-top: 0.25rem;
`;

export const DemoVideoWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 20px;
  border: 3px solid rgba(255, 255, 255, 0.9);
  overflow: hidden;
  cursor: pointer;
  background: linear-gradient(135deg, ${colors.secondary.light} 0%, ${colors.primary.main} 100%);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

export const DemoPlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.08);
  }

  svg {
    width: 22px;
    height: 22px;
    color: ${colors.primary.dark};
    margin-left: 3px;
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

export const CTAPanel = styled.div`
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  background: linear-gradient(135deg, #12876F 0%, #1B5E7A 100%);
  border-radius: 32px;
  padding: 4rem 3rem;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(15, 60, 80, 0.25);

  @media (max-width: 768px) {
    padding: 2.75rem 1.75rem;
    border-radius: 24px;
  }
`;

export const CTAPanelBlob = styled.div`
  position: absolute;
  top: -60px;
  left: -60px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  pointer-events: none;
`;

export const CTAContent = styled.div`
  max-width: 640px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

export const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.875rem;
  }
`;

export const CTASubtitle = styled.p`
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

// Footer
export const Footer = styled.footer`
  padding: 1.5rem 2rem;
  background: ${colors.neutral.gray900};
  color: ${colors.neutral.gray300};
`;

export const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
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

// Connect / Social Section
export const ConnectSection = styled.section`
  padding: 5rem 2rem 6rem;
  position: relative;
`;


export const ConnectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-width: 620px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 320px;
  }
`;

export const ConnectCard = styled.a`
  background: white;
  border-radius: 18px;
  padding: 1.5rem 1.25rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  border: 1.5px solid #eef1f5;
  box-shadow: 0 5px 0 #eef1f5;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(2px);
    box-shadow: 0 4px 0 #dbe9f5;
    border-color: ${colors.primary.main};
  }
`;

export const ConnectCardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${props => props.$bg || 'rgba(107, 185, 232, 0.15)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.875rem;
  font-size: 1.375rem;
`;

export const ConnectCardPlatform = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin-bottom: 0.25rem;
`;

export const ConnectCardHandle = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #6b7280;
`;

export const ConnectCardDesc = styled.div`
  font-size: 0.8125rem;
  color: #9ca3af;
  margin-bottom: 1.5rem;
`;

export const ConnectCardBtn = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(180deg, ${colors.secondary.light} 0%, ${colors.secondary.main} 100%);
  color: white;
  padding: 0.5rem 1.375rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 3px 0 ${colors.secondary.dark};
`;

export const ConnectCopyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  font-size: 0.875rem;
  color: #9ca3af;
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
  gap: 0.625rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const PricingTab = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.375rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  ${props => props.$active ? `
    background: ${colors.text.primary};
    color: white;
    border: 1.5px solid ${colors.text.primary};
  ` : `
    background: white;
    color: ${colors.text.primary};
    border: 1.5px solid #e5e7eb;

    &:hover {
      border-color: ${colors.primary.main};
      color: ${colors.primary.dark};
    }
  `}
`;

export const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 320px));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  justify-content: center;
  align-items: stretch;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const PricingCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  border: 2px solid ${props => props.$isPopular ? colors.secondary.main : '#e5e7eb'};
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: ${props => props.$isPopular ? `0 6px 0 ${colors.secondary.light}` : '0 6px 0 #eef1f5'};
  width: 100%;

  &:hover {
    transform: translateY(2px);
    box-shadow: ${props => props.$isPopular ? `0 4px 0 ${colors.secondary.light}` : '0 4px 0 #eef1f5'};
  }
`;

export const PopularBadge = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: ${colors.warning.main};
  color: white;
  padding: 0.375rem 1.125rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2px;
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.35);
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.375rem;
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

export const PricingDescription = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.5;

  p { margin: 0; }
  ul, ol { text-align: left; margin: 0.25rem 0; padding-left: 1.25rem; }
  li { margin: 0.125rem 0; }
  strong { font-weight: 600; color: #374151; }
`;

export const DiscountBadge = styled.span`
  background: #FEF3C7;
  color: #D97706;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;
