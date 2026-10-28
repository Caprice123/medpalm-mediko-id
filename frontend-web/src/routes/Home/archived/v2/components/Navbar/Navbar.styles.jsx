import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from '@config/colors';

export const NavbarBar = styled.nav`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(247, 249, 251, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${props => props.$scrolled ? '#e8edf3' : 'transparent'};
  z-index: 1000;
  transition: border-color 0.2s ease;
`;

export const NavContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 clamp(20px, 5vw, 56px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 74px;
`;

export const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 21px;
  letter-spacing: -0.02em;
`;

export const LogoMark = styled.svg`
  flex-shrink: 0;
`;

export const LogoText = styled.span`
  .med { color: #3d8fc6; }
  .pal { color: #6fae2c; }
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2.125rem;

  @media (max-width: 960px) {
    display: none;
  }
`;

export const NavLink = styled.a`
  color: #4b5565;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.primary.main};
  }
`;

export const NavCtaGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  @media (max-width: 960px) {
    display: none;
  }
`;

export const NavCtaSecondary = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 14px;
  font: 600 14px/1 'Lexend', system-ui, sans-serif;
  color: #111a2b;
  background: white;
  border: 2px solid #e8edf3;
  box-shadow: 0 5px 0 #e3e7ee;
  text-decoration: none;
  white-space: nowrap;
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

export const NavCtaPrimary = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 14px;
  font: 600 14px/1 'Lexend', system-ui, sans-serif;
  color: white;
  background: linear-gradient(180deg, #9ad14f, #6fae2c);
  box-shadow: 0 5px 0 #5a9423;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 0 #5a9423;
  }

  &:active {
    transform: translateY(3px);
    box-shadow: 0 2px 0 ${colors.secondary.dark};
  }
`;

export const BurgerButton = styled.button`
  display: none;
  background: none;
  border: 0;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${colors.primary.main};

  @media (max-width: 960px) {
    display: flex;
  }
`;

export const MobileMenu = styled.div`
  display: none;

  @media (max-width: 960px) {
    display: flex;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100vh;
    flex-direction: column;
    justify-content: center;
    background: white;
    padding: 0 2rem;
    z-index: 999;
    opacity: ${props => props.$isOpen ? '1' : '0'};
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    overflow-y: auto;
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
