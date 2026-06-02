'use client'

import { useEffect, useState, useRef } from 'react'
import { X } from 'lucide-react'

interface GalleryImage {
  src: string
  title: string
  date: string
  description: string
}

const galleryImages: GalleryImage[] = [
  { 
    src: '/gallery/events/orientation.jpg', 
    title: 'Orientation 2025', 
    date: '17th Sept 2025',
    description: 'Welcome to AI Tronics Orientation 2025 , where we talk less “assignments due” and more AI, ML, Robotics, Cybersecurity, IoT, UAV/Drones & Image Processing '
  },
  { 
    src: '/gallery/events/c_lang.jpeg', 
    title: 'CPP Workshop Online ', 
    date: '17th Jan 2026',
    
    description: 'The C++ Workshop provided an engaging introduction to programming concepts and problem-solving techniques. Participants explored core C++ fundamentals through live coding sessions and practical examples. The event helped students strengthen their coding skills and develop a deeper understanding of software development.\n\nMODE Online '
    
  },
  { 
    src: '/gallery/events/innovate.jpeg', 
    title: 'INNOVATE 1.0 ', 
    date: '11th - 12th Nov 2025',
    description: 'A combined workshop for both the CYBER SEC and the FPGA . In a world where every click, connection, and line of code is a doorway — security isn’t optional, it’s essential.Cyber-attacks are evolving, digital threats are rising, and tomorrow’s defenders are being shaped today. The world is moving beyond software — and now, hardware intelligence is taking center stage.FPGA technology is powering cutting-edge AI systems, autonomous robotics, secure computing, and real-time innovations across the globe.'},
  { 
    src: '/gallery/events/fpga.jpg', 
    title: 'FPGA WORKSHOP - INNOVATE 1.0', 
    date: '11th - 12th Nov 2025',
    description: 'FPGA technology is powering cutting-edge AI systems, autonomous robotics, secure computing, and real-time innovations across the globe.'
  },
  { 
    src: '/gallery/events/cyberSEC.jpg', 
    title: 'CYBER SECURITY WORKSHOP - INNOVATE 1.0', 
    date: '11th - 12th Nov 2025',
    description: 'In a world where every click, connection, and line of code is a doorway — security isn’t optional, it’s essential.Cyber-attacks are evolving, digital threats are rising, and tomorrow’s defenders are being shaped today.'},
  { 
    src: '/gallery/events/arvr.jpg', 
    title: 'AR VR WORKSHOP ', 
    date: '17th Jan 2026',
    description: 'Some moments from an exciting AR/VR Workshop! 🥽✨Conducted by @chhavigg (founder, BharatXR) in collaboration with SnapAR 🤝A session filled with learning, innovation, and future tech vibes'
  },
  { 
    src: '/gallery/events/MLWORK.jpg', 
    title: 'ML ONLINE WORKSHOP ', 
    date: '24th - 25th Jan 2026',
    description: ' MODE : ONLINE \n\nIntensive multi-day training session tracking regression, classification systems, clustering algorithms, feature engineering pipelines, and real-world deployment practices.'
  },
  { 
    src: '/gallery/events/kark.jpeg', 
    title: 'KRAKEN’X HACKATHON ', 
    date: '24th - 25th April 2026',
    description: 'AI/ML × Aitronics presents Kraken’X Hackathon 2026 🤝⚡Get ready for two days of intense building, innovation, and competition on 24–25 April. With a prize pool of ₹40,000, this hackathon brings together some of the most impactful domains — Finance, Cybersecurity, Healthcare, and Agriculture.'
  },
  { 
    src: '/gallery/events/digital.jpg', 
    title: 'DIGITAL CITY ESCAPE', 
    date: '11TH April 2026',
    description: ' Locked in a digital maze of codes & chaos…Only the smartest escape.Will you? '
  }
]

interface EventsSectionProps {
  onBack: () => void
  onHome?: () => void
}

