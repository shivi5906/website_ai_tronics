'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface GalleryPhoto {
  id: string
  x: number
  y: number
  depth: number
  src: string
  alt: string
  seed: number
}

const DEPTH_LAYERS = 15
const PHOTOS_PER_LAYER = 25
const VIRTUAL_CANVAS_SIZE = 3000
const PHOTO_SIZE_BASE = 200

// Generate pseudo-random numbers based on seed
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Generate photos across depth layers
const generatePhotos = (): GalleryPhoto[] => {
  const photos: GalleryPhoto[] = []
  let id = 0

  for (let depth = 0; depth < DEPTH_LAYERS; depth++) {
    const photosAtDepth = PHOTOS_PER_LAYER + Math.floor(depth * 1.5)

    for (let i = 0; i < photosAtDepth; i++) {
      const seed = depth * 1000 + i
      const randomX = seededRandom(seed)
      const randomY = seededRandom(seed + 1)
      const randomSeed = seededRandom(seed + 2)

      photos.push({
        id: `photo-${id}`,
        x: randomX * VIRTUAL_CANVAS_SIZE - VIRTUAL_CANVAS_SIZE / 2,
        y: randomY * VIRTUAL_CANVAS_SIZE - VIRTUAL_CANVAS_SIZE / 2,
        depth,
        src: `https://picsum.photos/seed/${Math.floor(randomSeed * 10000)}/600/400?grayscale`,
        alt: `Gallery Photo ${id}`,
        seed: randomSeed,
      })
      id++
    }
  }

  return photos
}

