import styled from 'styled-components'

export const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`

export const MobileCloseButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 36px;
    height: 36px;
    background: #f3f4f6;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    color: #6b7280;
    z-index: 10;

    &:hover {
      background: #fee2e2;
      color: #dc2626;
    }
  }
`

export const FloatingHamburger = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: ${props => props.$open ? 'none' : 'flex'};
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    position: fixed;
    z-index: 210;
    width: 44px;
    height: 44px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    cursor: grab;
    padding: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;

    span {
      display: block;
      width: 100%;
      height: 2px;
      background: #374151;
      border-radius: 2px;
      transition: all 0.25s ease;
    }

    &:hover span {
      background: #06b6d4;
    }
  }
`

export const MobileOverlay = styled.div`
  display: none;

`

export const Sidebar = styled.aside`
  width: ${props => props.$open ? '240px' : '0px'};
  min-width: ${props => props.$open ? '240px' : '0px'};
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease, min-width 0.25s ease;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    min-width: 100vw;
    height: 100vh;
    z-index: 200;
    overflow: hidden;
    transform: ${props => props.$open ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.25s ease;
  }
`

export const SidebarInner = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
`

export const SidebarLogo = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;

  img {
    height: 40px;
    object-fit: contain;
  }

  &:hover {
    background: #f0fdfa;
  }
`

export const SidebarNav = styled.nav`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.5rem 0 0.25rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f3f4f6;
  }
  &::-webkit-scrollbar-thumb {
    background: #9ca3af;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
`

export const SidebarGroup = styled.div`
  margin-bottom: 0;
`

export const SidebarGroupHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 1.25rem 0.2rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  transition: color 0.15s;

  &:hover {
    color: #6b7280;
  }
`

export const ChevronIcon = styled.span`
  font-size: 0.6rem;
  transition: transform 0.2s ease;
  transform: ${props => props.$collapsed ? 'rotate(-90deg)' : 'rotate(0deg)'};
`

export const SidebarGroupItems = styled.div`
  overflow: hidden;
  max-height: ${props => props.$collapsed ? '0' : '1000px'};
  transition: max-height 0.25s ease;
`

export const SidebarTooltip = styled.span`
  position: fixed;
  transform: translateY(-50%);
  background: #1f2937;
  color: #ffffff;
  font-size: 0.72rem;
  line-height: 1.4;
  padding: 0.4rem 0.65rem;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 9999;

  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-right-color: #1f2937;
  }
`

export const SidebarItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.3rem 1.25rem;
  border: none;
  background: ${props => props.$active ? '#f0fdfa' : 'none'};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: ${props => props.$active ? '600' : '400'};
  color: ${props => props.$active ? '#06b6d4' : '#374151'};
  text-align: left;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  border-left: 3px solid ${props => props.$active ? '#06b6d4' : 'transparent'};

  &:hover {
    background: #f0fdfa;
    color: #06b6d4;
  }
`

export const SidebarItemIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
`

export const SidebarItemName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`

export const SidebarLockIcon = styled.span`
  font-size: 0.7rem;
  flex-shrink: 0;
  opacity: 0.6;
  margin-left: auto;
`

export const SidebarFooter = styled.div`
  border-top: 1px solid #e5e7eb;
  padding: 0.875rem 1.25rem;
  flex-shrink: 0;
`

export const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.75rem;
`

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #06b6d4;
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const UserName = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const StatSection = styled.div`
  margin-bottom: 0.5rem;
`

export const StatHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: 0.25rem;
`

export const StatHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.8125rem;
`

export const StatChevron = styled.span`
  font-size: 0.5rem;
  color: #9ca3af;
  transition: transform 0.2s ease;
  transform: ${props => props.$open ? 'rotate(0deg)' : 'rotate(-90deg)'};
`

export const StatDetails = styled.div`
  overflow: hidden;
  max-height: ${props => props.$open ? '300px' : '0'};
  transition: max-height 0.2s ease;
  padding-left: 1.25rem;
`

export const StatDetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${props => props.$warn ? '#dc2626' : '#6b7280'};
  padding: 0.2rem 0;
`

export const StatDetailLabel = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const StatDetailValue = styled.span`
  font-weight: 600;
  white-space: nowrap;
  margin-left: 0.25rem;
  flex-shrink: 0;
`

export const FooterActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.625rem;
`

export const FooterActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.4rem 0.5rem;
  border-radius: 7px;
  border: 1px solid #e5e7eb;
  background: none;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  color: ${props => props.$danger ? '#dc2626' : '#374151'};
  border-color: ${props => props.$danger ? '#fecaca' : '#e5e7eb'};
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;

  &:hover {
    background: ${props => props.$danger ? '#fee2e2' : '#f0fdfa'};
    color: ${props => props.$danger ? '#dc2626' : '#06b6d4'};
    border-color: ${props => props.$danger ? '#fca5a5' : '#06b6d4'};
  }
`

export const ContentArea = styled.div`
  flex: 1;
  min-width: 0;
`

export const SidebarOuter = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: visible;
  flex-shrink: 0;
  z-index: 10;
`

export const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: -28px;
  transform: translateY(-50%);
  z-index: 100;
  width: 28px;
  height: 64px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-left: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #6b7280;
  transition: color 0.15s, background 0.15s;
  padding: 0;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.08);

  &:hover {
    background: #f0fdfa;
    color: #06b6d4;
    border-color: #06b6d4;
  }

  @media (max-width: 768px) {
    display: none;
  }
`
