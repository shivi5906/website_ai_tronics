'use client'

import { useEffect, useState } from 'react'

interface StatCounter {
  value: string
  label: string
  suffix?: string
}

const stats: StatCounter[] = [
  { value: '42', label: 'MEMBERS', suffix: '+' },
  { value: '12', label: 'PROJECTS', suffix: '' },
  { value: '∞', label: 'IDEAS', suffix: '' },
]

const marqueeItems = [
  'AI', 'ROBOTICS', 'ML', 'EMBEDDED SYSTEMS', 'NEURAL NETS', 
  'AUTOMATION', 'AI-TRONICS', 'DEEP LEARNING', 'COMPUTER VISION',
  'NLP', 'EDGE COMPUTING', 'IoT'
]

interface AboutSectionProps {
  onBack: () => void
}

export default function AboutSection({ onBack }: AboutSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [counters, setCounters] = useState<number[]>([0, 0, 0])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isVisible) {
      stats.forEach((stat, index) => {
        if (stat.value === '∞') {
          setCounters(prev => {
            const newCounters = [...prev]
            newCounters[index] = -1
            return newCounters
          })
        } else {
          const target = parseInt(stat.value)
          let current = 0
          const increment = target / 40
          const interval = setInterval(() => {
            current += increment
            if (current >= target) {
              current = target
              clearInterval(interval)
            }
            setCounters(prev => {
              const newCounters = [...prev]
              newCounters[index] = Math.floor(current)
              return newCounters
            })
          }, 40)
        }
      })
    }
  }, [isVisible])

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

      <div className="pt-32 pb-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className={`mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="font-mono text-xs text-[#6b6b6b] tracking-[0.4em] mb-4 uppercase">
              02 / The Hub
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
            {/* Left - Large Display Text */}
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 
                className="glitch-rgb text-5xl md:text-6xl lg:text-7xl text-[#f5f5dc] tracking-tight leading-[0.95] drip-text"
                data-text="WE DON'T STUDY THE FUTURE."
                style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
              >
                WE DON&apos;T STUDY
                <br />
                THE FUTURE.
                <span className="drip" />
                <span className="drip" />
              </h2>
              <h2 
                className="text-5xl md:text-6xl lg:text-7xl text-[#a8a29e] tracking-tight leading-[0.95] mt-4 brush-underline inline-block"
                style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
              >
                WE BUILD IT.
              </h2>
            </div>

            {/* Right - Description */}
            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <p className="font-mono text-sm text-[#a8a29e] leading-relaxed mb-6">
                AI-TRONICS is not just a club — it&apos;s a collective of visionaries, 
                hackers, and builders who refuse to wait for tomorrow. We prototype 
                the impossible, debug reality, and ship solutions that matter.
              </p>
              <p className="font-mono text-sm text-[#6b6b6b] leading-relaxed">
                From autonomous systems to neural architectures, we&apos;re engineering 
                the infrastructure of what comes next. Join the movement.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-3 gap-8 mb-24 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div 
                  className="text-6xl md:text-8xl lg:text-9xl text-[#f5f5dc]"
                  style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
                >
                  {counters[index] === -1 ? '∞' : counters[index]}{stat.suffix}
                </div>
                <div className="font-mono text-xs text-[#6b6b6b] tracking-[0.3em] mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Ticker */}
        <div className={`border-y border-[#2a2a2a] py-6 overflow-hidden transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span key={index} className="font-mono text-sm text-[#a8a29e] mx-8 whitespace-nowrap tracking-wider">
                {item} <span className="text-[#3a3a3a]">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
