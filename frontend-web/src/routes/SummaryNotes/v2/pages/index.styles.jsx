import styled from 'styled-components'

export const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #f5f3ee;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    overflow: visible;
  }
`

export const SidebarWrapper = styled.aside`
  width: 270px;
  flex-shrink: 0;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    height: 100vh;
    border-right: none;
    border-bottom: 2px solid #e5e7eb;
    flex-shrink: 0;
  }
`

export const MobileOverlay = styled.div``

export const PanelWrapper = styled.main`
  flex: 1;
  overflow-y: auto;
  min-width: 0;

  @media (max-width: 768px) {
    overflow-y: visible;
    min-height: 100vh;
  }
`
