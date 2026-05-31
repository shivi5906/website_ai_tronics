'use client'

import { useEffect, useState } from 'react'
import { Github, Instagram, Linkedin } from 'lucide-react'

interface ContactSectionProps {
  onBack: () => void
}

export default function ContactSection({ onBack }: ContactSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      setIsSubmitted(true)
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
      <div className="fixed top-8 right-8 z-50">
        <span 
          className="text-2xl text-[#f5f5dc] tracking-[0.1em]"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          AI-TRONICS
        </span>
      </div>

      <div className="w-full px-4 md:px-8 py-32">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className={`mb-16 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="font-mono text-xs text-[#6b6b6b] tracking-[0.4em] mb-4 uppercase">
              05 / Transmit
            </p>
            <h2 
              className="glitch-rgb text-5xl md:text-7xl lg:text-8xl text-[#f5f5dc] tracking-tight drip-text"
              data-text="THINK YOU BELONG HERE?"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
            >
              THINK YOU BELONG HERE?
              <span className="drip" />
              <span className="drip" />
              <span className="drip" />
            </h2>
          </div>

          {!isSubmitted ? (
            <form 
              onSubmit={handleSubmit} 
              className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              {/* Name Field */}
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-[#a8a29e] whitespace-nowrap tracking-wider">
                  {'>'} NAME:
                </span>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  required
                  className="terminal-input flex-1 text-sm"
                  placeholder="ENTER YOUR DESIGNATION"
                />
              </div>

              {/* Email Field */}
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-[#a8a29e] whitespace-nowrap tracking-wider">
                  {'>'} EMAIL:
                </span>
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  required
                  className="terminal-input flex-1 text-sm"
                  placeholder="YOUR_CONTACT@DOMAIN.COM"
                />
              </div>

              {/* Message Field */}
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs text-[#a8a29e] whitespace-nowrap pt-3 tracking-wider">
                  {'>'} WHY AI-TRONICS?:
                </span>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="terminal-input flex-1 resize-none text-sm"
                  placeholder="STATE YOUR PURPOSE..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-8">
                <button 
                  type="submit" 
                  className="group relative px-12 py-4 border border-[#f5f5dc]/30 bg-transparent overflow-hidden transition-all duration-500 hover:border-[#f5f5dc]/60"
                >
                  <span className="absolute inset-0 bg-[#f5f5dc] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  <span 
                    className="relative font-mono text-sm tracking-[0.3em] text-[#f5f5dc] group-hover:text-[#0a0a0a] transition-colors duration-300"
                    style={{ fontFamily: 'Bebas Neue, Impact, sans-serif', fontSize: '1.1rem' }}
                  >
                    [ TRANSMIT ]
                  </span>
                </button>
              </div>
            </form>
          ) : (
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="font-mono text-sm text-[#a8a29e] space-y-3">
                <p>{'>'} PROCESSING...</p>
                <p>{'>'} REQUEST RECEIVED.</p>
                <p className="text-[#f5f5dc]">{'>'} WE&apos;LL FIND YOU.</p>
              </div>
              <button 
                onClick={() => {
                  setIsSubmitted(false)
                  setFormState({ name: '', email: '', message: '' })
                }}
                className="mt-8 font-mono text-xs text-[#6b6b6b] hover:text-[#f5f5dc] transition-colors tracking-wider"
              >
                [ SEND ANOTHER ]
              </button>
            </div>
          )}

          {isTyping && (
            <div className="mt-8 text-center">
              <span className="font-mono text-sm text-[#a8a29e] animate-pulse tracking-wider">
                {'>'} TRANSMITTING
                <span className="inline-block animate-bounce">.</span>
                <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              </span>
            </div>
          )}

          {/* Social Links */}
          <div className={`flex justify-center gap-6 mt-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-card p-4 text-[#6b6b6b] hover:text-[#f5f5dc] hover:border-[#f5f5dc]/30 transition-all"
            >
              <Github size={22} />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-card p-4 text-[#6b6b6b] hover:text-[#f5f5dc] hover:border-[#f5f5dc]/30 transition-all"
            >
              <Instagram size={22} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-card p-4 text-[#6b6b6b] hover:text-[#f5f5dc] hover:border-[#f5f5dc]/30 transition-all"
            >
              <Linkedin size={22} />
            </a>
          </div>

          {/* Footer Info */}
          <div className={`mt-20 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <p className="font-mono text-[10px] text-[#3a3a3a] tracking-[0.3em]">
              AI-TRONICS HUB // JIIT NOIDA // EST. 2020
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
