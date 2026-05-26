'use client'

import { useMemo } from "react"
import Particles from "@tsparticles/react"
import { ParticlesProvider, useParticlesProvider } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import type { ISourceOptions } from "@tsparticles/engine"

function ParticleCanvas() {
  const { loaded } = useParticlesProvider()

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.5,
              color: "#00f0ff",
            },
          },
        },
      },
      particles: {
        color: {
          value: "#00f0ff",
        },
        links: {
          color: "#00f0ff",
          distance: 150,
          enable: true,
          opacity: 0.1,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 0.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: 0.3,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    []
  )

  if (!loaded) return null

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="absolute inset-0 -z-10"
    />
  )
}

export default function ParticleBackground() {
  return (
    <ParticlesProvider init={async (engine) => { await loadSlim(engine) }}>
      <ParticleCanvas />
    </ParticlesProvider>
  )
}
