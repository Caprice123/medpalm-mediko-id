import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from '@config/colors';

export const GlobalStyles = createGlobalStyle`
  html, body {
    overflow-x: hidden;
    scroll-behavior: smooth;
  }
  body, button, input, textarea, select {
    font-family: 'Lexend', 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
  .mobile-menu-btn {
    @media (max-width: 768px) {
      display: block !important;
    }
  }
`;

export const LandingContainer = styled.div`
  min-height: 100vh;
  background: #F7F9FB;
  position: relative;
`;

// Shared page container — used by every section below the hero.
export const SectionContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

// Shared by FeaturesSection, PricingSection, FAQSection and FooterSection (social) headers.
export const SectionHeader = styled.div`
  text-align: center;
  max-width: 760px;
  margin: 0 auto 3.5rem;
  position: relative;
`;

export const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${colors.success.lighter};
  color: ${colors.secondary.dark};
  padding: 0.4375rem 1rem;
  border-radius: 50px;
  font-size: 0.8125rem;
  font-weight: 700;
  border: 1px solid rgba(141, 198, 63, 0.25);
`;

export const SectionTitle = styled.h2`
  font-size: clamp(1.75rem, 4.2vw, 2.875rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: ${colors.text.primary};
  margin: 1.125rem 0 0.875rem;
`;

export const SectionSubtitle = styled.p`
  font-size: 1.0625rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
`;

// Shared CTA buttons — used by HeroSection, CTASection and (via renderButton) PricingSection.
// Mirrors the reference's .btn / .btn-green / .btn-white classes exactly.
export const PillCtaPrimary = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 28px;
  border-radius: 16px;
  font: 600 15px/1 'Lexend', system-ui, sans-serif;
  cursor: pointer;
  border: 0;
  text-decoration: none;
  text-align: center;
  color: white;
  background: linear-gradient(180deg, #9ad14f, #6fae2c);
  box-shadow: 0 5px 0 #5a9423;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 0 #5a9423;
  }

  &:active {
    transform: translateY(3px);
    box-shadow: 0 2px 0 #5a9423;
  }
`;

export const PillCtaSecondary = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 28px;
  border-radius: 16px;
  font: 600 15px/1 'Lexend', system-ui, sans-serif;
  cursor: pointer;
  background: white;
  color: #111a2b;
  border: 2px solid #e8edf3;
  box-shadow: 0 5px 0 #e3e7ee;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 0 #e3e7ee;
  }

  &:active {
    transform: translateY(3px);
    box-shadow: 0 2px 0 #e3e7ee;
  }
`;

// ---------------------------------------------------------------------------
// Pricing card primitives — ALSO consumed outside Home by:
//   - @components/common/PricingPlanCard.jsx (PricingCard, PopularBadge, PricingName,
//     PricingCredits, PricingPrice, PricingDescription, DiscountBadge)
//   - @routes/Topup/pages/index.jsx (PricingGrid, PricingFilterContainer)
// Keep these exact export names stable even when restyling.
// ---------------------------------------------------------------------------
export const PricingFilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.625rem;
  margin-bottom: 2.5rem;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: stretch;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 720px;
    margin: 0 auto;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const PricingCard = styled.div`
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 22px;
  box-shadow: 0 1px 0 #eef1f5, 0 6px 0 #eef1f6, 0 18px 40px -24px rgba(17, 26, 43, 0.18);
  position: relative;
  padding: 34px 22px 26px;
  text-align: center;
  display: flex;
  flex-direction: column;
  width: 100%;

  ${props => props.$isPopular && `
    border: 2px solid #86c440;
    box-shadow: 0 6px 0 #86c440, 0 24px 44px -24px rgba(111, 174, 44, 0.55);
  `}
`;

export const PopularBadge = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #f5a524;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 999px;
  white-space: nowrap;
`;

export const PricingName = styled.h3`
  color: #3d8fc6;
  font-size: 18px;
  font-weight: 600;
`;

export const PricingCredits = styled.div`
  font-size: 30px;
  font-weight: 800;
  line-height: 1.15;
  margin: 12px 0 4px;
  background: linear-gradient(180deg, #5ca9c9, #6fae2c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const PricingPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin: 12px 0 20px;

  b, & {
    font-size: 21px;
    font-weight: 700;
    color: #111a2b;
  }

  span {
    font-size: 12px;
    font-weight: 600;
    background: #fff3d6;
    color: #b7750d;
    padding: 4px 9px;
    border-radius: 8px;
  }
`;

export const PricingDescription = styled.div`
  font-size: 13.5px;
  color: #4b5565;
  text-align: left;
  margin-bottom: 26px;
  flex: 1;

  p { margin: 0 0 9px; }
  ul, ol { list-style: none; display: grid; gap: 7px; margin: 0; padding: 0; }
  li { display: flex; align-items: flex-start; gap: 6px; line-height: 1.45; }
  strong { font-weight: 600; color: #374151; }
`;

export const DiscountBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  background: #fff3d6;
  color: #b7750d;
  padding: 4px 9px;
  border-radius: 8px;
  white-space: nowrap;
`;
