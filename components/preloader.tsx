'use client'

import { useEffect, useState } from 'react'

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const [statusText, setStatusText] = useState('Initializing Neural Systems')

  useEffect(() => {
    // 1. Compile all assets to preload
    const landingImages = Array.from({ length: 12 }, (_, i) => `/gallery/landing/photo${i}.jpg`)
    const galleryImages = Array.from({ length: 46 }, (_, i) => `/gallery/infinite/m${i + 1}.jpg`)
    const allImages = [...landingImages, ...galleryImages]
    const audioAsset = '/audio/industry_baby.mp3'

    const totalAssets = allImages.length + 1 // Images + Audio
    let loadedCount = 0
    let displayPercent = 0

    // Smooth visual progress accumulator interval to prevent flash/instant fade out
    const progressInterval = setInterval(() => {
      const targetPercent = (loadedCount / totalAssets) * 100
      
      if (displayPercent < targetPercent) {
        // Slide smoothly towards target loaded percentage
        displayPercent += Math.min(2.5, targetPercent - displayPercent)
      } else if (displayPercent < 100 && loadedCount >= totalAssets) {
        // Smoothly trickle to completion when everything is finished
        displayPercent += 2.0
      }

      const clampedPercent = Math.min(100, displayPercent)
      setProgress(clampedPercent)

      if (loadedCount <= 12) {
        setStatusText(`Loading Core Interface: ${loadedCount}/12`)
      } else if (loadedCount < totalAssets) {
        setStatusText(`Preloading Neural Archives: ${loadedCount - 12}/46`)
      } else {
        setStatusText('Tuning Frequency... Systems Ready.')
      }

      if (clampedPercent >= 100 && loadedCount >= totalAssets) {
        clearInterval(progressInterval)
        clearTimeout(fallbackTimeout)
        setTimeout(() => {
          setVisible(false)
          onComplete()
        }, 500)
      }
    }, 25)

    // Defensive fallback timeout: force load complete after 8 seconds under any extreme network issues
    const fallbackTimeout = setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)
      setStatusText('Systems Ready.')
      setTimeout(() => {
        setVisible(false)
        onComplete()
      }, 500)
    }, 8000)

    if (typeof window !== 'undefined') {
      (window as any).preloadedImageElements = (window as any).preloadedImageElements || {}
    }

    const handleAssetLoad = () => {
      loadedCount++
    }

    // 2. Load all images programmatically
    allImages.forEach((src) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        if (typeof window !== 'undefined') {
          (window as any).preloadedImageElements[src] = img
        }
        handleAssetLoad()
      }
      img.onerror = handleAssetLoad // Bypass error so it never gets stuck
      img.src = src
    })

    // 3. Load audio file programmatically
    const audio = new Audio()
    audio.src = audioAsset
    audio.preload = 'auto'
    audio.addEventListener('canplaythrough', handleAssetLoad, { once: true })
    audio.addEventListener('error', handleAssetLoad, { once: true }) // Bypass error

    return () => {
      clearInterval(progressInterval)
      clearTimeout(fallbackTimeout)
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

        <p className="font-mono text-xs text-[#6b6b6b] mt-6 tracking-[0.2em] uppercase">
          {statusText}
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
