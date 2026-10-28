import { ContentWidth } from '../../Home.styles'
import { useNavbar } from './hooks/useNavbar'
import {
  HeaderBar,
  HeaderInner,
  Brand,
  NavLinks,
  NavLink,
  HeaderActions,
  SignInLink,
  TrialButton,
  MenuToggle,
  MobileMenu,
  MobileActions,
  MobileSignIn,
  MobileTrial,
} from './Navbar.styles'

// Matches the links drawn in the Figma header; an admin can override the list
// through the `home_nav_items` constant.
const DEFAULT_NAV_ITEMS = [
  { label: 'Tentang', target: 'about' },
  { label: 'Fitur', target: 'features' },
  { label: 'Produk', target: 'pricing' },
  { label: 'FAQ', target: 'faq' },
]

function Navbar({ scrollToSection, navItems }) {
  const { isMenuOpen, toggleMenu, handleNavClick, goToSignIn } = useNavbar({ scrollToSection })
  const items = navItems || DEFAULT_NAV_ITEMS

  return (
    <HeaderBar>
      <ContentWidth>
        <HeaderInner>
          <Brand href="/" aria-label="MedPal">
            <span>Med</span>
            <span>Pal</span>
          </Brand>

          <NavLinks>
            {items.map((item) => (
              <NavLink key={item.target} onClick={() => handleNavClick(item.target)}>
                {item.label}
              </NavLink>
            ))}
          </NavLinks>

          <HeaderActions>
            <SignInLink onClick={goToSignIn}>Masuk</SignInLink>
            <TrialButton onClick={goToSignIn}>Coba Gratis</TrialButton>
            <MenuToggle
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isMenuOpen}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {isMenuOpen ? (
                  <>
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </MenuToggle>
          </HeaderActions>
        </HeaderInner>
      </ContentWidth>

      <MobileMenu $open={isMenuOpen}>
        {items.map((item) => (
          <NavLink key={item.target} onClick={() => handleNavClick(item.target)}>
            {item.label}
          </NavLink>
        ))}

        <MobileActions>
          <MobileSignIn onClick={goToSignIn}>Masuk</MobileSignIn>
          <MobileTrial onClick={goToSignIn}>Coba Gratis</MobileTrial>
        </MobileActions>
      </MobileMenu>
    </HeaderBar>
  )
}

export default Navbar
