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
  { src: 'https://picsum.photos/seed/gallery1/600/400?grayscale', title: 'HACKATHON 2024', date: 'MAR 15' },
  { src: 'https://picsum.photos/seed/gallery2/600/400?grayscale', title: 'AI WORKSHOP', date: 'FEB 28' },
  { src: 'https://picsum.photos/seed/gallery3/600/400?grayscale', title: 'ROBOTICS DEMO', date: 'JAN 20' },
  { src: 'https://picsum.photos/seed/gallery4/600/400?grayscale', title: 'NEURAL NETS 101', date: 'DEC 10' },
  { src: 'https://picsum.photos/seed/gallery5/600/400?grayscale', title: 'TECH SUMMIT', date: 'NOV 05' },
  { src: 'https://picsum.photos/seed/gallery6/600/400?grayscale', title: 'CODE SPRINT', date: 'OCT 22' },
  { src: 'https://picsum.photos/seed/gallery7/600/400?grayscale', title: 'ML BOOTCAMP', date: 'SEP 18' },
  { src: 'https://picsum.photos/seed/gallery8/600/400?grayscale', title: 'IOT FEST', date: 'AUG 30' },
]

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLHeadingElement>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)
  const row1InnerRef = useRef<HTMLDivElement>(null)
  const row2InnerRef = useRef<HTMLDivElement>(null)

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
    const element = ref.current
    if (!element) return
    
    const startX = e.pageX
    const scrollLeft = element.scrollLeft
    let isDragging = true

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging) return
      moveEvent.preventDefault()
      const x = moveEvent.pageX - startX
      element.scrollLeft = scrollLeft - x
    }

    const handleMouseUp = () => {
      isDragging = false
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
          className="glitch-rgb font-sans text-4xl md:text-6xl lg:text-7xl text-cream tracking-wider"
          data-text="EVENT ARCHIVE"
        >
          EVENT ARCHIVE
        </h2>
        <p className="font-mono text-[#a8a29e] text-sm mt-4 tracking-widest">
          // DRAG TO EXPLORE • CLICK TO EXPAND
        </p>
      </div>

      {/* Row 1 - Left to Right */}
      <div 
        ref={row1Ref}
        className="mb-4 overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing scroll-smooth"
        onMouseDown={handleMouseDown(row1Ref)}
      >
        <div ref={row1InnerRef} className="gallery-row">
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
        className="overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing scroll-smooth"
        onMouseDown={handleMouseDown(row2Ref)}
      >
        <div ref={row2InnerRef} className="gallery-row-reverse">
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
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative flex-shrink-0 w-72 h-48 md:w-96 md:h-64 mx-2 overflow-hidden group cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!imageError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-cyan-600/20 to-pink-600/20 flex items-center justify-center">
          <span className="font-sans text-4xl text-cyan-400">{image.title.charAt(0)}</span>
        </div>
      )}
      
      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 flex flex-col justify-end p-4 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-xl text-cream tracking-wider transform transition-transform duration-300" style={{ transform: isHovered ? 'translateY(0)' : 'translateY(16px)' }}>
          {image.title}
        </h3>
        <p className="font-mono text-xs text-cyan-400 tracking-widest transform transition-transform duration-300 delay-75" style={{ transform: isHovered ? 'translateY(0)' : 'translateY(16px)' }}>
          {image.date}
        </p>
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none" />
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
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white hover:text-cyan-400 transition-colors"
        onClick={onClose}
      >
        <X size={32} />
      </button>
      
      <div 
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {!imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt={image.title}
            className="w-full h-auto object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full bg-gradient-to-br from-cyan-600/20 to-pink-600/20 flex flex-col items-center justify-center aspect-video">
            <span className="font-sans text-8xl text-cyan-400 mb-4">{image.title.charAt(0)}</span>
            <span className="font-sans text-2xl text-cream">{image.title}</span>
          </div>
        )}
        
        <div className="mt-6 p-6 bg-black/50 border border-cream/20">
          <h3 className="text-3xl text-cream tracking-wider" style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}>{image.title}</h3>
          <p className="font-mono text-sm text-cyan-400 tracking-widest mt-2">{image.date}</p>
        </div>
      </div>
    </div>
  )
}
