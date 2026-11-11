import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768
const PANEL_WIDTH_KEY = 'skripsi-v2-chat-panel-width'
const DEFAULT_PANEL_WIDTH = 400

// Reads the chat panel's last width. localStorage can throw outright in a
// private window or with site data blocked, so the default has to survive that
// rather than only a missing key.
const readStoredPanelWidth = () => {
  try {
    const saved = localStorage.getItem(PANEL_WIDTH_KEY)
    const parsed = saved ? parseFloat(saved) : NaN
    return Number.isFinite(parsed) ? parsed : DEFAULT_PANEL_WIDTH
  } catch {
    return DEFAULT_PANEL_WIDTH
  }
}

// Which layout the editor is in, and how wide the student left the chat panel.
//
// On a phone the two panes stack and both stay mounted — toggled with CSS
// rather than unmounted — so a half-typed message or a diagram in progress
// survives switching tabs.
export const useEditorLayout = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT)
  const [chatPanelWidth] = useState(readStoredPanelWidth)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const persistPanelWidth = (pixels) => {
    try {
      localStorage.setItem(PANEL_WIDTH_KEY, String(pixels))
    } catch {
      // A remembered panel width is a convenience, not state worth failing over.
    }
  }

  return { isMobile, chatPanelWidth, persistPanelWidth }
}
