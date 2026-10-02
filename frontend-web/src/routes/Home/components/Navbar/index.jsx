import { useNavigate } from 'react-router-dom'
import Button from '@components/common/Button'
import { useNavbar } from './hooks/useNavbar'
import {
  NavbarBar,
  NavContent,
  Logo,
  LogoMark,
  LogoText,
  NavLinks,
  NavLink,
  NavCtaGroup,
  NavCtaSecondary,
  NavCtaPrimary,
  BurgerButton,
  MobileMenu,
  MobileNavLink,
} from './Navbar.styles'

export default function Navbar({ scrollToSection }) {
  const navigate = useNavigate()
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu, scrolled } = useNavbar()

  const handleNavClick = (id) => {
    scrollToSection(id)
    closeMobileMenu()
  }

  return (
    <>
      <NavbarBar $scrolled={scrolled}>
        <NavContent>
          <Logo to="/" aria-label="MedPal beranda">
            <LogoMark width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
              <circle cx="16" cy="15" r="12.5" fill="none" stroke="#3d8fc6" strokeWidth="3.2" />
              <path d="M11 9v5a5 5 0 0 0 10 0V9" fill="none" stroke="#3d8fc6" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="11" cy="8.5" r="1.6" fill="#3d8fc6" />
              <circle cx="21" cy="8.5" r="1.6" fill="#3d8fc6" />
              <path d="M16 19v5.5" stroke="#3d8fc6" strokeWidth="2.4" strokeLinecap="round" />
              <rect x="21" y="22" width="11" height="11" rx="3" fill="#86c440" />
              <path d="M26.5 24.5v6M23.5 27.5h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </LogoMark>
            <LogoText><span className="med">Med</span><span className="pal">Pal</span></LogoText>
          </Logo>

          <NavLinks>
            <NavLink onClick={() => handleNavClick('features')}>Fitur</NavLink>
            <NavLink onClick={() => handleNavClick('pricing')}>Harga</NavLink>
            <NavLink onClick={() => handleNavClick('how-it-works')}>Demo</NavLink>
            <NavLink onClick={() => handleNavClick('faq')}>FAQ</NavLink>
          </NavLinks>

          <NavCtaGroup>
            <NavCtaSecondary to="/sign-in">Masuk</NavCtaSecondary>
            <NavCtaPrimary to="/sign-in">Mulai Gratis</NavCtaPrimary>
          </NavCtaGroup>

          <BurgerButton onClick={toggleMobileMenu} aria-label="Buka menu">
            {mobileMenuOpen ? '✕' : '☰'}
          </BurgerButton>
        </NavContent>
      </NavbarBar>

      <MobileMenu $isOpen={mobileMenuOpen}>
        <MobileNavLink onClick={() => handleNavClick('features')}>Fitur</MobileNavLink>
        <MobileNavLink onClick={() => handleNavClick('pricing')}>Harga</MobileNavLink>
        <MobileNavLink onClick={() => handleNavClick('how-it-works')}>Demo</MobileNavLink>
        <MobileNavLink onClick={() => handleNavClick('faq')}>FAQ</MobileNavLink>
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={() => navigate('/sign-in')}
          style={{ marginTop: '2rem' }}
        >
          Mulai Gratis
        </Button>
        <Button
          variant="outline"
          size="large"
          fullWidth
          onClick={() => navigate('/sign-in')}
          style={{ marginTop: '0.75rem' }}
        >
          Masuk
        </Button>
      </MobileMenu>
    </>
  )
}
