'use client'

import { useEffect, useRef, useState } from 'react'
import { GalleryCanvas, GalleryCardConfig } from '@/lib/gallery-canvas'
import { ArrowDown, ArrowUp, X } from 'lucide-react'

// Scanned high-quality tech cards configuration
const GALLERY_CARDS: GalleryCardConfig[] = [
  { id: '1', imageUrl: 'https://picsum.photos/seed/cyber1/600/400?grayscale', title: 'NEURAL NODE', subtitle: '// DEEP LEARNING MODEL' },
  { id: '2', imageUrl: 'https://picsum.photos/seed/cyber2/600/400?grayscale', title: 'SYNAPSE NET', subtitle: '// COGNITIVE MESH V2' },
  { id: '3', imageUrl: 'https://picsum.photos/seed/cyber3/600/400?grayscale', title: 'AUTONOMOUS CORE', subtitle: '// ROBOTICS DRIVE MATRIX' },
  { id: '4', imageUrl: 'https://picsum.photos/seed/cyber4/600/400?grayscale', title: 'QUANTUM GRID', subtitle: '// CRYPTO HARVESTER' },
  { id: '5', imageUrl: 'https://picsum.photos/seed/cyber5/600/400?grayscale', title: 'VECTOR PATH', subtitle: '// COMPUTER VISION v4' },
  { id: '6', imageUrl: 'https://picsum.photos/seed/cyber6/600/400?grayscale', title: 'BIO LINK', subtitle: '// HUMAN-MACHINE FEED' },
  { id: '7', imageUrl: 'https://picsum.photos/seed/cyber7/600/400?grayscale', title: 'PROTOTYPE X', subtitle: '// KINETIC ACTUATOR' },
  { id: '8', imageUrl: 'https://picsum.photos/seed/cyber8/600/400?grayscale', title: 'DEPTH MATRIX', subtitle: '// LiDAR CLOUD MAP' },
  { id: '9', imageUrl: 'https://picsum.photos/seed/cyber9/600/400?grayscale', title: 'COBALT RAY', subtitle: '// TRANSMISSION BEACON' }
]

// Navigation items matching website main sections
const NAV_ITEMS = [
  { label: 'THE MINDS', id: 'team' },
  { label: 'THE HUB', id: 'about' },
  { label: 'ARCHIVES', id: 'events' },
  { label: 'NOW PLAYING', id: 'vibe' },
  { label: 'TRANSMIT', id: 'contact' }
]

interface InfiniteGallerySectionProps {
  onBack?: () => void
  onNavigate?: (sectionId: string) => void
}

