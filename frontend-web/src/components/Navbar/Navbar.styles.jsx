import styled from "styled-components"
import { colors } from '@config/colors'

export const Container = styled.header`
  background: white;
  box-shadow: 0 2px 8px rgba(107, 185, 232, 0.1);
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid ${colors.neutral.gray100};
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (max-width: 968px) {
    padding: 1rem 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: inherit;
  }

  img {
    object-fit: contain;
    padding: 4px;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  @media (max-width: 768px) {
    display: none;
  }
`

export const UserInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
`

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${colors.gradient.start} 0%, ${colors.gradient.end} 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;

  @media (max-width: 968px) {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 0.875rem;
  }
`

export const UserName = styled.span`
  font-weight: 500;
  color: #374151;
`

export const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: linear-gradient(135deg, rgba(107, 185, 232, 0.08) 0%, rgba(141, 198, 63, 0.08) 100%);
  border: 1.5px solid ${colors.neutral.gray200};
  border-radius: 8px;
  padding: 0.375rem 0.625rem;
  box-shadow: 0 2px 4px rgba(107, 185, 232, 0.1);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${colors.text.primary};

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }

  span:first-child {
    font-size: 1.125rem;
    @media (max-width: 968px) {
      font-size: 0.9375rem;
    }
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`

export const StatusDivider = styled.div`
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 0.25rem;

  @media (max-width: 768px) {
    height: 16px;
  }
`

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
  font-size: 0.875rem;
`

export const HamburgerButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  font-size: 1.75rem;
  color: ${colors.primary.main};
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    color: ${colors.primary.dark};
  }

  @media (max-width: 768px) {
    display: block;
  }
`

export const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  background: white;
  transform: translateY(${props => props.$isOpen ? '0' : '-100%'});
  opacity: ${props => props.$isOpen ? '1' : '0'};
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  z-index: 999;
  overflow-y: auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 0 auto;

  @media (min-width: 769px) {
    display: none;
  }
`

export const MobileMenuItem = styled.div`
  width: 100%;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: ${colors.neutral.gray50};
  border-radius: 12px;
  border: 1px solid ${colors.neutral.gray200};
  box-shadow: 0 2px 8px rgba(107, 185, 232, 0.08);

  &.status-wrapper {
    flex-direction: column;
    gap: 0.75rem;

    ${StatusItem} {
      justify-content: center;
    }

    @media (min-width: 520px) {
      flex-direction: row;
      gap: 1rem;
    }
  }
`

export const MobileMenuDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${colors.neutral.gray200};
  margin: 0.5rem 0;
`

