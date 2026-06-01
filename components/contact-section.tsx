'use client'

import React, { useEffect, useState } from 'react'
import { Instagram, Linkedin, Mail, Facebook } from 'lucide-react'

interface ContactSectionProps {
  onBack: () => void
  onHome?: () => void
}

export default function ContactSection({ onBack, onHome }: ContactSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // Copy the email to clipboard
    navigator.clipboard.writeText('aitronics.jiit@gmail.com')
    setCopied(true)
    
    // Attempt to open the default mail client via mailto
    window.location.href = 'mailto:aitronics.jiit@gmail.com'

    // Reset copied state after 3 seconds
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  return (
    <section className="min-h-screen bg-[#0a0a0a] relative overflow-y-auto max-h-screen scrollbar-thin portal-enter flex flex-col justify-center">
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

      <div className="w-full px-4 md:px-8 py-32">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className={`mb-16 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="font-mono text-xs text-[#6b6b6b] tracking-[0.4em] mb-4 uppercase">
              05 / Contact Us
            </p>
            <h2 
              className="glitch-rgb text-5xl md:text-7xl lg:text-8xl text-[#f5f5dc] tracking-tight drip-text"
              data-text="GET IN TOUCH"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
            >
              GET IN TOUCH
              <span className="drip" />
              <span className="drip" />
              <span className="drip" />
            </h2>
          </div>

          {/* Cybernetic Direct Links Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* INSTAGRAM */}
            <a 
              href="https://www.instagram.com/ai_tronics_jiit/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between p-6 border border-[#f5f5dc]/10 bg-black/40 hover:bg-black/60 hover:border-[#f5f5dc]/30 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[#00f0ff]/5 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black/60 border border-[#f5f5dc]/10 group-hover:border-[#00f0ff]/40 text-[#a8a29e] group-hover:text-[#00f0ff] transition-colors rounded-md">
                  <Instagram size={24} />
                </div>
                <div>
                  <h3 className="font-mono text-sm text-[#f5f5dc] tracking-wider uppercase">// INSTAGRAM</h3>
                  <p className="font-mono text-[10px] text-[#6b6b6b] tracking-wider mt-0.5">FOLLOW OUR FEED</p>
                </div>
              </div>
              <span className="font-mono text-xs text-[#6b6b6b] group-hover:text-[#00f0ff] transition-colors">CONNECT →</span>
            </a>

            {/* EMAIL */}
            <a 
              href="mailto:aitronics.jiit@gmail.com" 
              onClick={handleEmailClick}
              className="group relative flex items-center justify-between p-6 border border-[#f5f5dc]/10 bg-black/40 hover:bg-black/60 hover:border-[#f5f5dc]/30 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[#ff007f]/5 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black/60 border border-[#f5f5dc]/10 group-hover:border-[#ff007f]/40 text-[#a8a29e] group-hover:text-[#ff007f] transition-colors rounded-md">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-mono text-sm text-[#f5f5dc] tracking-wider uppercase">// EMAIL</h3>
                  <p className="font-mono text-[10px] text-[#6b6b6b] tracking-wider mt-0.5">
                    {copied ? 'COPIED TO CLIPBOARD ✓' : 'DIRECT ENQUIRIES'}
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs text-[#6b6b6b] group-hover:text-[#ff007f] transition-colors">
                {copied ? 'COPIED ✓' : 'TRANSMIT →'}
              </span>
            </a>

            {/* LINKEDIN */}
            <a 
              href="https://www.linkedin.com/company/ai-tronics/posts/?feedView=all" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between p-6 border border-[#f5f5dc]/10 bg-black/40 hover:bg-black/60 hover:border-[#f5f5dc]/30 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[#00f0ff]/5 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black/60 border border-[#f5f5dc]/10 group-hover:border-[#00f0ff]/40 text-[#a8a29e] group-hover:text-[#00f0ff] transition-colors rounded-md">
                  <Linkedin size={24} />
                </div>
                <div>
                  <h3 className="font-mono text-sm text-[#f5f5dc] tracking-wider uppercase">// LINKEDIN</h3>
                  <p className="font-mono text-[10px] text-[#6b6b6b] tracking-wider mt-0.5">PROFESSIONAL NETWORK</p>
                </div>
              </div>
              <span className="font-mono text-xs text-[#6b6b6b] group-hover:text-[#00f0ff] transition-colors">CONNECT →</span>
            </a>         
          </div>

          {/* Footer Info */}
          <div className={`mt-24 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <p className="font-mono text-[10px] text-[#3a3a3a] tracking-[0.3em]">
              AI-TRONICS HUB // JIIT NOIDA // EST. 2025
            </p>
          </div>
        </div>
      </div>

      {/* Cybernetic Toast Notification */}
      {copied && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
          <div className="px-6 py-3 border border-[#ff007f] bg-black/90 text-white shadow-[0_0_15px_rgba(255,0,127,0.3)] flex items-center gap-3 rounded-none font-mono text-xs tracking-widest backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#ff007f] animate-ping" />
            <span className="text-[#ff007f] font-bold">SYSTEM //</span> EMAIL COPIED TO CLIPBOARD
          </div>
        </div>
      )}
    </section>
  )
}
