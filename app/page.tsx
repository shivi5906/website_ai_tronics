'use client'

import { useState, useEffect, useRef } from 'react'
import Preloader from '@/components/preloader'
import CustomCursor from '@/components/custom-cursor'
import LandingHero from '@/components/landing-hero'
import SectionMenu from '@/components/section-menu'
import TeamSection from '@/components/team-section'
import AboutSection from '@/components/about-section'
import EventsSection from '@/components/events-section'
import VibeSection from '@/components/vibe-section'
import ContactSection from '@/components/contact-section'
import InfiniteGallerySection from '@/components/infinite-gallery-section'

type ViewState = 'landing' | 'menu' | 'team' | 'about' | 'events' | 'vibe' | 'contact' | 'infinite-gallery'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentView, setCurrentView] = useState<ViewState>('landing')
  const [isMuted, setIsMuted] = useState(false)
  // Default directly to local public asset path
  const [audioSrc, setAudioSrc] = useState('/audio/industry_baby.mp3')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Sync mute/play states with the background audio element
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause()
      } else {
        if (isLoaded) {
          audioRef.current.play().catch(() => {
            // Autoplay blocked by browser policy
          })
        }
      }
    }
  }, [isMuted, isLoaded])

  // Handle 2-second audio autoplay trigger after loading completes
  useEffect(() => {
    if (!isLoaded) return

    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Autoplay blocked by browser policy
        })
      }
    }

    const timer = setTimeout(() => {
      playAudio()

      // Set fallback click interaction handlers in case browser blocks autoplay
      const handleUserInteract = () => {
        playAudio()
        window.removeEventListener('click', handleUserInteract)
        window.removeEventListener('touchstart', handleUserInteract)
        window.removeEventListener('keydown', handleUserInteract)
      }
      window.addEventListener('click', handleUserInteract)
      window.addEventListener('touchstart', handleUserInteract)
      window.addEventListener('keydown', handleUserInteract)
    }, 200)

    return () => clearTimeout(timer)
  }, [isLoaded])

  // Dynamically lock/unlock body scroll based on current view to prevent browser scrollbars/extra space
  useEffect(() => {
    if (currentView === 'landing' || currentView === 'menu' || currentView === 'infinite-gallery') {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [currentView])

  const handleEnterSociety = () => {
    setCurrentView('infinite-gallery')
  }

  const handleSelectSection = (sectionId: string) => {
    setCurrentView(sectionId as ViewState)
  }

  const handleBackToMenu = () => {
    setCurrentView('menu')
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
      case 'menu':
        return (
          <div className="relative w-full h-screen overflow-hidden">
            {/* Landing Hero */}
            <div 
              className="absolute inset-0 transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: currentView === 'landing' ? 'translateY(0)' : 'translateY(-100%)',
              }}
            >
              <LandingHero 
                onEnter={handleEnterSociety} 
                onScrollDown={() => setCurrentView('menu')} 
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
              />
            </div>

            {/* Section Menu */}
            <div 
              className="absolute inset-0 transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] z-50"
              style={{
                transform: currentView === 'menu' ? 'translateY(0)' : 'translateY(100%)',
                pointerEvents: currentView === 'menu' ? 'auto' : 'none',
              }}
            >
              <SectionMenu
                isOpen={true}
                onClose={() => setCurrentView('landing')}
                onSelectSection={handleSelectSection}
                currentSection={null}
              />
            </div>
          </div>
        )
      case 'team':
        return <TeamSection onBack={handleBackToMenu} onHome={() => setCurrentView('landing')} />
      case 'about':
        return <AboutSection onBack={handleBackToMenu} onHome={() => setCurrentView('landing')} />
      case 'events':
        return <EventsSection onBack={handleBackToMenu} onHome={() => setCurrentView('landing')} />
      case 'vibe':
        return <VibeSection onBack={handleBackToMenu} onHome={() => setCurrentView('landing')} />
      case 'contact':
        return <ContactSection onBack={handleBackToMenu} onHome={() => setCurrentView('landing')} />
      case 'infinite-gallery':
        return (
          <InfiniteGallerySection 
            onBack={handleBackToMenu} 
            onNavigate={handleSelectSection} 
            onHome={() => setCurrentView('landing')} 
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
          />
        )
      default:
        return <LandingHero onEnter={handleEnterSociety} />
    }
  }

  return (
    <>
      {/* Preloader */}
      {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Scan Lines */}
      <div className="scanlines" />

      {/* Main Content */}
      <main className={`relative z-10 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {renderCurrentView()}
      </main>

      {/* Global Background Audio Player */}
      <audio 
        ref={audioRef}
        src={audioSrc}
        onError={() => {
          // If the local file fails to load (e.g., file not found, named differently, or format error),
          // instantly fall back to the high-availability online stream seamlessly!
          if (audioSrc === '/audio/industry_baby.mp3') {
            console.log("Local industry_baby.mp3 not found or failed to load. Falling back to online stream.");
            // setAudioSrc('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');
          }
        }}
        loop
        preload="auto"
      />
    </>
  )
}
