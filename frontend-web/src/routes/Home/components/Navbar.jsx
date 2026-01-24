import { LinkButton } from '../Home.styles'
import Button from '@components/common/Button'
import {
  Navbar as StyledNavbar,
  NavContent,
  Logo,
  LogoIcon,
  NavLinks,
  NavLink,
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
              <img src="/icon.png" alt="MedPalm Logo" style={{ width: '108px', height: '48px', objectFit: 'contain' }} />
            </LogoIcon>
          </Logo>
          <NavLinks>
            <NavLink onClick={() => scrollToSection('features')}>Fitur</NavLink>
            <NavLink onClick={() => scrollToSection('pricing')}>Harga</NavLink>
            <NavLink onClick={() => scrollToSection('how-it-works')}>Demo</NavLink>
            <LinkButton to="/sign-in" variant="primary" className="nav-cta">
              Masuk
            </LinkButton>
          </NavLinks>
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
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={() => navigate('/sign-in')}
          style={{ marginTop: '2rem' }}
        >
          Masuk
        </Button>
      </MobileMenu>
    </>
  )
}
