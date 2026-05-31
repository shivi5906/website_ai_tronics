export interface GalleryCardConfig {
  id: string
  imageUrl: string
  title: string
  subtitle: string
}

export interface GalleryCanvasOptions {
  container: HTMLElement
  cards: GalleryCardConfig[]
  onExit?: () => void
  onSelect?: (card: GalleryCardConfig) => void
}

interface CardPhysics {
  element: HTMLElement
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
  isGrabbed: boolean
  grabOffsetX: number
  grabOffsetY: number
  lastX: number
  lastY: number
  // Unique natural drift velocity target
  driftVx: number
  driftVy: number
}

export class GalleryCanvas {
  private container: HTMLElement
  private cardConfigs: GalleryCardConfig[]
  private cards: CardPhysics[] = []
  private options: GalleryCanvasOptions
  
  // Physics constants (easily tuneable)
  private readonly REPEL_RADIUS = 180       // Radius of magnetic cursor repulsion (pixels)
  private readonly REPEL_STRENGTH = 4000     // Power of repulsion force
  private readonly ELASTICITY = 0.6          // Damping factor when bouncing off walls (damping = ~0.6)
  private readonly THROW_MULTIPLIER = 0.3    // Velocity multiplier when releasing a card
  private readonly FRICTION = 0.97           // Friction factor applied to thrown cards per frame
  private readonly MIN_DRIFT_SPEED = 0.1     // Minimum speed for the floating cards (px/frame)
  private readonly MAX_DRIFT_SPEED = 0.4     // Maximum speed for floating cards (px/frame)
  private readonly MIN_SPEED_THRESHOLD = 0.05 // Under this speed, we nudge cards to keep moving

  // State trackers
  private mouseX = -1000
  private mouseY = -1000
  private lastMouseX = -1000
  private lastMouseY = -1000
  private animationFrameId: number | null = null
  private isMouseInContainer = false
  private active = false

  // Bound event listeners for clean destruction
  private boundOnMouseMove: (e: MouseEvent) => void
  private boundOnMouseLeave: () => void
  private boundOnMouseEnter: () => void
  private boundOnMouseUp: (e: MouseEvent) => void
  private boundOnTouchMove: (e: TouchEvent) => void
  private boundOnTouchEnd: () => void
  private boundOnResize: () => void

  constructor(options: GalleryCanvasOptions) {
    this.container = options.container
    this.cardConfigs = options.cards
    this.options = options

    // Pre-bind event listeners so we can add/remove them cleanly
    this.boundOnMouseMove = this.onMouseMove.bind(this)
    this.boundOnMouseLeave = this.onMouseLeave.bind(this)
    this.boundOnMouseEnter = this.onMouseEnter.bind(this)
    this.boundOnMouseUp = this.onMouseUp.bind(this)
    this.boundOnTouchMove = this.onTouchMove.bind(this)
    this.boundOnTouchEnd = this.onTouchEnd.bind(this)
    this.boundOnResize = this.onResize.bind(this)
  }

