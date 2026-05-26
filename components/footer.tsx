'use client'

import { ArrowUp } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative py-12 px-4 md:px-8 border-t border-[color:var(--border)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Location */}
          <div className="text-center md:text-left">
            <h3 className="font-sans text-2xl text-cream tracking-widest">AI-TRONICS™</h3>
            <p className="font-mono text-xs text-[color:var(--muted-foreground)] tracking-wider mt-1">
              JIIT, NOIDA
            </p>
          </div>

          {/* Tagline */}
          <div className="text-center">
            <p className="font-mono text-sm text-[color:var(--neon-cyan)] tracking-widest">
              // BUILT DIFFERENT. BUILT FOR WHAT&apos;S NEXT.
            </p>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 font-mono text-sm text-[color:var(--muted-foreground)] hover:text-[color:var(--neon-cyan)] transition-colors"
          >
            <span className="glitch-text" data-text="BACK TO TOP">BACK TO TOP</span>
            <ArrowUp size={16} className="group-hover:animate-bounce" />
          </button>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[color:var(--border)] text-center">
          <p className="font-mono text-xs text-[color:var(--muted-foreground)]">
            © {new Date().getFullYear()} AI-TRONICS HUB. ALL SYSTEMS OPERATIONAL.
          </p>
        </div>
      </div>
    </footer>
  )
}
