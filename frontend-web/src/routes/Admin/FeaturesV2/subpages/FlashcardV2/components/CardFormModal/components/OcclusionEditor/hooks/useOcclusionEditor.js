import { useRef, useState } from 'react'

const MIN_SIZE_PERCENT = 2

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function useOcclusionEditor({ regions, onChange }) {
  const containerRef = useRef(null)
  const [drawing, setDrawing] = useState(null)

  const getPercentPoint = (e) => {
    const rect = containerRef.current.getBoundingClientRect()
    return {
      x: clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100),
    }
  }

  const handleMouseDown = (e) => {
    const { x, y } = getPercentPoint(e)
    setDrawing({ startX: x, startY: y, x, y, width: 0, height: 0 })
  }

  const handleMouseMove = (e) => {
    if (!drawing) return
    const { x, y } = getPercentPoint(e)
    setDrawing(d => ({
      ...d,
      x: Math.min(x, d.startX),
      y: Math.min(y, d.startY),
      width: Math.abs(x - d.startX),
      height: Math.abs(y - d.startY),
    }))
  }

  const handleMouseUp = () => {
    if (!drawing) return
    if (drawing.width >= MIN_SIZE_PERCENT && drawing.height >= MIN_SIZE_PERCENT) {
      onChange([...regions, {
        id: `region-${Date.now()}`,
        x: drawing.x, y: drawing.y, width: drawing.width, height: drawing.height,
        label: '',
      }])
    }
    setDrawing(null)
  }

  const updateRegionLabel = (id, label) =>
    onChange(regions.map(r => (r.id === id ? { ...r, label } : r)))

  const removeRegion = (id) =>
    onChange(regions.filter(r => r.id !== id))

  return { containerRef, drawing, handleMouseDown, handleMouseMove, handleMouseUp, updateRegionLabel, removeRegion }
}
