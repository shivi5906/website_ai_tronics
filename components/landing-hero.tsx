'use client'

import { useState, useEffect, useRef } from 'react'

interface Position {
  x: number
  y: number
  w: number
  h: number
}

interface Photo {
  id: number
  src: string
  alt: string
  desktop: Position
  tablet: Position
  mobile: Position
  rotate: number
  delay: number
}

// Generate scattered photo positions
const generatePhotos = (): Photo[] => {
  const photos: Photo[] = []
  const collagePositions = [
    // ROW 1
    { x: 5, y: 5, w: 160, h: 200 },     // Photo 0
    { x: 22, y: 8, w: 150, h: 190 },    // Photo 1
    { x: 42, y: 4, w: 170, h: 210 },    // Photo 2
    { x: 62, y: 8, w: 155, h: 195 },    // Photo 3
    { x: 78, y: 5, w: 165, h: 205 },    // Photo 4
    // ROW 2
    { x: 8, y: 35, w: 170, h: 210 },    // Photo 5
    { x: 28, y: 38, w: 160, h: 200 },   // Photo 6
    { x: 52, y: 32, w: 180, h: 220 },   // Photo 7
    { x: 72, y: 36, w: 160, h: 200 },   // Photo 8
    // ROW 3
    { x: 12, y: 65, w: 165, h: 205 },   // Photo 9
    { x: 35, y: 68, w: 175, h: 215 },   // Photo 10
    { x: 65, y: 62, w: 180, h: 220 },   // Photo 11
  ]

  const labels = [
    'HACKATHON 2025', 'WORKSHOP', 'TEAM BUILD', 'CODE NIGHT',
    'AI SUMMIT', 'ROBOTICS', 'NEURAL NET', 'TECH TALK',
    'IDEATION', 'PROTOTYPE', 'DEMO DAY', 'LAUNCH'
  ]

  labels.forEach((label, i) => {
    photos.push({
      id: i,
      src: `/gallery/landing/photo${i}.jpg`,
      alt: label,
      desktop: collagePositions[i],
      tablet: collagePositions[i],
      mobile: collagePositions[i],
      rotate: (Math.random() - 0.5) * 12,
      delay: Math.random() * 2,
    })
  })

  // Randomly shuffle the photos to change the order every page refresh/reload
  const shuffled = [...photos].sort(() => Math.random() - 0.5)
  return shuffled
}

interface LandingHeroProps {
  onEnter: () => void
  onScrollDown?: () => void
  isMuted?: boolean
  onToggleMute?: () => void
}

