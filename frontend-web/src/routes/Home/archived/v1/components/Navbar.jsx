import Button from '@components/common/Button'
import {
  Navbar as StyledNavbar,
  NavContent,
  Logo,
  LogoIcon,
  NavLinks,
  NavLink,
  NavCtaGroup,
  NavCtaSecondary,
  NavCtaPrimary,
  MobileMenu,
  MobileNavLink,
} from '../Home.styles'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ mobileMenuOpen, toggleMobileMenu, scrollToSection }) {
    const navigate = useNavigate()
  return (
    <>
      <StyledNavbar>
        <NavContent>
          <Logo>
            <LogoIcon>
              <img src="/icon.png" alt="MedPal Logo" style={{ width: '108px', height: '48px', objectFit: 'contain' }} />
            </LogoIcon>
          </Logo>
          <NavLinks>
            <NavLink onClick={() => scrollToSection('features')}>Fitur</NavLink>
            <NavLink onClick={() => scrollToSection('pricing')}>Harga</NavLink>
            <NavLink onClick={() => scrollToSection('how-it-works')}>Demo</NavLink>
            <NavLink onClick={() => scrollToSection('faq')}>FAQ</NavLink>
          </NavLinks>
          <NavCtaGroup>
            <NavCtaSecondary to="/sign-in">Masuk</NavCtaSecondary>
            <NavCtaPrimary to="/sign-in">Mulai Gratis</NavCtaPrimary>
          </NavCtaGroup>
          <Button
            onClick={toggleMobileMenu}
            variant="secondary"
            style={{
              fontSize: '1.75rem',
              padding: '0.5rem',
              border: 'none',
              background: 'none',
              color: '#6BB9E8',
              display: 'none'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </Button>
        </NavContent>
      </StyledNavbar>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen}>
        <MobileNavLink onClick={() => scrollToSection('features')}>Fitur</MobileNavLink>
        <MobileNavLink onClick={() => scrollToSection('pricing')}>Harga</MobileNavLink>
        <MobileNavLink onClick={() => scrollToSection('how-it-works')}>Demo</MobileNavLink>
        <MobileNavLink onClick={() => scrollToSection('faq')}>FAQ</MobileNavLink>
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
