'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const cursorEl = cursorRef.current
    if (!cursorEl) return

    let animationFrameId: number | null = null
    let latestX = -100
    let latestY = -100

    const applyPosition = () => {
      cursorEl.style.transform = `translate3d(${latestX}px, ${latestY}px, 0)`
      cursorEl.style.opacity = '1'
      animationFrameId = null
    }

    const handlePointerMove = (e: PointerEvent) => {
      latestX = e.clientX
      latestY = e.clientY
      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(applyPosition)
      }
    }

    const handleMouseLeave = () => {
      cursorEl.style.opacity = '0'
    }
    const handleMouseEnter = () => {
      cursorEl.style.opacity = '1'
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Initial hidden state off-screen
    cursorEl.style.transform = 'translate3d(-100px, -100px, 0)'
    cursorEl.style.opacity = '0'

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="custom-cursor hidden md:block"
      style={{
        opacity: 0,
      }}
    >
      {/* Triangular pointer cursor with shadow */}
      <svg
        width="20"
        height="24"
        viewBox="0 0 20 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(2px 2px 0px rgba(30, 30, 30, 0.9))' }}
      >
        <path
          d="M1 1L1 20L6 15L10 22L12 21L8 14L14 14L1 1Z"
          fill="#9ca3af"
          stroke="#4b5563"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}