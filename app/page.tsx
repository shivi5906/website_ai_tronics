'use client'

import { useState } from 'react'
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
        return <TeamSection onBack={handleBackToMenu} />
      case 'about':
        return <AboutSection onBack={handleBackToMenu} />
      case 'events':
        return <EventsSection onBack={handleBackToMenu} />
      case 'vibe':
        return <VibeSection onBack={handleBackToMenu} />
      case 'contact':
        return <ContactSection onBack={handleBackToMenu} />
      case 'infinite-gallery':
        return <InfiniteGallerySection onBack={handleBackToMenu} onNavigate={handleSelectSection} />
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
    </>
  )
}
