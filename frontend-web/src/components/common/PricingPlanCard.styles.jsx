import styled from 'styled-components'

// Pricing card primitives.
//
// These mirror the landing page's pricing card (`@routes/Home/components/
// PricingSection`) one-for-one — same geometry, same type scale, same popular
// treatment — so the paid-plan cards a signed-in user sees on /topup are the
// ones they already saw before signing up. The landing page draws its copy of
// the card from `routes/Home/theme.js`; this copy reads the same values through
// the palette's CSS custom properties, which is what keeps the two in step.
//
// Consumers:
//   - PricingPlanCard.jsx — everything except PricingGrid
//   - @routes/Topup/pages/index.jsx — PricingGrid

// The landing page sets this on every pricing element explicitly; GlobalStyles
// already makes it the app's body font, but naming it here keeps the card
// self-contained wherever it is dropped.
const FONT_BODY = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"

export const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  align-items: stretch;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const PricingCard = styled.div`
  position: relative;
  background: var(--color-surface);
  border: ${props => props.$isPopular
    ? '2px solid var(--color-brand-blue-light)'
    : '1px solid var(--color-gray-200)'};
  border-radius: 18px;
  padding: 24px 23px 22px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const PopularBadge = styled.div`
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  height: 21px;
  min-width: 147px;
  padding: 0 14px;
  border-radius: 10.5px;
  background: linear-gradient(98.13deg, var(--color-brand-blue) 0%, var(--color-brand-blue-light) 100%);
  color: var(--color-surface);
  font-family: ${FONT_BODY};
  font-weight: 800;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`

export const PlanLabel = styled.div`
  font-family: ${FONT_BODY};
  font-weight: 700;
  font-size: 12px;
  line-height: 1.65;
  letter-spacing: 1.44px;
  text-transform: uppercase;
  color: var(--color-gray-400);
`

export const PlanCredits = styled.div`
  font-family: ${FONT_BODY};
  font-weight: 700;
  font-size: 26px;
  line-height: 1.2;
  letter-spacing: -0.26px;
  color: var(--color-gray-800);
  text-align: center;
  margin-top: 18px;
`

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  min-height: 29px;
`

export const PlanPrice = styled.div`
  font-family: ${FONT_BODY};
  font-weight: 600;
  font-size: 21.13px;
  line-height: 1.2;
  letter-spacing: -0.21px;
  color: var(--color-gray-700);
  white-space: nowrap;
`

export const DiscountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 29.3px;
  min-width: 92px;
  padding: 0 10px;
  border: 1px solid var(--color-brand-blue-light);
  border-radius: 6px;
  color: var(--color-brand-blue);
  font-family: ${FONT_BODY};
  font-weight: 600;
  font-size: 10.83px;
  white-space: nowrap;
`

export const Divider = styled.div`
  height: 1px;
  background: var(--color-gray-200);
  margin-top: 14px;
`

// The plan's own description is authored as markdown in the admin panel, so the
// list it renders to is styled here rather than built out of FeatureItem rows.
// Bullets get the same check mark the landing page draws, as a masked
// background so a markdown `li` needs no extra element to carry the icon.
export const FeatureList = styled.div`
  margin: 18px 0 0;
  flex: 1;
  font-family: ${FONT_BODY};
  font-weight: 400;
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--color-gray-500);

  p {
    margin: 0 0 9px;
  }

  ul, ol {
    list-style: none;
    display: grid;
    gap: 16px;
    margin: 0;
    padding: 0;
  }

  li {
    position: relative;
    padding-left: 28px;
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 3px;
    width: 16px;
    height: 16px;
    background: url(${props => props.$checkIcon}) no-repeat center / contain;
  }

  strong {
    font-weight: 600;
    color: var(--color-gray-700);
  }
`

export const ButtonSlot = styled.div`
  margin-top: 20px;
`
