import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthRoute } from '@routes/Auth/routes'

export function useNavbar({ scrollToSection }) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // The menu covers the viewport, so the page behind it must not scroll.
  useEffect(() => {
    if (!isMenuOpen) return undefined

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isMenuOpen])

  // Leaving it open while the layout switches back to the desktop row would
  // trap the scroll lock with no visible way to close it.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 993px)')
    const close = (event) => {
      if (event.matches) setIsMenuOpen(false)
    }
    query.addEventListener('change', close)
    return () => query.removeEventListener('change', close)
  }, [])

  const goToSignIn = () => {
    setIsMenuOpen(false)
    navigate(AuthRoute.signInRoute)
  }

  const handleNavClick = (target) => {
    setIsMenuOpen(false)
    scrollToSection(target)
  }

  const toggleMenu = () => setIsMenuOpen((open) => !open)

  return { isMenuOpen, toggleMenu, handleNavClick, goToSignIn }
}