export default function InfiniteGallerySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const photosRef = useRef<GalleryPhoto[]>(generatePhotos())
  
  const [zoom, setZoom] = useState(0) // 0-1 scale, higher = zoomed out
  const [cameraX, setCameraX] = useState(0)
  const [cameraY, setCameraY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null)
  
  // Drag state
  const dragStateRef = useRef({ startX: 0, startY: 0, startCamX: 0, startCamY: 0, isDragging: false })
  
  // Momentum drag
  const momentumRef = useRef({ vx: 0, vy: 0 })

  // Smooth zoom easing
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const section = containerRef.current
      if (!section) return

      // Check if user is scrolling within this section
      const rect = section.getBoundingClientRect()
      if (rect.top > window.innerHeight || rect.bottom < 0) return

      e.preventDefault()

      const zoomDelta = (e.deltaY > 0 ? 1 : -1) * 0.02
      setZoom(prev => Math.max(0, Math.min(1, prev + zoomDelta)))
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      return () => container.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // Handle drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left click
    
    setIsDragging(true)
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startCamX: cameraX,
      startCamY: cameraY,
      isDragging: true,
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStateRef.current.startX
      const deltaY = e.clientY - dragStateRef.current.startY

      // Drag sensitivity based on zoom level
      const dragSensitivity = 1 + zoom * 2
      
      setCameraX(dragStateRef.current.startCamX - deltaX * dragSensitivity)
      setCameraY(dragStateRef.current.startCamY - deltaY * dragSensitivity)

      // Calculate momentum
      momentumRef.current.vx = deltaX * 0.1
      momentumRef.current.vy = deltaY * 0.1
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, cameraX, cameraY, zoom])

  // Momentum animation
  useEffect(() => {
    if (isDragging || (Math.abs(momentumRef.current.vx) < 0.1 && Math.abs(momentumRef.current.vy) < 0.1)) {
      return
    }

    const momentum = setInterval(() => {
      momentumRef.current.vx *= 0.95
      momentumRef.current.vy *= 0.95

      setCameraX(prev => prev - momentumRef.current.vx)
      setCameraY(prev => prev - momentumRef.current.vy)

      if (Math.abs(momentumRef.current.vx) < 0.1 && Math.abs(momentumRef.current.vy) < 0.1) {
        clearInterval(momentum)
      }
    }, 16)

    return () => clearInterval(momentum)
  }, [isDragging])

  // Calculate visible photos
  const getVisiblePhotos = () => {
    const viewportWidth = viewportRef.current?.clientWidth || window.innerWidth
    const viewportHeight = viewportRef.current?.clientHeight || window.innerHeight

    // Zoom from 0 (looking down) to 1 (far away)
    const zoomScale = 1 + zoom * 8
    const visibleWidth = (viewportWidth * zoomScale) / 2
    const visibleHeight = (viewportHeight * zoomScale) / 2

    return photosRef.current.filter(photo => {
      // Depth-based scaling and opacity
      const depthFactor = 1 + (photo.depth / DEPTH_LAYERS) * 3
      
      // Check if photo is within viewport bounds
      const distX = Math.abs(photo.x - cameraX)
      const distY = Math.abs(photo.y - cameraY)

      return (
        distX < visibleWidth + PHOTO_SIZE_BASE * depthFactor &&
        distY < visibleHeight + PHOTO_SIZE_BASE * depthFactor
      )
    })
  }

  const visiblePhotos = getVisiblePhotos()

  // Calculate photo properties based on depth
  const getPhotoStyle = (photo: GalleryPhoto) => {
    const depthFactor = 1 + (photo.depth / DEPTH_LAYERS) * 3
    const scale = 1 / depthFactor
    const opacity = Math.max(0.2, 1 - photo.depth / DEPTH_LAYERS * 0.6)
    
    // 3D perspective positioning
    const offsetX = photo.x - cameraX
    const offsetY = photo.y - cameraY
    const zoomScale = 1 + zoom * 8

    return {
      transform: `
        translate(${offsetX / zoomScale + window.innerWidth / 2}px, ${offsetY / zoomScale + window.innerHeight / 2}px)
        scale(${scale})
        translateZ(${photo.depth * 10}px)
      `,
      opacity,
      zIndex: DEPTH_LAYERS - photo.depth,
    }
  }

  return (
    <section
      ref={containerRef}
      id="infinite-gallery"
      className="relative w-full h-screen overflow-hidden bg-black"
      style={{
        perspective: '1000px',
      }}
    >
      {/* Viewport container */}
      <div
        ref={viewportRef}
        className={`absolute inset-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
      >
        {/* 3D Gallery Canvas */}
        <div
          className="absolute inset-0"
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Photos */}
          {visiblePhotos.map(photo => (
            <div
              key={photo.id}
              className="absolute flex-shrink-0 group"
              style={{
                width: `${PHOTO_SIZE_BASE}px`,
                height: `${PHOTO_SIZE_BASE}px`,
                left: 0,
                top: 0,
                ...getPhotoStyle(photo),
                transition: isDragging ? 'none' : 'transform 0.1s ease-out, opacity 0.1s ease-out',
              }}
              onMouseEnter={() => setHoveredPhoto(photo.id)}
              onMouseLeave={() => setHoveredPhoto(null)}
            >
              {/* Image */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover rounded-lg shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
                style={{
                  filter: hoveredPhoto === photo.id ? 'grayscale(0%) contrast(1.1)' : 'grayscale(100%) contrast(0.9)',
                  transition: 'filter 0.3s ease',
                }}
              />

              {/* Depth overlay */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/40 to-transparent opacity-50 group-hover:opacity-75 transition-opacity duration-300" />

              {/* Label */}
              {hoveredPhoto === photo.id && (
                <div className="absolute inset-0 flex items-end justify-start p-2 rounded-lg">
                  <span className="font-mono text-xs text-cream truncate">
                    Depth: {photo.depth}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <h2 className="glitch-rgb font-sans text-3xl md:text-5xl text-cream tracking-wider" data-text="INFINITE ARCHIVE">
            INFINITE ARCHIVE
          </h2>
          <p className="font-mono text-[#a8a29e] text-sm mt-2 tracking-widest">
            // SCROLL TO ZOOM • DRAG TO EXPLORE
          </p>
        </div>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-8 right-8 font-mono text-sm text-[#a8a29e] tracking-widest pointer-events-none">
        <div>DEPTH: {Math.round(zoom * 100)}%</div>
        <div>PHOTOS: {visiblePhotos.length}</div>
      </div>

      {/* Gradient Overlays for Depth Cueing */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vignette */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_120px_60px_rgba(0,0,0,0.5)]" />
      </div>
    </section>
  )
}
