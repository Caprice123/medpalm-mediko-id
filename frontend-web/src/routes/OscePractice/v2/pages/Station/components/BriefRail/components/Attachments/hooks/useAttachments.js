import { useState, useCallback, useEffect } from 'react'

// The station's supplied images (an ECG strip, a photograph of a lesion) as one framed view
// with a step through them, rather than a wall of thumbnails in a 300px rail.
export const useAttachments = (total) => {
  const [index, setIndex] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  // A different station can have fewer images than the one just viewed.
  useEffect(() => {
    setIndex((current) => (current < total ? current : 0))
  }, [total])

  const step = useCallback((delta) => {
    setIndex((current) => Math.min(total - 1, Math.max(0, current + delta)))
  }, [total])

  const openViewer = useCallback(() => setIsViewerOpen(true), [])

  return { index, setIndex, step, isViewerOpen, setIsViewerOpen, openViewer }
}
