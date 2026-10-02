import { useEffect, useState } from 'react'

export function useNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return { mobileMenuOpen, toggleMobileMenu, closeMobileMenu, scrolled }
}
