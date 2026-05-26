'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navItems = [
  { label: 'HOME', href: '#' },
  { label: 'TEAM', href: '#team' },
  { label: 'ABOUT', href: '#about' },
  { label: 'GALLERY', href: '#gallery' },
  { label: 'VIBE', href: '#vibe' },
  { label: 'CONTACT', href: '#contact' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false)
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-[color:var(--border)]' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button 
              onClick={() => scrollToSection('#')}
              className="font-sans text-xl md:text-2xl text-cream tracking-[0.2em] hover:text-[color:var(--neon-cyan)] transition-colors"
            >
              AI-TRONICS
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="font-mono text-xs tracking-widest text-[color:var(--muted-foreground)] hover:text-[color:var(--neon-cyan)] transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[color:var(--neon-cyan)] group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[color:var(--muted-foreground)] hover:text-[color:var(--neon-cyan)] transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black/95 z-40 md:hidden transition-all duration-500 ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.href)}
              className="font-sans text-3xl tracking-widest text-cream hover:text-[color:var(--neon-cyan)] transition-colors"
              style={{ 
                transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms',
                transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