  /**
   * Initializes DOM elements and sets up the event listeners.
   */
  public init(): void {
    // Clear container
    this.container.innerHTML = ''
    this.cards = []

    const containerWidth = this.container.clientWidth || window.innerWidth
    const containerHeight = this.container.clientHeight || window.innerHeight

    // Create DOM card elements
    this.cardConfigs.forEach((config, idx) => {
      const cardEl = document.createElement('div')
      cardEl.className = 'gallery-card absolute group cursor-grab active:cursor-grabbing select-none'
      cardEl.style.willChange = 'transform'
      cardEl.style.position = 'absolute'
      cardEl.style.left = '0'
      cardEl.style.top = '0'
      
      // Let's create beautiful layered card HTML matching the design system
      cardEl.innerHTML = `
        <div class="relative w-full h-full overflow-hidden rounded-xl border border-cream/15 bg-charcoal/80 backdrop-blur-md shadow-2xl transition-all duration-300 group-hover:border-cream/40 group-hover:shadow-[0_0_30px_rgba(245,245,220,0.15)] flex flex-col p-4">
          <!-- Image frame -->
          <div class="relative flex-1 w-full overflow-hidden rounded-lg bg-black">
            <img 
              src="${config.imageUrl}" 
              alt="${config.title}" 
              class="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105 pointer-events-none"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
          </div>
          <!-- Label Details -->
          <div class="mt-4 flex flex-col justify-start">
            <h3 class="font-sans text-lg md:text-xl text-cream tracking-wide uppercase leading-tight font-bold group-hover:text-cream transition-colors duration-300">
              ${config.title}
            </h3>
            <span class="font-mono text-[10px] text-stone mt-1 tracking-widest uppercase">
              ${config.subtitle}
            </span>
          </div>
        </div>
      `

      // Append card to container
      this.container.appendChild(cardEl)

      // Calculate sizes. Standard size fits nicely on desktop and mobile.
      const isMobile = window.innerWidth < 768
      const cardWidth = isMobile ? 180 : 260
      const cardHeight = isMobile ? 220 : 310

      cardEl.style.width = `${cardWidth}px`
      cardEl.style.height = `${cardHeight}px`

      // Spread cards evenly across the viewport in a random layout initially
      // ensuring they are inside the bounds of the screen
      const margin = 50
      const randX = margin + Math.random() * Math.max(50, containerWidth - cardWidth - margin * 2)
      const randY = margin + Math.random() * Math.max(50, containerHeight - cardHeight - margin * 2)

      // Set unique randomized drift velocities (0.1 - 0.4 px/frame)
      const angle = Math.random() * Math.PI * 2
      const speed = this.MIN_DRIFT_SPEED + Math.random() * (this.MAX_DRIFT_SPEED - this.MIN_DRIFT_SPEED)
      const driftVx = Math.cos(angle) * speed
      const driftVy = Math.sin(angle) * speed

      const cardPhysics: CardPhysics = {
        element: cardEl,
        x: randX,
        y: randY,
        vx: driftVx,
        vy: driftVy,
        width: cardWidth,
        height: cardHeight,
        isGrabbed: false,
        grabOffsetX: 0,
        grabOffsetY: 0,
        lastX: randX,
        lastY: randY,
        driftVx,
        driftVy
      }

      this.cards.push(cardPhysics)

      // Bind Mouse / Touch Drag events per card
      this.bindDragEvents(cardPhysics)
    })

    // Bind Global event listeners to container
    window.addEventListener('resize', this.boundOnResize)
    this.container.addEventListener('mousemove', this.boundOnMouseMove)
    this.container.addEventListener('mouseleave', this.boundOnMouseLeave)
    this.container.addEventListener('mouseenter', this.boundOnMouseEnter)
    this.container.addEventListener('mouseup', this.boundOnMouseUp)

    // Touch events for mobile cursor/finger coordinates
    this.container.addEventListener('touchstart', (e) => {
      this.isMouseInContainer = true
      this.updateCoordinatesFromTouch(e)
    }, { passive: true })
    this.container.addEventListener('touchmove', this.boundOnTouchMove, { passive: true })
    this.container.addEventListener('touchend', this.boundOnTouchEnd)

    // Initial positioning render
    this.renderPositions()
  }

