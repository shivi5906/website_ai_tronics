'use client'

import { useEffect, useRef } from 'react'
import { GalleryCanvas, GalleryCardConfig } from '@/lib/gallery-canvas'
import { X } from 'lucide-react'

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
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const galleryEngineRef = useRef<GalleryCanvas | null>(null)

  // Initialize WebGL infinite depth tunnel instantly on mount
  useEffect(() => {
    // Smooth lock body scroll for full-screen immersive canvas
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100vw'
    document.body.style.height = '100vh'

    if (canvasContainerRef.current) {
      const engine = new GalleryCanvas({
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

      return () => {
        engine.destroy()
        galleryEngineRef.current = null
      }
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
      <div className="fixed top-8 right-8 z-50 pointer-events-none hidden md:block">
        <span 
          className="text-2xl text-[#f5f5dc] tracking-[0.1em]"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          AI-TRONICS
        </span>
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
