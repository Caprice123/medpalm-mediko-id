import { useEffect, useRef, useState } from 'react'

export function useHeroArt() {
  const stageRef = useRef(null)
  const boardRef = useRef(null)
  // Matches the reference design: the correct option (B) is highlighted
  // by default, not only after a click.
  const [selected, setSelected] = useState('B')

  useEffect(() => {
    const stage = stageRef.current
    const board = boardRef.current
    if (!stage || !board) return

    const syncBase = () => {
      const base = stage.clientHeight - board.offsetTop - board.offsetHeight
      stage.style.setProperty('--hero-stage-base', `${base}px`)
    }

    const observer = new ResizeObserver(syncBase)
    observer.observe(board)
    syncBase()

    return () => observer.disconnect()
  }, [])

  const selectOption = (key) => setSelected(key)

  return { stageRef, boardRef, selected, selectOption }
}