export default function InfiniteGallerySection({ onBack, onNavigate }: InfiniteGallerySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const galleryEngineRef = useRef<GalleryCanvas | null>(null)
  
  const [isLocked, setIsLocked] = useState(false)
  const [hasScrolledInit, setHasScrolledInit] = useState(false)

  // Initialize the gallery engine
  useEffect(() => {
    if (canvasContainerRef.current && isLocked) {
      const engine = new GalleryCanvas({
        container: canvasContainerRef.current,
        cards: GALLERY_CARDS,
        onExit: () => handleUnlock(),
        onSelect: (card) => console.log('Selected card:', card)
      })
      
      galleryEngineRef.current = engine
      engine.init()
      engine.show()

      return () => {
        engine.destroy()
        galleryEngineRef.current = null
      }
    }
  }, [isLocked])

  // Scroll Trigger handling for transition
  useEffect(() => {
    const handleScrollAttempt = (e: WheelEvent) => {
      // If canvas is already active, intercept scrolls to exit when scrolling UP
      if (isLocked) {
        if (e.deltaY < -25) { // Substantial scroll up
          handleUnlock()
        }
        return
      }

      // If canvas is not active, scrolling DOWN triggers the lock
      if (e.deltaY > 20) {
        handleLock()
      }
    };

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleScrollAttempt, { passive: false })
      return () => container.removeEventListener('wheel', handleScrollAttempt)
    }
  }, [isLocked])

  // Touch triggers for mobile compatibility
  const touchStartY = useRef(0)
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY
    const diff = touchY - touchStartY.current

    if (isLocked) {
      if (diff > 50) { // Swipe down = scroll up = unlock
        handleUnlock()
      }
    } else {
      if (diff < -50) { // Swipe up = scroll down = lock
        handleLock()
      }
    }
  }

  const handleLock = () => {
    setIsLocked(true)
    setHasScrolledInit(true)
    
    // Apply body scroll locking smoothly
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100vw'
    document.body.style.height = '100vh'
  }

  const handleUnlock = () => {
    setIsLocked(false)
    
    // Restore body scrolling
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
    document.body.style.height = ''
  }

  const handleNavigation = (sectionId: string) => {
    handleUnlock()
    if (onNavigate) {
      onNavigate(sectionId)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Ensure scrolling is always restored when leaving the section
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#0a0a0a] flex flex-col justify-between overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Grunge & Overlay effects */}
      <div className="grunge-overlay opacity-5" />
      <div className="scanlines opacity-10" />

      {/* HEADER SECTION (SCROLLABLE INTRO) */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-16 flex-1 flex flex-col justify-center">
        {/* Back to menu button */}
        {onBack && (
          <button
            onClick={onBack}
            className="fixed top-8 left-8 z-50 font-mono text-xs text-[#a8a29e] hover:text-[#f5f5dc] tracking-[0.2em] transition-colors flex items-center gap-2 cursor-none"
          >
            <span className="text-lg">←</span> RETURN
          </button>
        )}

        {/* Brand logo top right */}
        <div className="fixed top-8 right-8 z-50">
          <span 
            className="text-2xl text-[#f5f5dc] tracking-[0.1em]"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
          >
            AI-TRONICS
          </span>
        </div>

        <div className="space-y-6 max-w-3xl">
          <span className="font-mono text-xs text-stone tracking-[0.4em] uppercase block">
            06 / ARCHIVE LABS
          </span>
          <h1 
            className="glitch-rgb text-6xl md:text-8xl text-cream tracking-tight leading-[0.9] font-bold"
            data-text="INFINITE SPACE"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
          >
            INFINITE SPACE
          </h1>
          <p className="font-mono text-sm md:text-base text-stone leading-relaxed">
            Welcome to the floating antigravity intelligence archives. 
            Scroll down to lock into the zero-gravity liquid workspace where core technology concepts repel from your presence, float on inertia, and respond to your direct momentum.
          </p>
        </div>
      </div>

      {/* SCROLL TRIGGER HINT */}
      <div className="w-full flex flex-col items-center pb-12 animate-pulse">
        <span className="font-mono text-[10px] text-stone tracking-[0.3em] uppercase mb-2">
          Scroll Down to Initiate Canvas
        </span>
        <ArrowDown className="text-cream w-4 h-4 animate-bounce" />
      </div>

      {/* FLOATING ANTIGRAVITY CANVAS OVERLAY */}
      <div className={`gallery-canvas-wrapper ${isLocked ? 'active' : ''}`}>
        {/* FLOATING NAVIGATION OVERLAY */}
        <div className="gallery-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className="gallery-nav-link"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CANVAS INTERACTIVE PORTAL */}
        <div ref={canvasContainerRef} className="gallery-canvas" />

        {/* EXIT CONTROL HINT & BUTTON */}
        <div className="gallery-exit-indicator">
          <button 
            onClick={handleUnlock}
            className="gallery-exit-button flex items-center gap-2 cursor-none"
          >
            <X size={12} />
            EXIT LABS
          </button>
          <span className="font-mono text-[9px] text-stone tracking-[0.2em] uppercase mt-2 hidden md:block">
            <ArrowUp className="inline w-3 h-3 mr-1 animate-bounce" />
            Scroll Up to Exit
          </span>
        </div>
      </div>
    </div>
  )
}
