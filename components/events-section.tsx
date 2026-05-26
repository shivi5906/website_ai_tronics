'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface GalleryImage {
  src: string
  title: string
  date: string
}

const galleryImages: GalleryImage[] = [
  { src: 'https://picsum.photos/seed/event1/600/400?grayscale', title: 'HACKATHON 2024', date: 'MAR 15' },
  { src: 'https://picsum.photos/seed/event2/600/400?grayscale', title: 'AI WORKSHOP', date: 'FEB 28' },
  { src: 'https://picsum.photos/seed/event3/600/400?grayscale', title: 'ROBOTICS DEMO', date: 'JAN 20' },
  { src: 'https://picsum.photos/seed/event4/600/400?grayscale', title: 'NEURAL NETS 101', date: 'DEC 10' },
  { src: 'https://picsum.photos/seed/event5/600/400?grayscale', title: 'TECH SUMMIT', date: 'NOV 05' },
  { src: 'https://picsum.photos/seed/event6/600/400?grayscale', title: 'CODE SPRINT', date: 'OCT 22' },
  { src: 'https://picsum.photos/seed/event7/600/400?grayscale', title: 'ML BOOTCAMP', date: 'SEP 18' },
  { src: 'https://picsum.photos/seed/event8/600/400?grayscale', title: 'IOT FEST', date: 'AUG 30' },
]

interface EventsSectionProps {
  onBack: () => void
}

export default function EventsSection({ onBack }: EventsSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="min-h-screen bg-[#0a0a0a] relative overflow-hidden portal-enter">
      {/* Grunge overlay */}
      <div className="grunge-overlay" />

      {/* Back button */}
      <button
        onClick={onBack}
        className="fixed top-8 left-8 z-50 font-mono text-xs text-[#a8a29e] hover:text-[#f5f5dc] tracking-[0.2em] transition-colors flex items-center gap-2"
      >
        <span className="text-lg">←</span> BACK
      </button>

      {/* Header */}
      <div className="fixed top-8 right-8 z-50">
        <span 
          className="text-2xl text-[#f5f5dc] tracking-[0.1em]"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          AI-TRONICS
        </span>
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
        <div className="scroll-gallery">
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
      <div className={`overflow-hidden transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="scroll-gallery-reverse">
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
      className="fixed inset-0 bg-[#0a0a0a]/98 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button 
        className="absolute top-8 right-8 text-[#a8a29e] hover:text-[#f5f5dc] transition-colors"
        onClick={onClose}
      >
        <X size={28} />
      </button>
      
      <div 
        className="relative max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.title}
          className="w-full h-auto object-contain"
          style={{ filter: 'grayscale(50%) contrast(1.1)' }}
        />
        
        <div className="mt-6">
          <h3 
            className="text-4xl text-[#f5f5dc] tracking-[0.1em]"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
          >
            {image.title}
          </h3>
          <p className="font-mono text-sm text-[#6b6b6b] tracking-[0.2em] mt-2">{image.date}</p>
        </div>
      </div>
    </div>
  )
}
