'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface GalleryImage {
  src: string
  title: string
  date: string
}

const galleryImages: GalleryImage[] = [
  { src: '/events/event1.jpg', title: 'HACKATHON 2024', date: 'MAR 15' },
  { src: '/events/event2.jpg', title: 'AI WORKSHOP', date: 'FEB 28' },
  { src: '/events/event3.jpg', title: 'ROBOTICS DEMO', date: 'JAN 20' },
  { src: '/events/event4.jpg', title: 'NEURAL NETS 101', date: 'DEC 10' },
  { src: '/events/event5.jpg', title: 'TECH SUMMIT', date: 'NOV 05' },
  { src: '/events/event6.jpg', title: 'CODE SPRINT', date: 'OCT 22' },
  { src: '/events/event7.jpg', title: 'ML BOOTCAMP', date: 'SEP 18' },
  { src: '/events/event8.jpg', title: 'IOT FEST', date: 'AUG 30' },
]

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLHeadingElement>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 80%',
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Handle drag scroll
  const handleMouseDown = (ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent) => {
    setIsDragging(true)
    const element = ref.current
    if (!element) return
    
    const startX = e.pageX - element.offsetLeft
    const scrollLeft = element.scrollLeft

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const x = e.pageX - element.offsetLeft
      const walk = (x - startX) * 2
      element.scrollLeft = scrollLeft - walk
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <section ref={sectionRef} id="gallery" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <h2 
          ref={headerRef}
          className="glitch-text font-sans text-4xl md:text-6xl lg:text-7xl text-cream tracking-wider"
          data-text="EVENT ARCHIVE"
        >
          EVENT ARCHIVE
        </h2>
        <p className="font-mono text-[color:var(--muted-foreground)] text-sm mt-4 tracking-widest">
          // DRAG TO EXPLORE • CLICK TO EXPAND
        </p>
      </div>

      {/* Row 1 - Left to Right */}
      <div 
        ref={row1Ref}
        className="mb-4 overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown(row1Ref)}
      >
        <div className="gallery-row">
          {[...galleryImages, ...galleryImages].map((image, index) => (
            <GalleryCard 
              key={`row1-${index}`} 
              image={image} 
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </div>

      {/* Row 2 - Right to Left */}
      <div 
        ref={row2Ref}
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown(row2Ref)}
      >
        <div className="gallery-row-reverse">
          {[...galleryImages.slice().reverse(), ...galleryImages.slice().reverse()].map((image, index) => (
            <GalleryCard 
              key={`row2-${index}`} 
              image={image} 
              onClick={() => setSelectedImage(image)}
            />
          ))}
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
  const [imageError, setImageError] = useState(false)

  return (
    <div 
      className="relative flex-shrink-0 w-72 h-48 md:w-96 md:h-64 mx-2 overflow-hidden group"
      onClick={onClick}
    >
      {!imageError ? (
        <Image
          src={image.src}
          alt={image.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[color:var(--neon-cyan)]/20 to-[color:var(--neon-magenta)]/20 flex items-center justify-center">
          <span className="font-sans text-4xl text-[color:var(--neon-cyan)]">{image.title.charAt(0)}</span>
        </div>
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="font-sans text-xl text-ivory tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {image.title}
        </h3>
        <p className="font-mono text-xs text-[color:var(--neon-cyan)] tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {image.date}
        </p>
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color:var(--neon-cyan)]/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse pointer-events-none" />
    </div>
  )
}

function Lightbox({ image, onClose }: { image: GalleryImage; onClose: () => void }) {
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white hover:text-[color:var(--neon-cyan)] transition-colors"
        onClick={onClose}
      >
        <X size={32} />
      </button>
      
      <div 
        className="relative max-w-4xl w-full aspect-video glitch-text"
        onClick={(e) => e.stopPropagation()}
      >
        {!imageError ? (
          <Image
            src={image.src}
            alt={image.title}
            fill
            className="object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[color:var(--neon-cyan)]/20 to-[color:var(--neon-magenta)]/20 flex flex-col items-center justify-center">
            <span className="font-sans text-8xl text-[color:var(--neon-cyan)] mb-4">{image.title.charAt(0)}</span>
            <span className="font-sans text-2xl text-ivory">{image.title}</span>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
          <h3 className="font-sans text-3xl text-ivory tracking-wider">{image.title}</h3>
          <p className="font-mono text-sm text-[color:var(--neon-cyan)] tracking-widest">{image.date}</p>
        </div>
      </div>
    </div>
  )
}