export default function LandingHero({ onEnter, onScrollDown, isMuted = false, onToggleMute }: LandingHeroProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isReady, setIsReady] = useState(false)
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [photoOffsets, setPhotoOffsets] = useState<{[key: number]: {x: number, y: number}}>({})
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  const touchStartY = useRef(0)
  
  // High-performance drag references to bypass React re-renders on mousemove
  const draggedPhotoIdRef = useRef<number | null>(null)
  const draggedElementRef = useRef<HTMLElement | null>(null)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const dragStartOffsetRef = useRef({ x: 0, y: 0 })
  const photoOffsetsRef = useRef<{[key: number]: {x: number, y: number}}>({})

  useEffect(() => {
    setPhotos(generatePhotos())
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setBreakpoint('mobile')
      } else if (width < 1024) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Desktop wheel scroll down to open sections menu
  useEffect(() => {
    if (!onScrollDown) return

    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 20) {
        onScrollDown()
      }
    }

    window.addEventListener('wheel', handleScroll, { passive: true })
    return () => window.removeEventListener('wheel', handleScroll)
  }, [onScrollDown])

  // Mobile swipe up (scroll down) to open sections menu
  useEffect(() => {
    if (!onScrollDown) return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touchY = e.touches[0].clientY
        const diff = touchY - touchStartY.current
        if (diff < -40) { // Swipe up
          onScrollDown()
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [onScrollDown])

  const handlePhotoMouseDown = (photoId: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    draggedPhotoIdRef.current = photoId
    draggedElementRef.current = e.currentTarget
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    
    const currentOffset = photoOffsets[photoId] || { x: 0, y: 0 }
    dragStartOffsetRef.current = currentOffset
    
    // Sync current offset to ref map
    photoOffsetsRef.current[photoId] = currentOffset
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const activeId = draggedPhotoIdRef.current
      const element = draggedElementRef.current
      if (activeId === null || !element) return

      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y

      const newX = dragStartOffsetRef.current.x + deltaX * 0.5
      const newY = dragStartOffsetRef.current.y + deltaY * 0.5

      photoOffsetsRef.current[activeId] = { x: newX, y: newY }

      const photo = photos.find(p => p.id === activeId)
      const rotate = photo ? photo.rotate : 0

      // Hardware accelerated translation
      element.style.transform = `rotate(${rotate}deg) scale(1.1) translate(${newX}px, ${newY}px)`
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      const activeId = draggedPhotoIdRef.current
      if (activeId !== null) {
        // Sync final values back to React state exactly once
        const finalOffset = photoOffsetsRef.current[activeId] || { x: 0, y: 0 }
        setPhotoOffsets(prev => ({
          ...prev,
          [activeId]: finalOffset
        }))
      }
      draggedPhotoIdRef.current = null
      draggedElementRef.current = null
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, photos])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Grunge overlay */}
      <div className="grunge-overlay" />
      
      {/* Central Backing Collage Rectangle (z-20, strictly behind foreground z-40) */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none pt-24 pb-20">
        <div 
          className="relative w-[95%] max-w-5xl h-[65vh] border border-[#f5f5dc]/5 bg-black/15 backdrop-blur-[0.5px] pointer-events-auto overflow-y-auto scrollbar-none rounded-lg p-6 md:p-8 flex flex-wrap justify-center items-center gap-4 md:gap-6"
        >
          {photos.map((photo) => {
          const offset = photoOffsets[photo.id] || { x: 0, y: 0 }
          const pos = photo[breakpoint]
          
          return (
            <div
              key={photo.id}
              className={`gallery-photo float-photo photo-rgb transition-all flex-shrink-0 w-28 h-36 sm:w-36 sm:h-48 md:w-40 md:h-52 ${
                isDragging && hoveredPhoto === photo.id ? '' : 'duration-700'
              } ${isReady ? 'opacity-100' : 'opacity-0'} ${
                hoveredPhoto === photo.id ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
              }`}
              style={{
                transform: `rotate(${photo.rotate}deg) scale(${hoveredPhoto === photo.id ? 1.15 : 1}) translate(${offset.x}px, ${offset.y}px)`,
                transitionDelay: isDragging ? '0s' : `${photo.delay * 0.3}s`,
                zIndex: hoveredPhoto === photo.id ? 30 : photo.id,
                opacity: hoveredPhoto === photo.id || isDragging ? 0.85 : 0.13,
                transitionProperty: 'opacity, transform, z-index',
                transitionDuration: '0.4s',
                ['--float-delay' as string]: `${photo.delay}s`,
                ['--rotate' as string]: `${photo.rotate}deg`,
              }}
              onMouseEnter={() => setHoveredPhoto(photo.id)}
              onMouseLeave={() => {
                if (!isDragging) {
                  setHoveredPhoto(null)
                }
              }}
              onMouseDown={handlePhotoMouseDown(photo.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover select-none"
                style={{ filter: 'contrast(1.1) brightness(0.9)' }}
                draggable={false}
                decoding="async"
                onError={(e) => {
                  const img = e.currentTarget;
                  
                  // Avoid infinite loop if all options fail
                  if (img.dataset.failedCount === '5') return;
                  
                  const count = parseInt(img.dataset.failedCount || '0', 10);
                  img.dataset.failedCount = String(count + 1);

                  // Extract base URL path (e.g. /gallery/landing/photo1)
                  const basePath = `/gallery/landing/photo${photo.id}`;
                  
                  const fallbacks = [
                    `${basePath}.JPG`,
                    `${basePath}.jpeg`,
                    `${basePath}.JPEG`,
                    `${basePath}.png`,
                    `https://picsum.photos/seed/aitronics${photo.id}/${pos.w}/${pos.h}?grayscale` // ultimate placeholder backup
                  ];
                  
                  if (count < fallbacks.length) {
                    img.src = fallbacks[count];
                  }
                }}
              />
              {/* Photo label overlay */}
              <div className={`absolute inset-0 flex items-end justify-start p-3 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
                hoveredPhoto === photo.id ? 'opacity-100' : 'opacity-0'
              }`}>
                <span className="font-mono text-xs text-[#f5f5dc] tracking-wider">
                  {photo.alt}
                </span>
              </div>
            </div>
          )
        })}
        </div>
      </div>

      {/* Center Content */}
      <div className="absolute inset-0 flex items-center justify-center z-40">
        <div className="text-center px-4">
          {/* Main Title with RGB Glitch */}
          <div className="relative mb-4">
            <h1 
              className="glitch-rgb text-7xl md:text-[10rem] lg:text-[12rem] font-bold tracking-tight text-[#f5f5dc] drip-text"
              data-text="AI-TRONICS"
              style={{ 
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                textShadow: '4px 4px 0 rgba(0,0,0,0.5)',
                lineHeight: 0.9,
              }}
            >
              AI-TRONICS
              {/* Drips */}
              <span className="drip" />
              <span className="drip" />
              <span className="drip" />
              <span className="drip" />
              <span className="drip" />
            </h1>
          </div>

          {/* Subtitle */}
          <p className="font-mono text-xs md:text-sm text-[#a8a29e] tracking-[0.5em] uppercase mb-2">
            A Society of Minds Building Tomorrow
          </p>
          <p className="font-mono text-[10px] text-[#6b6b6b] tracking-[0.3em] mb-12">
            JIIT NOIDA // EST. 2025
          </p>

          {/* Enter Button */}
          <button
            onClick={onEnter}
            className="group relative px-12 py-5 border border-[#f5f5dc]/30 bg-transparent overflow-hidden transition-all duration-500 hover:border-[#f5f5dc]/60"
          >
            {/* Button background fill on hover */}
            <span className="absolute inset-0 bg-[#f5f5dc] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            
            <span 
              className="relative font-mono text-sm tracking-[0.4em] text-[#f5f5dc] group-hover:text-[#0a0a0a] transition-colors duration-300"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.25rem' }}
            >
              ENTER THE SOCIETY
            </span>
          </button>

          {/* Scroll indicator */}
          <div 
            onClick={onScrollDown}
            className="mt-16 opacity-50 cursor-pointer hover:opacity-100 hover:text-cream transition-all duration-300"
          >
            <p className="font-mono text-[10px] text-[#6b6b6b] tracking-[0.2em] mb-2 uppercase">
              Scroll or Click to Enter Menu
            </p>
            <p className="funky-credit text-[13px] uppercase tracking-[0.15em] mt-1">
              // DESIGNED & ENGINEERED BY SHIVAM SHARMA ~ shivi
            </p>
          </div>
        </div>
      </div>

      {/* Corner branding */}
      <div className="absolute top-6 left-6 z-50">
        <span 
          className="font-mono text-xs text-[#6b6b6b] tracking-[0.3em]"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          AI-TRONICS 2025
        </span>
      </div>

      <button 
        onClick={onToggleMute}
        className="absolute top-6 right-6 z-50 font-mono text-xs tracking-[0.2em] transition-all duration-300 flex items-center gap-2 cursor-pointer p-2 bg-transparent border-none text-[#a8a29e] hover:text-[#f5f5dc]"
      >
        {isMuted ? (
          <>
            <span className="w-1.5 h-1.5 bg-[#ff0040] rounded-full animate-ping" />
            SOUND OFF
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 bg-[#00ffff] rounded-full animate-pulse" />
            SOUND ON
          </>
        )}
      </button>

      <div className="absolute bottom-6 left-6 z-50">
        <div className="font-mono text-xs text-[#6b6b6b] leading-relaxed tracking-wider">
          <p>AI-TRONICS</p>
          <p>2025</p>
          <p>JIIT NOIDA</p>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-50">
        <span 
          className="font-mono text-xs text-[#6b6b6b] tracking-[0.2em]"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          SCROLL / DRAG
        </span>
      </div>
    </div>
  )
}
