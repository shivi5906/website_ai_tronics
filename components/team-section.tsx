'use client'

import { useEffect, useRef, useState } from 'react'
import { Github, Instagram, Linkedin } from 'lucide-react'

interface TeamMember {
  name: string
  role: string
  image: string
  github?: string
  instagram?: string
  linkedin?: string
}

const teamMembers: TeamMember[] = [
  {
    name: 'ALEX CHEN',
    role: '// LEAD ARCHITECT',
    image: 'https://picsum.photos/seed/team1/400/500?grayscale',
    github: '#',
    instagram: '#',
    linkedin: '#',
  },
  {
    name: 'MAYA PATEL',
    role: '// ML ENGINEER',
    image: 'https://picsum.photos/seed/team2/400/500?grayscale',
    github: '#',
    instagram: '#',
    linkedin: '#',
  },
  {
    name: 'RYAN KUMAR',
    role: '// ROBOTICS HEAD',
    image: 'https://picsum.photos/seed/team3/400/500?grayscale',
    github: '#',
    instagram: '#',
    linkedin: '#',
  },
  {
    name: 'ZOE WILLIAMS',
    role: '// SYSTEMS ENGINEER',
    image: 'https://picsum.photos/seed/team4/400/500?grayscale',
    github: '#',
    instagram: '#',
    linkedin: '#',
  },
]

interface TeamSectionProps {
  onBack: () => void
}

export default function TeamSection({ onBack }: TeamSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section 
      ref={sectionRef} 
      className="min-h-screen bg-[#0a0a0a] relative overflow-y-auto max-h-screen scrollbar-thin portal-enter"
    >
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
          <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="font-mono text-xs text-[#6b6b6b] tracking-[0.4em] mb-4 uppercase">
              01 / The Minds
            </p>
            <h2 
              className="glitch-rgb text-5xl md:text-7xl lg:text-8xl text-[#f5f5dc] tracking-tight drip-text"
              data-text="THE MINDS BEHIND THE MACHINE"
              style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
            >
              THE MINDS BEHIND
              <br />
              THE MACHINE
              <span className="drip" />
              <span className="drip" />
              <span className="drip" />
            </h2>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <TeamCard 
                key={index} 
                member={member} 
                delay={index * 0.15}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TeamCard({ member, delay, isVisible }: { member: TeamMember; delay: number; isVisible: boolean }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className={`glass-card p-5 group relative overflow-hidden transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay + 0.3}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Classified Stamp Overlay */}
      <div className={`absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/90 transition-opacity duration-500 z-10 ${isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div 
          className="text-[#6b6b6b] text-2xl tracking-[0.3em] rotate-[-12deg] border-2 border-[#6b6b6b] px-4 py-2"
          style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
        >
          CLASSIFIED
        </div>
      </div>

      {/* Member Photo */}
      <div className="relative aspect-[4/5] mb-4 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.image}
          alt={member.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? 'grayscale-0 scale-105' : 'grayscale'
          }`}
        />
        
        {/* RGB overlay on hover */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff0040]/20 to-transparent mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-tl from-[#00ffff]/20 to-transparent mix-blend-overlay" />
        </div>
        
        {/* Scan line effect */}
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-[#f5f5dc]/20 to-transparent transition-transform duration-1000 ${isHovered ? 'translate-y-full' : '-translate-y-full'}`} />
      </div>

      {/* Member Info */}
      <h3 
        className="text-2xl text-[#f5f5dc] tracking-[0.1em] mb-1"
        style={{ fontFamily: 'Bebas Neue, Impact, sans-serif' }}
      >
        {member.name}
      </h3>
      <p className="font-mono text-xs text-[#a8a29e] mb-4 tracking-wider">{member.role}</p>

      {/* Social Links */}
      <div className="flex gap-4">
        {member.github && (
          <a href={member.github} className="text-[#6b6b6b] hover:text-[#f5f5dc] transition-colors">
            <Github size={16} />
          </a>
        )}
        {member.instagram && (
          <a href={member.instagram} className="text-[#6b6b6b] hover:text-[#f5f5dc] transition-colors">
            <Instagram size={16} />
          </a>
        )}
        {member.linkedin && (
          <a href={member.linkedin} className="text-[#6b6b6b] hover:text-[#f5f5dc] transition-colors">
            <Linkedin size={16} />
          </a>
        )}
      </div>
    </div>
  )
}
