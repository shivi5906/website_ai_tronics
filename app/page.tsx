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
    setCurrentView('menu')
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
        return <LandingHero onEnter={handleEnterSociety} />
      case 'menu':
        return (
          <SectionMenu
            isOpen={true}
            onClose={() => setCurrentView('landing')}
            onSelectSection={handleSelectSection}
            currentSection={null}
          />
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
        return <InfiniteGallerySection />
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
