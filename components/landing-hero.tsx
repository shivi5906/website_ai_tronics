'use client'

import { useState, useEffect } from 'react'

interface Photo {
  id: number
  src: string
  alt: string
  x: number
  y: number
  width: number
  height: number
  rotate: number
  delay: number
}

// Generate scattered photo positions
const generatePhotos = (): Photo[] => {
  const photos: Photo[] = []
  const positions = [
    { x: 5, y: 8, w: 180, h: 220 },
    { x: 75, y: 5, w: 160, h: 200 },
    { x: 20, y: 55, w: 140, h: 180 },
    { x: 60, y: 40, w: 200, h: 250 },
    { x: 85, y: 60, w: 150, h: 190 },
    { x: 8, y: 75, w: 170, h: 210 },
    { x: 40, y: 80, w: 130, h: 160 },
    { x: 70, y: 85, w: 190, h: 230 },
    { x: 35, y: 15, w: 150, h: 185 },
    { x: 55, y: 70, w: 160, h: 200 },
    { x: 15, y: 35, w: 145, h: 175 },
    { x: 80, y: 30, w: 165, h: 205 },
  ]

  const labels = [
    'HACKATHON 2024', 'WORKSHOP', 'TEAM BUILD', 'CODE NIGHT',
    'AI SUMMIT', 'ROBOTICS', 'NEURAL NET', 'TECH TALK',
    'IDEATION', 'PROTOTYPE', 'DEMO DAY', 'LAUNCH'
  ]

  positions.forEach((pos, i) => {
    photos.push({
      id: i,
      src: `https://picsum.photos/seed/aitronics${i}/${pos.w}/${pos.h}?grayscale`,
      alt: labels[i],
      x: pos.x,
      y: pos.y,
      width: pos.w,
      height: pos.h,
      rotate: (Math.random() - 0.5) * 12,
      delay: Math.random() * 2,
    })
  })

  return photos
}

export default function LandingHero({ onEnter }: { onEnter: () => void }) {
  const [photos] = useState<Photo[]>(generatePhotos)
  const [isReady, setIsReady] = useState(false)
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Grunge overlay */}
      <div className="grunge-overlay" />
      
      {/* Scattered Photos Background */}
      <div className="absolute inset-0">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={`gallery-photo float-photo photo-rgb transition-all duration-700 ${
              isReady ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${photo.x}%`,
              top: `${photo.y}%`,
              width: photo.width,
              height: photo.height,
              transform: `rotate(${photo.rotate}deg) scale(${hoveredPhoto === photo.id ? 1.1 : 1})`,
              transitionDelay: `${photo.delay * 0.3}s`,
              zIndex: hoveredPhoto === photo.id ? 50 : photo.id,
              ['--float-delay' as string]: `${photo.delay}s`,
              ['--rotate' as string]: `${photo.rotate}deg`,
            }}
            onMouseEnter={() => setHoveredPhoto(photo.id)}
            onMouseLeave={() => setHoveredPhoto(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover"
              style={{ filter: 'contrast(1.1) brightness(0.9)' }}
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
        ))}
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
            JIIT NOIDA // EST. 2020
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
          <div className="mt-16 opacity-50">
            <p className="font-mono text-[10px] text-[#6b6b6b] tracking-[0.2em] mb-2">
              SCROLL OR CLICK + DRAG
            </p>
            <div className="flex justify-center gap-1">
              <span className="w-1 h-1 bg-[#6b6b6b] rounded-full animate-pulse" />
              <span className="w-1 h-1 bg-[#6b6b6b] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="w-1 h-1 bg-[#6b6b6b] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Corner branding */}
      <div className="absolute top-6 left-6 z-50">
        <span 
          className="font-mono text-xs text-[#6b6b6b] tracking-[0.3em]"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          AI-TRONICS 2024
        </span>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <span className="font-mono text-xs text-[#6b6b6b] tracking-[0.2em]">
          SOUND ON
        </span>
      </div>

      <div className="absolute bottom-6 left-6 z-50">
        <div className="font-mono text-xs text-[#6b6b6b] leading-relaxed tracking-wider">
          <p>AI-TRONICS</p>
          <p>2024</p>
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
