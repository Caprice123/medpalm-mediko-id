import styled, { createGlobalStyle } from 'styled-components'
import EmptyState from '@components/common/EmptyState'
import {
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from '@components/common/EmptyState/EmptyState.styles'
import { colors, fonts, gradients, layout, media } from './theme'

// Scoped to the landing route only. The app's other pages keep their own
// typography — this sets the Figma fonts on the landing tree, not on <body>.
export const GlobalStyles = createGlobalStyle`
  body {
    background: ${colors.pageBackground};
  }
`

export const LandingContainer = styled.div`
  background: ${colors.pageBackground};
  color: ${colors.textPrimary};
  font-family: ${fonts.body};
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
`

// Shared by every section component: the 1260px content column Figma draws
// its 1440px frame against, with gutters that survive down to phone width.
export const ContentWidth = styled.div`
  width: 100%;
  max-width: ${layout.maxWidth};
  margin: 0 auto;
  padding-inline: 24px;

  ${media.mobile} {
    padding-inline: 16px;
  }
`

// Shared by WhyMedPalSection, PricingSection, ChallengeSection and
// TestimonialSection. 40px is the size Figma uses for most section headings;
// the sections that differ (Event at 56px, FeatureDetail at 47px, FAQ at 40px
// with its own line breaks) define their own heading instead.
// Shared by EventSection and ChallengeSection, which both have to say "nothing
// scheduled yet" without resorting to fake cards.
//
// The common EmptyState is styled for admin list pages — grey type and a faded
// 4rem emoji — which reads as broken on a marketing page. This keeps the
// component (and its behaviour) and only restyles it to the landing's language.
export const LandingEmptyState = styled(EmptyState)`
  border: 2px dashed ${colors.border};
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.6);
  padding: 44px 24px;
  color: ${colors.bodyText};

  ${EmptyStateIcon} {
    font-size: 2.75rem;
    opacity: 1;
    margin-bottom: 0.75rem;
  }

  ${EmptyStateTitle} {
    font-family: ${fonts.body};
    font-weight: 700;
    font-size: 19px;
    color: ${colors.headingDark};
    margin-bottom: 0.4rem;
  }

  ${EmptyStateDescription} {
    font-family: ${fonts.body};
    font-size: 15px;
    line-height: 1.6;
    color: ${colors.bodyText};
    max-width: 420px;
    margin-bottom: 0;
  }

  ${EmptyStateActions} {
    margin-top: 1.25rem;

    /* The common Button's "primary" is the app's blue-to-green gradient, which
       clashes with the landing palette — reskin it without swapping component. */
    button {
      background: ${gradients.cta};
      border: none;
      border-radius: 12px;
      height: 44px;
      padding: 0 24px;
      font-family: ${fonts.body};
      font-weight: 600;
      font-size: 15px;
      color: #fff;
      box-shadow: none;

      &:hover {
        filter: brightness(1.06);
        transform: translateY(-1px);
      }
    }
  }
`

export const SectionHeading = styled.h2`
  font-family: ${fonts.heading};
  font-weight: 800;
  font-size: 40px;
  line-height: 1.17;
  letter-spacing: -0.52px;
  color: ${colors.headingDark};
  margin: 0;

  ${media.tablet} {
    font-size: 34px;
  }

  ${media.mobile} {
    font-size: 28px;
  }
`