  /**
   * Bind drag handlers to a card instance
   */
  private bindDragEvents(card: CardPhysics): void {
    const onGrabStart = (clientX: number, clientY: number) => {
      // Mobile: disable grab-throw, keep float + repulsion
      const isMobile = window.innerWidth < 768
      if (isMobile) return

      card.isGrabbed = true
      
      const rect = card.element.getBoundingClientRect()
      const containerRect = this.container.getBoundingClientRect()

      // Calculate coordinates relative to the canvas container
      const localX = clientX - containerRect.left
      const localY = clientY - containerRect.top

      card.grabOffsetX = localX - card.x
      card.grabOffsetY = localY - card.y
      
      card.vx = 0
      card.vy = 0
      card.lastX = card.x
      card.lastY = card.y

      card.element.classList.remove('cursor-grab')
      card.element.classList.add('cursor-grabbing')
    }

    // MouseDown
    card.element.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return // Only primary click
      e.preventDefault()
      e.stopPropagation()
      onGrabStart(e.clientX, e.clientY)
    })
  }

  /**
   * Animation update loop running at 60fps
   */
  private update = (): void => {
    if (!this.active) return

    const containerWidth = this.container.clientWidth || window.innerWidth
    const containerHeight = this.container.clientHeight || window.innerHeight

    this.cards.forEach((card) => {
      if (card.isGrabbed) {
        // Track last positions to compute release speed on mouseup
        card.lastX = card.x
        card.lastY = card.y

        const containerRect = this.container.getBoundingClientRect()
        const localMouseX = this.mouseX - containerRect.left
        const localMouseY = this.mouseY - containerRect.top

        // Lock exactly to cursor offset
        card.x = localMouseX - card.grabOffsetX
        card.y = localMouseY - card.grabOffsetY
        
        // Instant speed calculations for throwing
        card.vx = (card.x - card.lastX) * this.THROW_MULTIPLIER
        card.vy = (card.y - card.lastY) * this.THROW_MULTIPLIER
      } else {
        // Apply normal physics: Floating drift + magnetic repulsion field
        let ax = 0
        let ay = 0

        // Cursor Repulsion Field
        if (this.isMouseInContainer) {
          const containerRect = this.container.getBoundingClientRect()
          const localMouseX = this.mouseX - containerRect.left
          const localMouseY = this.mouseY - containerRect.top

          // Center of the card
          const cardCenterX = card.x + card.width / 2
          const cardCenterY = card.y + card.height / 2

          const dx = cardCenterX - localMouseX
          const dy = cardCenterY - localMouseY
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < this.REPEL_RADIUS && distance > 5) {
            // Force = Strength / distance^2 (smooth, not jarring)
            const force = this.REPEL_STRENGTH / (distance * distance)
            // Gently add acceleration away from cursor
            ax += (dx / distance) * force * 0.15
            ay += (dy / distance) * force * 0.15
          }
        }

        // Apply acceleration to velocity
        card.vx += ax
        card.vy += ay

        // Handle thrown cards velocity decay (friction)
        const currentSpeed = Math.sqrt(card.vx * card.vx + card.vy * card.vy)
        const isFlying = currentSpeed > this.MAX_DRIFT_SPEED * 1.5

        if (isFlying) {
          card.vx *= this.FRICTION
          card.vy *= this.FRICTION
        } else {
          // If moving slower than drift, gently nudge towards natural drift
          const speedFactor = 0.03 // Easing rate back to natural drift
          card.vx += (card.driftVx - card.vx) * speedFactor
          card.vy += (card.driftVy - card.vy) * speedFactor
        }

        // Enforce minimal velocity so cards never freeze
        const speedNow = Math.sqrt(card.vx * card.vx + card.vy * card.vy)
        if (speedNow < this.MIN_SPEED_THRESHOLD) {
          card.vx = card.driftVx
          card.vy = card.driftVy
        }

        // Update positions
        card.x += card.vx
        card.y += card.vy

        // Elastic Boundary Collision (bounce softly off walls)
        // Left
        if (card.x < 0) {
          card.x = 0
          card.vx = -card.vx * this.ELASTICITY
        }
        // Right
        else if (card.x + card.width > containerWidth) {
          card.x = containerWidth - card.width
          card.vx = -card.vx * this.ELASTICITY
        }

        // Top
        if (card.y < 0) {
          card.y = 0
          card.vy = -card.vy * this.ELASTICITY
        }
        // Bottom
        else if (card.y + card.height > containerHeight) {
          card.y = containerHeight - card.height
          card.vy = -card.vy * this.ELASTICITY
        }
      }
    })

    // Render updated styles
    this.renderPositions()

    // Loop
    this.animationFrameId = requestAnimationFrame(this.update)
  }

  /**
   * Renders the translate3d transforms for high-performance updates
   */
  private renderPositions(): void {
    this.cards.forEach((card) => {
      // translate3d forces GPU rasterization for ultra-smooth 60fps movement
      card.element.style.transform = `translate3d(${card.x}px, ${card.y}px, 0)`
    })
  }

  // --- Handlers ---
  private onMouseMove(e: MouseEvent): void {
    this.lastMouseX = this.mouseX
    this.lastMouseY = this.mouseY
    this.mouseX = e.clientX
    this.mouseY = e.clientY
  }

  private onMouseEnter(): void {
    this.isMouseInContainer = true
  }

  private onMouseLeave(): void {
    this.isMouseInContainer = false
    // Release any grabbed cards if cursor leaves canvas entirely
    this.releaseAllCards()
  }

  private onMouseUp(e: MouseEvent): void {
    this.releaseAllCards()
  }

  private onTouchMove(e: TouchEvent): void {
    this.updateCoordinatesFromTouch(e)
  }

  private onTouchEnd(): void {
    this.isMouseInContainer = false
    this.releaseAllCards()
  }

  private onResize(): void {
    const containerWidth = this.container.clientWidth || window.innerWidth
    const containerHeight = this.container.clientHeight || window.innerHeight

    // Re-clamp all cards inside the resized screen size immediately
    this.cards.forEach((card) => {
      if (card.x + card.width > containerWidth) {
        card.x = Math.max(0, containerWidth - card.width)
      }
      if (card.y + card.height > containerHeight) {
        card.y = Math.max(0, containerHeight - card.height)
      }
    })
  }

  private updateCoordinatesFromTouch(e: TouchEvent): void {
    if (e.touches.length > 0) {
      this.mouseX = e.touches[0].clientX
      this.mouseY = e.touches[0].clientY
    }
  }

  private releaseAllCards(): void {
    this.cards.forEach((card) => {
      if (card.isGrabbed) {
        card.isGrabbed = false
        card.element.classList.remove('cursor-grabbing')
        card.element.classList.add('cursor-grab')
      }
    })
  }

  // --- Public Control APIs ---

  public show(): void {
    if (this.active) return
    this.active = true
    this.animationFrameId = requestAnimationFrame(this.update)
  }

  public hide(): void {
    this.active = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.releaseAllCards()
  }

  public destroy(): void {
    this.hide()

    // Unbind globals
    window.removeEventListener('resize', this.boundOnResize)
    this.container.removeEventListener('mousemove', this.boundOnMouseMove)
    this.container.removeEventListener('mouseleave', this.boundOnMouseLeave)
    this.container.removeEventListener('mouseenter', this.boundOnMouseEnter)
    this.container.removeEventListener('mouseup', this.boundOnMouseUp)
    
    // Touch
    this.container.removeEventListener('touchmove', this.boundOnTouchMove)
    this.container.removeEventListener('touchend', this.boundOnTouchEnd)

    // Clear nodes
    this.container.innerHTML = ''
    this.cards = []
  }
}
