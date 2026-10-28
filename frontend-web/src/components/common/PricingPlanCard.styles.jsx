import styled from 'styled-components'

// Pricing card primitives.
//
// These used to live in `@routes/Home/Home.styles` and were imported across the
// app from there, which coupled an authenticated page (Topup) to the public
// landing page's stylesheet. They moved here during the landing-page revamp so
// the card owns its own styles, next to `PricingPlanCard.jsx`.
//
// Consumers:
//   - PricingPlanCard.jsx — PricingCard, PopularBadge, PricingName,
//     PricingCredits, PricingPrice, PricingDescription, DiscountBadge
//   - @routes/Topup/pages/index.jsx — PricingGrid, PricingFilterContainer

export const PricingFilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.625rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
`

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
`

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
`

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
`

export const PricingName = styled.h3`
  color: #3d8fc6;
  font-size: 18px;
  font-weight: 600;
`

export const PricingCredits = styled.div`
  font-size: 30px;
  font-weight: 800;
  line-height: 1.15;
  margin: 12px 0 4px;
  background: linear-gradient(180deg, #5ca9c9, #6fae2c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

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
`

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
`

export const DiscountBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  background: #fff3d6;
  color: #b7750d;
  padding: 4px 9px;
  border-radius: 8px;
  white-space: nowrap;
`
