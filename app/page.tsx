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
  const isMutedRef = useRef(isMuted)

  useEffect(() => {
    isMutedRef.current = isMuted
  }, [isMuted])

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
      if (isMutedRef.current) return
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

  // Listen for browser popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view as ViewState)
      } else {
        setCurrentView('landing')
      }
    }

    window.addEventListener('popstate', handlePopState)

    // Set initial history state to 'landing' if not set
    if (!window.history.state || !window.history.state.view) {
      window.history.replaceState({ view: 'landing' }, '')
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  // Helper to handle client-side view changes with history pushState
  const navigateToView = (view: ViewState, push = true) => {
    if (view !== currentView) {
      setCurrentView(view)
      if (push) {
        window.history.pushState({ view }, '')
      }
    }
  }

  const handleEnterSociety = () => {
    navigateToView('infinite-gallery')
  }

  const handleSelectSection = (sectionId: string) => {
    navigateToView(sectionId as ViewState)
  }

  const handleBackToMenu = () => {
    if (window.history.state && window.history.state.view) {
      window.history.back()
    } else {
      navigateToView('menu')
    }
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
                onScrollDown={() => navigateToView('menu')} 
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
                onClose={() => navigateToView('landing')}
                onSelectSection={handleSelectSection}
                currentSection={null}
              />
            </div>
          </div>
        )
      case 'team':
        return <TeamSection onBack={handleBackToMenu} onHome={() => navigateToView('landing')} />
      case 'about':
        return <AboutSection onBack={handleBackToMenu} onHome={() => navigateToView('landing')} />
      case 'events':
        return <EventsSection onBack={handleBackToMenu} onHome={() => navigateToView('landing')} />
      case 'vibe':
        return <VibeSection onBack={handleBackToMenu} onHome={() => navigateToView('landing')} />
      case 'contact':
        return <ContactSection onBack={handleBackToMenu} onHome={() => navigateToView('landing')} />
      case 'infinite-gallery':
        return (
          <InfiniteGallerySection 
            onBack={handleBackToMenu} 
            onNavigate={handleSelectSection} 
            onHome={() => navigateToView('landing')} 
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
          />
        )
      default:
        return <LandingHero onEnter={handleEnterSociety} />
    }
  }

  const showGlobalSoundToggle = currentView !== 'landing' && currentView !== 'infinite-gallery'

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

      {/* Global Sound Toggle (bottom-right) */}
      {showGlobalSoundToggle && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="fixed bottom-6 right-6 z-50 font-mono text-xs tracking-[0.2em] transition-all duration-300 flex items-center gap-2 cursor-pointer p-2 bg-transparent border border-[#f5f5dc]/10 text-[#a8a29e] hover:text-[#f5f5dc]"
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
      )}

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