export default function EventsSection({ onBack, onHome }: EventsSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  const isInteractingRow1 = useRef(false)
  const isInteractingRow2 = useRef(false)
  const isDraggingActive = useRef(false)

  const dragStart1 = useRef({ x: 0, scrollLeft: 0 })
  const dragStart2 = useRef({ x: 0, scrollLeft: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Immersive infinite marquee auto-scroll effect
  useEffect(() => {
    let animationFrameId: number
    const speed = 0.85 // Smooth constant pixels-per-frame speed

    const updateScroll = () => {
      // Row 1: Left to Right (increasing scrollLeft)
      if (row1Ref.current && !isInteractingRow1.current) {
        const el = row1Ref.current
        const oneThird = el.scrollWidth / 3
        el.scrollLeft += speed
        if (el.scrollLeft >= oneThird * 2) {
          el.scrollLeft -= oneThird
        }
      }

      // Row 2: Right to Left (decreasing scrollLeft)
      if (row2Ref.current && !isInteractingRow2.current) {
        const el = row2Ref.current
        const oneThird = el.scrollWidth / 3
        el.scrollLeft -= speed
        if (el.scrollLeft <= oneThird) {
          el.scrollLeft += oneThird
        }
      }

      animationFrameId = requestAnimationFrame(updateScroll)
    }

    // Set initial scroll offsets to the center set to allow infinite scroll both ways
    const initTimer = setTimeout(() => {
      if (row1Ref.current) {
        const el = row1Ref.current
        el.scrollLeft = el.scrollWidth / 3
      }
      if (row2Ref.current) {
        const el = row2Ref.current
        el.scrollLeft = el.scrollWidth / 3
      }
    }, 200)

    animationFrameId = requestAnimationFrame(updateScroll)

    return () => {
      clearTimeout(initTimer)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Unified high-performance drag-to-scroll handler
  const handleDragStart = (
    rowRef: React.RefObject<HTMLDivElement | null>,
    dragStartRef: React.MutableRefObject<{ x: number; scrollLeft: number }>,
    interactingRef: React.MutableRefObject<boolean>
  ) => (e: React.MouseEvent) => {
    const el = rowRef.current
    if (!el) return

    interactingRef.current = true
    isDraggingActive.current = false

    // Prevent browser default ghost image drag
    e.preventDefault()

    dragStartRef.current = {
      x: e.clientX,
      scrollLeft: el.scrollLeft
    }

    const handleDragMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragStartRef.current.x
      
      // If moved more than 5px, flag as active drag to prevent opening lightbox
      if (Math.abs(deltaX) > 5) {
        isDraggingActive.current = true
      }

      el.scrollLeft = dragStartRef.current.scrollLeft - deltaX

      // Seamless mathematical wrap during dragging
      const oneThird = el.scrollWidth / 3
      if (el.scrollLeft >= oneThird * 2) {
        el.scrollLeft -= oneThird
        dragStartRef.current.scrollLeft -= oneThird
      } else if (el.scrollLeft <= oneThird) {
        el.scrollLeft += oneThird
        dragStartRef.current.scrollLeft += oneThird
      }
    }

    const handleDragEnd = () => {
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
      
      // Keep interacting = true for a tiny split second to prevent autoscroll jumping
      setTimeout(() => {
        interactingRef.current = false
      }, 500)
    }

    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
  }

  return (
    <section className="min-h-screen bg-[#0a0a0a] relative overflow-y-auto max-h-screen scrollbar-thin portal-enter">
      {/* Grunge overlay */}
      <div className="grunge-overlay" />

      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-8 left-8 z-50 font-mono text-xs tracking-[0.2em] transition-all duration-300 flex items-center gap-2 bg-[#0a0a0a] border border-[#f5f5dc]/20 px-4 py-2 hover:bg-[#f5f5dc] hover:text-[#0a0a0a] hover:border-[#f5f5dc] text-[#f5f5dc] shadow-lg shadow-black/40 hover:shadow-[#f5f5dc]/10 rounded-sm"
      >
        <span className="text-lg">←</span> BACK
      </button>

      {/* Header */}
      <div className="fixed top-8 right-8 z-50 hidden md:block">
        <button
          onClick={onHome}
          className="text-2xl text-[#f5f5dc] tracking-[0.1em] hover:text-[#a8a29e] transition-colors cursor-pointer bg-transparent border-none p-0"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          AI-TRONICS
        </button>
      </div>

      <div className="pt-32 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto mb-12">
          {/* Section Header */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="font-mono text-xs text-[#6b6b6b] tracking-[0.4em] mb-4 uppercase">
              03 / Archives
            </p>
            <h2 
              className="glitch-rgb text-5xl md:text-7xl lg:text-8xl text-[#f5f5dc] tracking-tight drip-text"
              data-text="EVENT ARCHIVE"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
            >
              EVENT ARCHIVE
              <span className="drip" />
              <span className="drip" />
              <span className="drip" />
            </h2>
            <p className="font-mono text-xs text-[#6b6b6b] mt-6 tracking-[0.2em]">
              // DRAG TO EXPLORE • CLICK TO EXPAND
            </p>
          </div>
        </div>
      </div>

      {/* Row 1 - Left to Right */}
      <div className={`mb-4 overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div 
          ref={row1Ref}
          className="flex overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleDragStart(row1Ref, dragStart1, isInteractingRow1)}
          onTouchStart={() => { isInteractingRow1.current = true }}
          onTouchEnd={() => { setTimeout(() => { isInteractingRow1.current = false }, 1000) }}
          onMouseEnter={() => { isInteractingRow1.current = true }}
          onMouseLeave={() => { if (!isDraggingActive.current) isInteractingRow1.current = false }}
        >
          <div className="flex">
            {[...galleryImages, ...galleryImages, ...galleryImages].map((image, index) => (
              <GalleryCard 
                key={`row1-${index}`} 
                image={image} 
                onClick={() => {
                  if (isDraggingActive.current) return
                  setSelectedImage(image)
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 - Right to Left */}
      <div className={`overflow-hidden transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div 
          ref={row2Ref}
          className="flex overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleDragStart(row2Ref, dragStart2, isInteractingRow2)}
          onTouchStart={() => { isInteractingRow2.current = true }}
          onTouchEnd={() => { setTimeout(() => { isInteractingRow2.current = false }, 1000) }}
          onMouseEnter={() => { isInteractingRow2.current = true }}
          onMouseLeave={() => { if (!isDraggingActive.current) isInteractingRow2.current = false }}
        >
          <div className="flex">
            {[...galleryImages.slice().reverse(), ...galleryImages.slice().reverse(), ...galleryImages.slice().reverse()].map((image, index) => (
              <GalleryCard 
                key={`row2-${index}`} 
                image={image} 
                onClick={() => {
                  if (isDraggingActive.current) return
                  setSelectedImage(image)
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </section>
  )
}

function GalleryCard({ image, onClick }: { image: GalleryImage; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative flex-shrink-0 w-72 h-48 md:w-96 md:h-64 mx-2 overflow-hidden cursor-pointer photo-rgb"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.title}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isHovered ? 'scale-110 grayscale-0' : 'grayscale'
        }`}
      />
      
      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 flex flex-col justify-end p-4 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <h3 
          className="text-xl text-[#f5f5dc] tracking-[0.1em] transform translate-y-4 transition-transform duration-300"
          style={{ 
            fontFamily: 'Bebas Neue, Impact, sans-serif',
            transform: isHovered ? 'translateY(0)' : 'translateY(16px)'
          }}
        >
          {image.title}
        </h3>
        <p 
          className="font-mono text-xs text-[#a8a29e] tracking-[0.2em] transition-all duration-300"
          style={{ 
            transform: isHovered ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: '0.05s'
          }}
        >
          {image.date}
        </p>
      </div>
    </div>
  )
}

function Lightbox({ image, onClose }: { image: GalleryImage; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div 
      className="fixed inset-0 bg-[#0a0a0a]/98 z-[200] flex items-center justify-center p-4 md:p-8 overflow-y-auto"
      onClick={onClose}
    >
      <button 
        className="fixed top-8 right-8 text-[#a8a29e] hover:text-[#f5f5dc] transition-colors z-[210] p-2"
        onClick={onClose}
      >
        <X size={28} />
      </button>
      
      <div 
        className="relative max-w-6xl w-full bg-[#0d0d0d] border border-[#2a2a2a] p-5 md:p-8 rounded-none shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grid layout for image and details card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
          {/* Left / Top: Image Box */}
          <div className="lg:col-span-8 flex items-center justify-center bg-black/40 border border-[#1a1a1a] overflow-hidden aspect-[3/2] lg:aspect-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.title}
              className="w-full h-full object-cover lg:object-contain select-none"
              style={{ filter: 'grayscale(30%) contrast(1.1)' }}
              draggable={false}
            />
          </div>
          
          {/* Right / Bottom: Description Card */}
          <div className="lg:col-span-4 flex flex-col justify-between p-4 md:p-6 bg-gradient-to-br from-[#121212] to-[#0a0a0a] border border-[#2a2a2a] relative">
            <div className="space-y-4">
              <span className="font-mono text-[10px] text-[#6b6b6b] tracking-[0.3em] uppercase block">
                CLASSIFIED ARCHIVES // DATA FILE
              </span>
              
              <h3 
                className="text-3xl md:text-4xl text-[#f5f5dc] tracking-[0.05em] leading-tight"
                style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
              >
                {image.title}
              </h3>
              
              <div className="flex items-center gap-2 py-1 border-y border-[#2a2a2a]">
                <span className="font-mono text-[10px] text-[#6b6b6b] tracking-wider uppercase">DATE FILED:</span>
                <span className="font-mono text-[10px] text-[#a8a29e] tracking-wider">{image.date}</span>
              </div>
              
              <p className="font-mono text-xs md:text-sm text-[#a8a29e] leading-relaxed pt-2">
                {image.description}
              </p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-[#1a1a1a] flex justify-between items-center font-mono text-[9px] text-[#3a3a3a] tracking-wider">
              <span>STATUS: ARCHIVED</span>
              <span>AI-TRONICS SOC.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
