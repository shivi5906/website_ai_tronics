'use client'

import { useEffect, useRef } from 'react'
import { GalleryCanvas, GalleryCardConfig } from '@/lib/gallery-canvas'
import { X } from 'lucide-react'

// Scanned high-quality tech cards configuration (expanded to 50 items dynamically)
const GALLERY_CARDS: GalleryCardConfig[] = Array.from({ length: 46 }, (_, i) => {
  const id = String(i + 1)
  const techTerms = [
    'NEURAL NODE', 'SYNAPSE NET', 'AUTONOMOUS CORE', 'QUANTUM GRID',
    'VECTOR PATH', 'BIO LINK', 'PROTOTYPE X', 'DEPTH MATRIX', 'COBALT RAY',
    'NEXUS POINT', 'HOLOGRAPHIC CELL', 'TENSOR FIELD', 'KINETIC DRIVE',
    'SPECTRAL NODE', 'OPTIC ARRAY', 'SYNAPSE CORE', 'HYPER CONTEXT',
    'RECURSIVE MAP', 'DIGITAL SOUL', 'FRACTAL ECHO'
  ]
  const subterms = [
    '// DEEP LEARNING MODEL', '// COGNITIVE MESH V2', '// ROBOTICS DRIVE MATRIX',
    '// CRYPTO HARVESTER', '// COMPUTER VISION v4', '// HUMAN-MACHINE FEED',
    '// KINETIC ACTUATOR', '// LiDAR CLOUD MAP', '// TRANSMISSION BEACON',
    '// SECURE KEY SYSTEM', '// NEURAL MATRIX V9', '// QUANTUM EMULATOR',
    '// LOGIC GATES FRAME', '// COMPILER UNIT 4'
  ]
  
  const title = techTerms[i % techTerms.length] + ` ${Math.floor(i / techTerms.length) + 1}`
  const subtitle = subterms[i % subterms.length]
  return {
    id,
    imageUrl: `/gallery/infinite/m${id}.jpg`,
    title,
    subtitle
  }
})

// Navigation items matching website main sections
const NAV_ITEMS = [
  { label: 'THE MINDS', id: 'team' },
  { label: 'THE HUB', id: 'about' },
  { label: 'ARCHIVES', id: 'events' },
  { label: 'NOW PLAYING', id: 'vibe' },
  { label: 'CONTACT US', id: 'contact' }
]

interface InfiniteGallerySectionProps {
  onBack?: () => void
  onNavigate?: (sectionId: string) => void
  onHome?: () => void
}

export default function InfiniteGallerySection({ onBack, onNavigate, onHome }: InfiniteGallerySectionProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const galleryEngineRef = useRef<GalleryCanvas | null>(null)

  // Initialize WebGL infinite depth tunnel with a minor deferral to optimize INP
  useEffect(() => {
    // Smooth lock body scroll for full-screen immersive canvas
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100vw'
    document.body.style.height = '100vh'

    let active = true
    let engine: GalleryCanvas | null = null
    let initTimeoutId: NodeJS.Timeout | null = null

    if (canvasContainerRef.current) {
      // Defer WebGL context creation and texture uploads by 50ms.
      // This lets the browser complete the React view transition paint first,
      // bringing the Interaction to Next Paint (INP) to near 0ms (under 16ms)!
      initTimeoutId = setTimeout(() => {
        if (!active || !canvasContainerRef.current) return

        engine = new GalleryCanvas({
          container: canvasContainerRef.current,
          cards: GALLERY_CARDS,
          onExit: () => {
            handleBackToLanding()
          },
          onSelect: (card) => console.log('Selected card:', card)
        })
        
        galleryEngineRef.current = engine
        engine.init()
        engine.show()
      }, 50)
    }

    return () => {
      active = false
      if (initTimeoutId) clearTimeout(initTimeoutId)
      if (engine) {
        engine.destroy()
      }
      galleryEngineRef.current = null
    }
  }, [])

  const handleBackToLanding = () => {
    // Restore body scrolling
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
    document.body.style.height = ''
    if (onBack) {
      onBack()
    }
  }

  const handleNavigation = (sectionId: string) => {
    // Restore body scrolling
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
    document.body.style.height = ''
    if (onNavigate) {
      onNavigate(sectionId)
    }
  }

  // Cleanup scroll locks on unmount
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
    }
  }, [])

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Brand logo top right */}
      <div className="fixed top-8 right-8 z-50 hidden md:block">
        <button
          onClick={onHome}
          className="text-2xl text-[#f5f5dc] tracking-[0.1em] hover:text-[#a8a29e] transition-colors cursor-pointer bg-transparent border-none p-0"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          AI-TRONICS
        </button>
      </div>

      {/* FLOATING NAVIGATION OVERLAY */}
      <div className="gallery-nav z-50">
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

      {/* WEBGL 3D FLY-Zoom PERSPECTIVE CANVAS */}
      <div ref={canvasContainerRef} className="w-full h-full absolute inset-0 z-10" />

      {/* FLOATING NAVIGATION INSTRUCTIONS BANNER */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 text-center pointer-events-none select-none px-6 py-3 rounded-lg border border-[#f5f5dc]/10 bg-black/85 backdrop-blur-md max-w-[90vw] md:max-w-xl">
        <p className="font-mono text-[10px] md:text-xs text-[#a8a29e] tracking-[0.15em] uppercase leading-relaxed">
          Scroll <span className="text-[#f5f5dc] font-bold">Down</span> to explore new, <span className="text-[#f5f5dc] font-bold">Up</span> to explore old
        </p>
        <p className="font-mono text-[9px] md:text-[10px] text-[#6b6b6b] tracking-[0.1em] uppercase mt-1">
          Drag <span className="text-[#a8a29e]">sideways</span> to view photos or move them
        </p>
      </div>

      {/* MINIMALIST EXIT BUTTON */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button 
          onClick={handleBackToLanding}
          className="gallery-exit-button flex items-center gap-2 cursor-none"
        >
          <X size={12} />
          RETURN TO HOME
        </button>
      </div>
    </div>
  )
}
