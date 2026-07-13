import styled from 'styled-components'

export const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #f8fafc;
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
    display: none;
  }
`

export const PanelWrapper = styled.main`
  flex: 1;
  overflow-y: auto;
  min-width: 0;
`
