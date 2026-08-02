import styled, { keyframes } from 'styled-components'

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
`

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 300;
`

export const Drawer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 380px;
  max-width: 100vw;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
  z-index: 301;
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.22s ease both;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100vw;
  }
`

export const DrawerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.25rem 1.25rem 0;
`

export const DrawerTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.4;
`

export const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #9ca3af;
  padding: 0.125rem;
  flex-shrink: 0;
  line-height: 1;
  &:hover { color: #374151; }
`

export const TabBar = styled.div`
  display: flex;
  gap: 0;
  padding: 1rem 1.25rem 0;
  border-bottom: 2px solid #e5e7eb;
  margin-top: 0.75rem;
`

export const TabBtn = styled.button`
  background: none;
  border: none;
  border-bottom: 2.5px solid ${({ $active }) => $active ? '#10b981' : 'transparent'};
  margin-bottom: -2px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  color: ${({ $active }) => $active ? '#10b981' : '#6b7280'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;

  &:hover {
    color: ${({ $active }) => $active ? '#10b981' : '#374151'};
  }
`

export const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

// Shared by SummaryNotesTab (empty state), FlashcardTab, and McqTab (setup screens)
export const CountLabel = styled.p`
  font-size: 0.9375rem;
  font-weight: 500;
  color: #374151;
  margin: 0 0 0.5rem;
`

export const SessionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const CountInput = styled.input`
  width: 5rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #111827;
  text-align: center;
  outline: none;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`

export const StartButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: #059669; }
  &:disabled { background: #d1d5db; cursor: not-allowed; }
`

// Shared by FlashcardTab and McqTab players
export const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const PlayerStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

export const PlayerCounter = styled.span`
  font-size: 0.8125rem;
  color: #6b7280;
  b { color: #111827; }
`

export const PlayerBackBtn = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  flex-shrink: 0;
  &:hover { background: #fee2e2; color: #ef4444; }
`

export const PlayerProgress = styled.div`
  width: 100%;
  height: 5px;
  background: #f3f4f6;
  border-radius: 99px;
  overflow: hidden;
`

export const PlayerFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, #6BB9E8, #8DC63F);
  border-radius: 99px;
  transition: width 0.3s ease;
`
