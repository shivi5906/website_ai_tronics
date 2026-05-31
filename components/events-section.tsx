'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface GalleryImage {
  src: string
  title: string
  date: string
  description: string
}

const galleryImages: GalleryImage[] = [
  { 
    src: 'https://picsum.photos/seed/event1/600/400?grayscale', 
    title: 'HACKATHON 2024', 
    date: 'MAR 15',
    description: 'Our flagship 24-hour coding sprint where innovators build high-impact artificial intelligence models and robotic controllers to solve critical, real-world problems under intense time constraints.'
  },
  { 
    src: 'https://picsum.photos/seed/event2/600/400?grayscale', 
    title: 'AI WORKSHOP', 
    date: 'FEB 28',
    description: 'A comprehensive, hands-on masterclass focused on deep learning frameworks, neural network tuning, and implementing real-time computer vision algorithms on edge computing platforms.'
  },
  { 
    src: 'https://picsum.photos/seed/event3/600/400?grayscale', 
    title: 'ROBOTICS DEMO', 
    date: 'JAN 20',
    description: 'Live exhibition showcasing autonomous systems, robotic arm kinematics, PID control loops, and sensor fusion platforms designed and assembled entirely by our core hardware team.'
  },
  { 
    src: 'https://picsum.photos/seed/event4/600/400?grayscale', 
    title: 'NEURAL NETS 101', 
    date: 'DEC 10',
    description: 'An introductory boot camp covering the foundations of feedforward networks, gradient descent, backpropagation, and practical model construction with popular framework stacks.'
  },
  { 
    src: 'https://picsum.photos/seed/event5/600/400?grayscale', 
    title: 'TECH SUMMIT', 
    date: 'NOV 05',
    description: 'An elite annual gathering of tech visionaries, developers, and industry experts discussing automation paradigms, quantum computing, ethics in AI, and future technological frontiers.'
  },
  { 
    src: 'https://picsum.photos/seed/event6/600/400?grayscale', 
    title: 'CODE SPRINT', 
    date: 'OCT 22',
    description: 'A high-octane competitive programming and rapid software engineering tournament testing algorithmic agility, database efficiency, and raw problem-solving speed.'
  },
  { 
    src: 'https://picsum.photos/seed/event7/600/400?grayscale', 
    title: 'ML BOOTCAMP', 
    date: 'SEP 18',
    description: 'Intensive multi-day training session tracking regression, classification systems, clustering algorithms, feature engineering pipelines, and real-world deployment practices.'
  },
  { 
    src: 'https://picsum.photos/seed/event8/600/400?grayscale', 
    title: 'IOT FEST', 
    date: 'AUG 30',
    description: 'A dynamic hardware exhibition focusing on smart embedded environments, sensor networks, wireless telemetry, microcontrollers, and edge computing architectures.'
  },
]

interface EventsSectionProps {
  onBack: () => void
  onHome?: () => void
}

export default function EventsSection({ onBack, onHome }: EventsSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="min-h-screen bg-[#0a0a0a] relative overflow-y-auto max-h-screen scrollbar-thin portal-enter">
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
