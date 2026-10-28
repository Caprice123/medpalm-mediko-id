import styled from 'styled-components'
import { colors, fonts, gradients, media } from '../../theme'

// Figma's header is 75px tall. Kept as a constant because three rules depend on
// it staying in step: the bar, the row that centres its contents, and the
// mobile menu that drops below it.
const HEADER_HEIGHT = '75px'

export const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  height: ${HEADER_HEIGHT};
  background: ${colors.surface};
  border-bottom: 1px solid ${colors.border};
`

export const HeaderInner = styled.div`
  /* NOT height: 100% — ContentWidth above it has no explicit height, so the
     percentage cannot resolve and this row would collapse to its tallest child
     (the 42px button) and sit against the top of the bar. */
  min-height: ${HEADER_HEIGHT};
  display: flex;
  align-items: center;
  /* The link group is positioned independently, so the wordmark and the action
     buttons simply hold the two ends of the row. */
  justify-content: space-between;
  gap: 16px;
`

export const Brand = styled.a`
  font-family: ${fonts.display};
  font-weight: 600;
  font-size: 36px;
  letter-spacing: -0.58px;
  line-height: 1;
  text-decoration: none;
  flex-shrink: 0;

  span:first-child {
    color: ${colors.brandBlueLight};
  }

  span:last-child {
    color: ${colors.brandGreen};
  }

  ${media.mobile} {
    font-size: 28px;
  }
`

// Figma centres the link group on the page (its midpoint lands on x=720 of the
// 1440 frame), not in the space left over between the wordmark and the buttons
// — those two sides have different widths, so a flex centre would drift left.
export const NavLinks = styled.nav`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  /* Figma spaces these on a constant 107px centre-to-centre. Because the labels
     differ in width that yields uneven visual gaps (52 / 54 / 63px), which
     reads as sloppy. An even 56px gap keeps the group the same overall width
     and centred in the same place, but with a regular rhythm. */
  gap: 56px;

  ${media.tablet} {
    display: none;
  }
`

export const NavLink = styled.button`
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 15px;
  line-height: 1.65;
  color: ${colors.textNav};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: center;
  transition: color 0.18s ease;

  &:hover {
    color: ${colors.brandBlue};
  }
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;

  /* Below this width the actions move into the full-screen menu. */
  ${media.tablet} {
    gap: 0;
  }

  /* The Figma header is not symmetric: the wordmark starts 90px from the left
     edge but the button stops 109px short of the right one. */
  @media (min-width: 1200px) {
    margin-right: 19px;
  }
`

export const SignInLink = styled.button`
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 15px;
  color: ${colors.textNav};
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.18s ease;

  &:hover {
    color: ${colors.brandBlue};
  }

  ${media.tablet} {
    display: none;
  }
`

export const TrialButton = styled.button`
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  background: ${gradients.navButton};
  border: none;
  border-radius: 12px;
  height: 42px;
  min-width: 118px;
  padding: 0 18px;
  cursor: pointer;
  white-space: nowrap;
  transition: filter 0.18s ease, transform 0.18s ease;

  &:hover {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }

  ${media.tablet} {
    display: none;
  }
`

export const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: ${colors.textNav};

  ${media.tablet} {
    display: inline-flex;
    align-items: center;
  }
`

// Covers everything below the sticky bar, so the page behind is fully hidden
// while the menu is open. `fixed` (not `absolute`) keeps it pinned to the
// viewport rather than scrolling away with the document.
export const MobileMenu = styled.div`
  display: none;

  ${media.tablet} {
    display: ${(props) => (props.$open ? 'flex' : 'none')};
    position: fixed;
    top: ${HEADER_HEIGHT};
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 49;
    flex-direction: column;
    padding: 20px 20px calc(24px + env(safe-area-inset-bottom, 0px));
    background: ${colors.surface};
    overflow-y: auto;

    ${NavLink} {
      /* Roomier tap targets than the desktop row, separated by hairlines. */
      width: 100%;
      padding: 18px 2px;
      font-size: 18px;
      text-align: left;
      border-bottom: 1px solid ${colors.border};
    }
  }
`

// The sign-in and trial actions live inside the overlay on small screens, so
// the bar itself stays down to just the wordmark and the toggle.
export const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
  padding-top: 28px;
`

export const MobileSignIn = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 15px;
  color: ${colors.headingDark};
  cursor: pointer;
`

export const MobileTrial = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background: ${gradients.navButton};
  border: none;
  font-family: ${fonts.body};
  font-weight: 600;
  font-size: 15px;
  color: #fff;
  cursor: pointer;
`
