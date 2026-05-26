'use client'

import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  return (
    <div
      className="custom-cursor hidden md:block"
      style={{
        left: position.x,
        top: position.y,
        opacity: isVisible ? 1 : 0,
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
