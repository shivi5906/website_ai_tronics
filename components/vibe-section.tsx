'use client'

import { useEffect, useState } from 'react'
import { Headphones, Moon, Zap, Brain } from 'lucide-react'

interface VibeMode {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  spotifyEmbed: string
}

const vibeModes: VibeMode[] = [
  {
    id: 'deep-focus',
    name: 'DEEP FOCUS',
    description: 'Ambient soundscapes for intense coding sessions',
    icon: <Headphones size={28} />,
    spotifyEmbed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX5trt9i14X7j?theme=0',
  },
  {
    id: 'late-night',
    name: 'LATE NIGHT BUILD',
    description: 'Lo-fi beats for midnight debugging',
    icon: <Moon size={28} />,
    spotifyEmbed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?theme=0',
  },
  {
    id: 'hype-mode',
    name: 'HYPE MODE',
    description: 'High energy tracks for hackathon sprints',
    icon: <Zap size={28} />,
    spotifyEmbed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP?theme=0',
  },
  {
    id: 'neural-drift',
    name: 'NEURAL DRIFT',
    description: 'Experimental electronic for creative exploration',
    icon: <Brain size={28} />,
    spotifyEmbed: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8ymr6UES7vc?theme=0',
  },
]

interface VibeSectionProps {
  onBack: () => void
  onHome?: () => void
}

export default function VibeSection({ onBack, onHome }: VibeSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeVibe, setActiveVibe] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleVibeSelect = (vibeId: string) => {
    setActiveVibe(activeVibe === vibeId ? null : vibeId)
  }

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

      <div className="pt-32 pb-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="font-mono text-xs text-[#6b6b6b] tracking-[0.4em] mb-4 uppercase">
              04 / Now Playing
            </p>
            <h2 
              className="glitch-rgb text-5xl md:text-7xl lg:text-8xl text-[#f5f5dc] tracking-tight drip-text"
              data-text="SET YOUR FREQUENCY"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
            >
              SET YOUR FREQUENCY
              <span className="drip" />
              <span className="drip" />
              <span className="drip" />
            </h2>
            <p className="font-mono text-xs text-[#6b6b6b] mt-6 tracking-[0.2em]">
              // SELECT A VIBE TO SHIFT THE ATMOSPHERE
            </p>
          </div>

          {/* Vibe Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vibeModes.map((vibe, index) => (
              <div
                key={vibe.id}
                className={`vibe-card p-6 cursor-pointer transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                } ${
                  activeVibe === vibe.id 
                    ? 'border-[#f5f5dc]/40 bg-[#1a1a1a]' 
                    : ''
                }`}
                style={{ transitionDelay: `${(index + 1) * 0.15}s` }}
                onClick={() => handleVibeSelect(vibe.id)}
              >
                <div className={`mb-4 transition-colors duration-300 ${
                  activeVibe === vibe.id ? 'text-[#f5f5dc]' : 'text-[#6b6b6b]'
                }`}>
                  {vibe.icon}
                </div>
                <h3 
                  className={`text-2xl mb-2 tracking-[0.1em] transition-colors duration-300 ${
                    activeVibe === vibe.id ? 'text-[#f5f5dc]' : 'text-[#a8a29e]'
                  }`}
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
                >
                  {vibe.name}
                </h3>
                <p className="font-mono text-xs text-[#6b6b6b] leading-relaxed">
                  {vibe.description}
                </p>

                {/* Active indicator */}
                {activeVibe === vibe.id && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#f5f5dc] rounded-full animate-pulse" />
                    <span className="font-mono text-[10px] text-[#a8a29e] tracking-wider">NOW PLAYING</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Spotify Player */}
          {activeVibe && (
            <div className={`mt-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="glass-card p-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-[#f5f5dc] rounded-full animate-pulse" />
                  <span 
                    className="text-xl text-[#f5f5dc] tracking-[0.1em]"
                    style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
                  >
                    {vibeModes.find(v => v.id === activeVibe)?.name}
                  </span>
                </div>
                <iframe
                  src={vibeModes.find(v => v.id === activeVibe)?.spotifyEmbed}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ borderRadius: '0' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
