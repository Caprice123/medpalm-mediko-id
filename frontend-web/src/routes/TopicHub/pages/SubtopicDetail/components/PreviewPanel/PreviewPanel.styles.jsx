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
  width: ${({ $width }) => $width}px;
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

export const ResizeHandle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 16px;
  cursor: col-resize;
  touch-action: none;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;

  /* the edge line, centred inside the wider hit area. It stays visible at rest
     so the drawer reads as having a grabbable edge rather than a hard border */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${({ $active }) => $active ? 'var(--color-brand-blue)' : 'var(--color-gray-200)'};
    transition: background 0.15s;
  }

  &:hover::after {
    background: var(--color-brand-blue);
  }

  @media (max-width: 768px) {
    display: none;
  }
`

// The grip itself — a dotted pill sitting on the edge line, so the handle is
// discoverable without a hover. Hover tints it, dragging fills it.
export const ResizeGrip = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 46px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => $active ? 'var(--color-brand-blue)' : 'var(--color-gray-300)'};
  background: ${({ $active }) => $active ? 'var(--color-brand-blue)' : 'var(--color-surface)'};
  color: ${({ $active }) => $active ? 'var(--color-surface)' : 'var(--color-gray-400)'};
  font-size: 0.875rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: background 0.15s, border-color 0.15s, color 0.15s;

  ${ResizeHandle}:hover & {
    border-color: var(--color-brand-blue);
    background: ${({ $active }) => $active ? 'var(--color-brand-blue)' : 'var(--color-brand-blue-tint)'};
    color: ${({ $active }) => $active ? 'var(--color-surface)' : 'var(--color-brand-blue)'};
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
  color: var(--color-gray-900);
  margin: 0;
  line-height: 1.4;
`

export const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--color-gray-400);
  padding: 0.125rem;
  flex-shrink: 0;
  line-height: 1;
  &:hover { color: var(--color-gray-700); }
`

export const TabBar = styled.div`
  display: flex;
  gap: 0;
  padding: 1rem 1.25rem 0;
  border-bottom: 2px solid var(--color-gray-200);
  margin-top: 0.75rem;
`

export const TabBtn = styled.button`
  background: none;
  border: none;
  border-bottom: 2.5px solid ${({ $active }) => $active ? 'var(--color-brand-blue)' : 'transparent'};
  margin-bottom: -2px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  color: ${({ $active }) => $active ? 'var(--color-brand-blue)' : 'var(--color-gray-500)'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;

  &:hover {
    color: ${({ $active }) => $active ? 'var(--color-brand-blue)' : 'var(--color-gray-700)'};
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
  color: var(--color-gray-700);
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
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-size: 0.9375rem;
  color: var(--color-gray-900);
  text-align: center;
  outline: none;

  &:focus {
    border-color: var(--color-brand-blue);
    box-shadow: 0 0 0 3px rgba(30, 115, 170, 0.12);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`

export const StartButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  background: var(--color-brand-blue);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) { background: var(--color-brand-blue-deep); }
  &:disabled { background: var(--color-gray-300); cursor: not-allowed; }
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
  color: var(--color-gray-500);
  b { color: var(--color-gray-900); }
`

export const PlayerBackBtn = styled.button`
  background: var(--color-gray-100);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: var(--color-gray-500);
  cursor: pointer;
  flex-shrink: 0;
  &:hover { background: var(--color-danger-tint); color: var(--color-danger); }
`

export const PlayerProgress = styled.div`
  width: 100%;
  height: 5px;
  background: var(--color-gray-100);
  border-radius: 99px;
  overflow: hidden;
`

export const PlayerFill = styled.div`
  height: 100%;
  width: ${p => p.$progress}%;
  background: linear-gradient(90deg, var(--color-brand-blue), var(--color-brand-blue-light));
  border-radius: 99px;
  transition: width 0.3s ease;
`
