'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  const scrambleText = useCallback((element: HTMLElement, finalText: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
    let iteration = 0
    const interval = setInterval(() => {
      element.innerText = finalText
        .split('')
        .map((letter, index) => {
          if (index < iteration) {
            return finalText[index]
          }
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join('')
      
      if (iteration >= finalText.length) {
        clearInterval(interval)
      }
      
      iteration += 1 / 3
    }, 30)
  }, [])

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.5 })

    if (titleRef.current) {
      const words = titleRef.current.querySelectorAll('.word')
      words.forEach((word, i) => {
        tl.fromTo(word, 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          i * 0.3
        )
        setTimeout(() => {
          scrambleText(word as HTMLElement, (word as HTMLElement).dataset.text || '')
        }, 2500 + i * 300)
      })
    }

    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        1
      )
    }

    if (ctaRef.current) {
      tl.fromTo(ctaRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6 },
        1.3
      )
    }

    if (badgeRef.current) {
      tl.fromTo(badgeRef.current,
        { opacity: 0, rotate: -180 },
        { opacity: 1, rotate: 0, duration: 1 },
        1.5
      )

      gsap.to(badgeRef.current, {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: 'linear'
      })
    }
  }, [scrambleText])

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Grid */}
      <div className="perspective-grid" />
      
      {/* Animated Badge */}
      <div 
        ref={badgeRef}
        className="absolute top-8 right-8 w-24 h-24 opacity-0"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--neon-cyan)" strokeWidth="1" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="var(--neon-cyan)" strokeWidth="0.5" />
          <path d="M50 10 L54 25 L70 25 L57 35 L62 50 L50 40 L38 50 L43 35 L30 25 L46 25 Z" fill="var(--neon-cyan)" opacity="0.3" />
          <text x="50" y="55" textAnchor="middle" fill="var(--neon-cyan)" fontSize="8" fontFamily="var(--font-mono)">AI-TRONICS</text>
          <text x="50" y="65" textAnchor="middle" fill="var(--neon-cyan)" fontSize="6" fontFamily="var(--font-mono)">EST. 20XX</text>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <h1 
          ref={titleRef}
          className="font-sans text-6xl md:text-8xl lg:text-[10rem] leading-none tracking-wider mb-8"
        >
          <span className="word block text-cream opacity-0" data-text="THE FUTURE">THE FUTURE</span>
          <span className="word block text-ivory opacity-0" data-text="IS ENGINEERED">IS ENGINEERED</span>
        </h1>
        
        <p 
          ref={subtitleRef}
          className="font-mono text-[color:var(--neon-cyan)] text-sm md:text-base tracking-[0.3em] mb-12 opacity-0"
        >
          // AI-TRONICS HUB — EST. 20XX
        </p>

        <button
          ref={ctaRef}
          onClick={scrollToContact}
          className="neon-btn font-mono opacity-0"
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          ENTER THE HUB
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[color:var(--neon-cyan)] rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[color:var(--neon-cyan)] rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
