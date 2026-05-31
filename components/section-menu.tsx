'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ChevronRight } from 'lucide-react'

interface Section {
  id: string
  label: string
  sublabel: string
  number: string
}

const sections: Section[] = [
  { id: 'team', label: 'THE MINDS', sublabel: 'Meet the Team', number: '01' },
  { id: 'about', label: 'THE HUB', sublabel: 'About AI-TRONICS', number: '02' },
  { id: 'events', label: 'ARCHIVES', sublabel: 'Events & Memories', number: '03' },
  { id: 'vibe', label: 'NOW PLAYING', sublabel: 'Set Your Frequency', number: '04' },
  { id: 'contact', label: 'TRANSMIT', sublabel: 'Get In Touch', number: '05' },
  { id: 'infinite-gallery', label: 'INFINITE', sublabel: 'Infinite Archive Experience', number: '06' },
]

interface SectionMenuProps {
  isOpen: boolean
  onClose: () => void
  onSelectSection: (sectionId: string) => void
  currentSection: string | null
}

export default function SectionMenu({ isOpen, onClose, onSelectSection, currentSection }: SectionMenuProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)

  useEffect(() => {
    if (!isOpen) return

    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = (e: WheelEvent) => {
      // Smooth scroll back to landing page if user scrolls UP at the top of the menu
      if (container.scrollTop <= 2 && e.deltaY < -20) {
        onClose()
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touchY = e.touches[0].clientY
        const diff = touchY - touchStartY.current
        // Swipe down at the top of the menu scrolls up, transitioning back
        if (container.scrollTop <= 2 && diff > 40) {
          onClose()
        }
      }
    }

    container.addEventListener('wheel', handleScroll, { passive: true })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      container.removeEventListener('wheel', handleScroll)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      ref={scrollContainerRef}
      className="absolute inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto py-12 scrollbar-thin"
    >
      {/* Grunge overlay */}
      <div className="grunge-overlay" />
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 z-50 p-2 text-[#a8a29e] hover:text-[#f5f5dc] transition-colors"
      >
        <X size={24} />
      </button>

      {/* Header */}
      <div className="absolute top-8 left-8">
        <span 
          className="text-3xl md:text-4xl text-[#f5f5dc] tracking-[0.1em]"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          AI-TRONICS
        </span>
      </div>

      {/* Menu Content */}
      <div className="h-full flex items-center justify-center px-8">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <p className="font-mono text-xs text-[#6b6b6b] tracking-[0.4em] mb-12 uppercase">
            Navigate The Society
          </p>

          {/* Menu Items */}
          <nav className="space-y-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
                className={`menu-item w-full text-left py-6 border-b border-[#2a2a2a] flex items-center justify-between group transition-all duration-500 ${
                  currentSection === section.id ? 'border-[#f5f5dc]/30' : ''
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="flex items-center gap-8">
                  {/* Number */}
                  <span className="font-mono text-xs text-[#6b6b6b] w-8">
                    {section.number}
                  </span>
                  
                  {/* Main Label with RGB effect on hover */}
                  <div className="relative">
                    <span 
                      className={`text-4xl md:text-6xl lg:text-7xl tracking-[0.05em] transition-all duration-300 ${
                        hoveredSection === section.id ? 'text-[#f5f5dc]' : 'text-[#a8a29e]'
                      } ${currentSection === section.id ? 'text-[#f5f5dc]' : ''}`}
                      style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
                    >
                      {section.label}
                    </span>
                    
                    {/* RGB glitch on hover */}
                    {hoveredSection === section.id && (
                      <>
                        <span 
                          className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl tracking-[0.05em] opacity-50 pointer-events-none"
                          style={{ 
                            fontFamily: 'Bebas Neue, Impact, sans-serif',
                            color: '#ff0040',
                            transform: 'translate(3px, 1px)',
                          }}
                        >
                          {section.label}
                        </span>
                        <span 
                          className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl tracking-[0.05em] opacity-50 pointer-events-none"
                          style={{ 
                            fontFamily: 'Bebas Neue, Impact, sans-serif',
                            color: '#00ffff',
                            transform: 'translate(-3px, -1px)',
                          }}
                        >
                          {section.label}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Sublabel & Arrow */}
                <div className="flex items-center gap-6">
                  <span className={`font-mono text-xs tracking-[0.2em] transition-all duration-300 ${
                    hoveredSection === section.id ? 'text-[#a8a29e]' : 'text-[#6b6b6b]'
                  }`}>
                    {section.sublabel}
                  </span>
                  <ChevronRight 
                    size={20} 
                    className={`text-[#6b6b6b] transition-all duration-300 ${
                      hoveredSection === section.id ? 'translate-x-2 text-[#f5f5dc]' : ''
                    }`}
                  />
                </div>
              </button>
            ))}
          </nav>

          {/* Footer info */}
          <div className="mt-16 flex justify-between items-end">
            <div className="font-mono text-[10px] text-[#6b6b6b] tracking-wider leading-relaxed">
              <p>AI-TRONICS HUB</p>
              <p>JIIT NOIDA</p>
              <p>EST. 2020</p>
            </div>
            <div className="font-mono text-[10px] text-[#6b6b6b] tracking-wider text-right">
              <p>SELECT A SECTION</p>
              <p>TO EXPLORE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
