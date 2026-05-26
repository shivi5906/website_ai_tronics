'use client'

import { useEffect, useState } from 'react'

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            setVisible(false)
            onComplete()
          }, 400)
          return 100
        }
        return prev + 1.5
      })
    }, 35)

    return () => {
      clearInterval(progressInterval)
    }
  }, [onComplete])

  if (!visible) return null

  return (
    <div 
      className="preloader"
      style={{ 
        opacity: progress >= 100 ? 0 : 1, 
        transition: 'opacity 0.6s ease-out' 
      }}
    >
      <div className="text-center">
        {/* Distressed graffiti title */}
        <div className="relative">
          <h1 
            className="font-[var(--font-display)] text-6xl md:text-8xl tracking-[0.15em] text-[#f5f5dc] drip-text"
            style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
          >
            AI-TRONICS
            {/* Drip elements */}
            <span className="drip" style={{ left: '18%', height: '20px', animationDelay: '0s' }} />
            <span className="drip" style={{ left: '42%', height: '28px', animationDelay: '0.5s' }} />
            <span className="drip" style={{ left: '78%', height: '15px', animationDelay: '1s' }} />
          </h1>
          
          {/* RGB glitch overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <span 
              className="absolute text-6xl md:text-8xl tracking-[0.15em] opacity-50"
              style={{ 
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                color: '#ff0040',
                left: '2px',
                top: '1px',
                animation: 'glitch-shift-r 2s infinite'
              }}
            >
              AI-TRONICS
            </span>
            <span 
              className="absolute text-6xl md:text-8xl tracking-[0.15em] opacity-50"
              style={{ 
                fontFamily: 'Bebas Neue, Impact, sans-serif',
                color: '#00ffff',
                left: '-2px',
                top: '-1px',
                animation: 'glitch-shift-c 2s infinite'
              }}
            >
              AI-TRONICS
            </span>
          </div>
        </div>

        <p className="font-mono text-xs text-[#6b6b6b] mt-6 tracking-[0.4em] uppercase">
          Initializing
        </p>
        
        <div className="loading-bar mt-8 mx-auto">
          <div 
            className="loading-fill" 
            style={{ width: `${progress}%`, animation: 'none' }}
          />
        </div>
        
        <p className="font-mono text-xs text-[#a8a29e] mt-4 tracking-[0.2em]">
          {Math.floor(progress)}%
        </p>
      </div>
    </div>
  )
}
