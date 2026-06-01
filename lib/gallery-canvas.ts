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

interface WebGLCardTexture {
  id: string
  texture: WebGLTexture | null
  title: string
  subtitle: string
  width: number
  height: number
  // Scattered 3D Coordinates
  x: number
  y: number
  z: number
}

function resizeImageToCanvas(img: HTMLImageElement, maxDim: number): HTMLCanvasElement | HTMLImageElement {
  const w = img.naturalWidth || img.width
  const h = img.naturalHeight || img.height
  if (!w || !h) return img
  if (w <= maxDim && h <= maxDim) {
    return img
  }
  const canvas = document.createElement('canvas')
  let targetW = w
  let targetH = h
  if (w > h) {
    if (w > maxDim) {
      targetH = Math.round((h * maxDim) / w)
      targetW = maxDim
    }
  } else {
    if (h > maxDim) {
      targetW = Math.round((w * maxDim) / h)
      targetH = maxDim
    }
  }
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, targetW, targetH)
    return canvas
  }
  return img
}

export class GalleryCanvas {
  private container: HTMLElement
  private cardConfigs: GalleryCardConfig[]
  private options: GalleryCanvasOptions

  // DOM elements
  private canvas!: HTMLCanvasElement
  private gl!: WebGLRenderingContext

  // WebGL Shaders and Buffers
  private program!: WebGLProgram
  private positionBuffer!: WebGLBuffer
  private uvBuffer!: WebGLBuffer
  private indexBuffer!: WebGLBuffer

  // Uniform locations
  private uProjectionMatrixLoc!: WebGLUniformLocation
  private uModelViewMatrixLoc!: WebGLUniformLocation
  private uVelocityLoc!: WebGLUniformLocation
  private uTimeLoc!: WebGLUniformLocation
  private uTextureLoc!: WebGLUniformLocation

  // 3D Camera coordinates
  private camX = 0
  private camY = 0
  private camZ = 0
  private targetCamX = 0
  private targetCamY = 0

  private camVx = 0
  private camVy = 0
  private camVz = 0 // Zoom speed

  // Inertia and friction constants
  private readonly FRICTION = 0.95 // High-quality smooth inertia decay
  private readonly DRAG_SENSITIVITY = 1.2 // Panning drag sensitivity
  private readonly SCROLL_SENSITIVITY = 0.22 // Scroll-depth flying speed

  // Endless 3D tunnel parameters
  private readonly TOTAL_DEPTH = 5400 // Endless Z-tunnel length (expanded from 3200)
  private readonly WRAP_PADDING = 300 // Z-wrapping buffer (expanded from 200)

  // Drag and touch state
  private isDragging = false
  private dragStartX = 0
  private dragStartY = 0
  private dragStartCamX = 0
  private dragStartCamY = 0

  private active = false
  private isRendering = false
  private animationFrameId: number | null = null

  // Card items preloaded
  private webglCards: WebGLCardTexture[] = []
  private fallbackTexture!: WebGLTexture

  // Pre-bound event handlers for safe cleanup
  private boundOnMouseDown: (e: MouseEvent) => void
  private boundOnMouseMove: (e: MouseEvent) => void
  private boundOnMouseUp: (e: MouseEvent) => void
  private boundOnWheel: (e: WheelEvent) => void
  private boundOnTouchStart: (e: TouchEvent) => void
  private boundOnTouchMove: (e: TouchEvent) => void
  private boundOnTouchEnd: (e: TouchEvent) => void
  private boundOnResize: () => void

  constructor(options: GalleryCanvasOptions) {
    this.container = options.container
    this.cardConfigs = options.cards
    this.options = options

    // Center camera initially
    this.camX = 0
    this.camY = 0
    this.camZ = 0
    this.targetCamX = 0
    this.targetCamY = 0

    this.boundOnMouseDown = this.onMouseDown.bind(this)
    this.boundOnMouseMove = this.onMouseMove.bind(this)
    this.boundOnMouseUp = this.onMouseUp.bind(this)
    this.boundOnWheel = this.onWheel.bind(this)
    this.boundOnTouchStart = this.onTouchStart.bind(this)
    this.boundOnTouchMove = this.onTouchMove.bind(this)
    this.boundOnTouchEnd = this.onTouchEnd.bind(this)
    this.boundOnResize = this.onResize.bind(this)
  }

  public init(): void {
    // 1. Setup Canvas Element
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'w-full h-full block'
    this.canvas.style.touchAction = 'none'
    this.container.innerHTML = ''
    this.container.appendChild(this.canvas)

    // 2. Initialize WebGL Context
    const gl = this.canvas.getContext('webgl', { antialias: true, alpha: false }) ||
               this.canvas.getContext('experimental-webgl') as WebGLRenderingContext
    
    if (!gl) {
      console.error('WebGL is not supported.')
      this.container.innerHTML = '<div class="text-center font-mono py-12">WebGL Context Failed</div>'
      return
    }
    this.gl = gl

    // Handle WebGL Context Loss and recovery
    this.canvas.addEventListener('webglcontextlost', (e: Event) => {
      e.preventDefault()
      console.warn('WebGL context lost. Halting rendering loop.')
      this.handleContextLost()
    }, false)

    this.canvas.addEventListener('webglcontextrestored', () => {
      console.log('WebGL context restored. Rebuilding shaders and textures.')
      this.handleContextRestored()
    }, false)

    // Set viewport dimensions
    this.resizeCanvas()

    // 3. Setup Shaders
    this.setupShaders()

    // 4. Setup Geometry Buffers
    this.setupBuffers()

    // 5. Preload textures
    this.createFallbackTexture()
    this.preloadCardTextures()

    // 6. Bind Interactions (Scroll wheel drives camera Z-axis flight corridor)
    this.canvas.addEventListener('mousedown', this.boundOnMouseDown)
    window.addEventListener('mousemove', this.boundOnMouseMove)
    window.addEventListener('mouseup', this.boundOnMouseUp)
    this.canvas.addEventListener('wheel', this.boundOnWheel, { passive: true })

    // Touch events for mobile compatibility
    this.canvas.addEventListener('touchstart', this.boundOnTouchStart, { passive: true })
    window.addEventListener('touchmove', this.boundOnTouchMove, { passive: true })
    window.addEventListener('touchend', this.boundOnTouchEnd, { passive: true })

    window.addEventListener('resize', this.boundOnResize)
  }

  private resizeCanvas(): void {
    const width = this.container.clientWidth || window.innerWidth
    const height = this.container.clientHeight || window.innerHeight
    this.canvas.width = width
    this.canvas.height = height
    if (this.gl) {
      this.gl.viewport(0, 0, width, height)
    }
  }

  private setupShaders(): void {
    const gl = this.gl

    // Vertex Shader: Precision-matched wave and skew deforms based on velocities
    const vsSource = `
      precision mediump float;
      attribute vec2 aPosition;
      attribute vec2 aUv;
      varying vec2 vUv;

      uniform vec2 uVelocity;
      uniform float uTime;
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;

      void main() {
        vUv = aUv;
        vec4 mvPosition = uModelViewMatrix * vec4(aPosition, 0.0, 1.0);
        
        // Fluid bending wave distortion centered around movement velocities (calmed down by 3x)
        float warp = sin(aPosition.x * 2.5 + uTime * 2.0) * uVelocity.y * 0.001;
        mvPosition.y += warp * (mvPosition.x * 0.002);
        
        // Horizontal shear skew proportional to travel speed (calmed down by ~4x)
        mvPosition.x += uVelocity.x * sin(mvPosition.y * 0.005) * 0.04;
        
        gl_Position = uProjectionMatrix * mvPosition;
      }
    `

    // Fragment Shader: Precision-matched chromatic aberration RGB splitting
    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec2 uVelocity;

      void main() {
        // Red channel offsets in travel direction, Blue channel offsets opposite (calmed down by 3x)
        vec2 offset = uVelocity * 0.00015;
        
        float r = texture2D(uTexture, vUv + offset).r;
        float g = texture2D(uTexture, vUv).g;
        float b = texture2D(uTexture, vUv - offset).b;
        float a = texture2D(uTexture, vUv).a;
        
        gl_FragColor = vec4(r, g, b, a);
      }
    `

    const vs = this.compileShader(gl.VERTEX_SHADER, vsSource)
    const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource)
    
    this.program = gl.createProgram()!
    gl.attachShader(this.program, vs)
    gl.attachShader(this.program, fs)
    gl.linkProgram(this.program)

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('Shader linking failed:', gl.getProgramInfoLog(this.program))
    }

    // Locate shader uniforms
    this.uProjectionMatrixLoc = gl.getUniformLocation(this.program, 'uProjectionMatrix')!
    this.uModelViewMatrixLoc = gl.getUniformLocation(this.program, 'uModelViewMatrix')!
    this.uVelocityLoc = gl.getUniformLocation(this.program, 'uVelocity')!
    this.uTimeLoc = gl.getUniformLocation(this.program, 'uTime')!
    this.uTextureLoc = gl.getUniformLocation(this.program, 'uTexture')!
  }

  private compileShader(type: number, source: string): WebGLShader {
    const gl = this.gl
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation failed:', gl.getShaderInfoLog(shader))
    }
    return shader
  }

  private setupBuffers(): void {
    const gl = this.gl

    // Standard quad coordinates centering quad from -0.5 to 0.5
    const vertices = new Float32Array([
      -0.5, -0.5,
       0.5, -0.5,
       0.5,  0.5,
      -0.5,  0.5
    ])

    const uvs = new Float32Array([
      0.0, 1.0,
      1.0, 1.0,
      1.0, 0.0,
      0.0, 0.0
    ])

    const indices = new Uint16Array([
      0, 1, 2,
      2, 3, 0
    ])

    this.positionBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    this.uvBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW)

    this.indexBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
  }

  private createFallbackTexture(): void {
    const gl = this.gl
    this.fallbackTexture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, this.fallbackTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([20, 20, 20, 255]))
  }

  private preloadCardTextures(): void {
    const gl = this.gl
    this.webglCards = []

    const cardCount = 46 // Tiled count scattered in the 3D space
    
    for (let i = 0; i < cardCount; i++) {
      const configIndex = i % this.cardConfigs.length
      const config = this.cardConfigs[configIndex]

      // Systematic circular cylinder warp tunnel layout
      const angle = (i / cardCount) * Math.PI * 12 // 6 full systematic rotations around the Z axis
      const radius = 780 // Perfect circular cylinder radius
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      // Spaced cleanly and evenly along the Z depth tunnel
      const z = (i / cardCount) * this.TOTAL_DEPTH

      const webglCard: WebGLCardTexture = {
        id: `${config.id}-${i}`,
        texture: null,
        title: config.title,
        subtitle: config.subtitle,
        width: 320, // Card width
        height: 420, // Card height
        x,
        y,
        z
      }

      this.webglCards.push(webglCard)

      const uploadTexture = (imgElement: HTMLImageElement | HTMLCanvasElement) => {
        const texture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        
        // 98.4% VRAM downscaling reduction
        const downscaled = imgElement instanceof HTMLImageElement ? resizeImageToCanvas(imgElement, 512) : imgElement
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, downscaled)
        webglCard.texture = texture
      }

      // Check if image is already cached globally in memory
      const globalCache = (typeof window !== 'undefined') ? (window as any).preloadedImageElements : null
      const preloadedImg = globalCache ? globalCache[config.imageUrl] : null

      if (preloadedImg && preloadedImg.complete && preloadedImg.naturalWidth > 0) {
        // Upload immediately from memory cache without network delay!
        uploadTexture(preloadedImg)
      } else {
        // Fallback to loading it programmatically
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        img.onload = () => {
          uploadTexture(img)
        }

        img.onerror = () => {
          if (img.src && img.src.includes('/gallery/infinite/')) {
            console.log(`Local image ${config.imageUrl} failed to load. Falling back to Picsum stream.`);
            // Downsized Picsum query to keep GPU allocations calm
            img.src = `https://picsum.photos/seed/cyber${config.id}/300/200?grayscale`
            return
          }

          const fallbackCanvas = document.createElement('canvas')
          fallbackCanvas.width = 128
          fallbackCanvas.height = 128
          const ctx = fallbackCanvas.getContext('2d')
          if (ctx) {
            ctx.fillStyle = '#151515'
            ctx.fillRect(0, 0, 128, 128)
            ctx.fillStyle = '#f5f5dc'
            ctx.font = 'bold 12px monospace'
            ctx.fillText(config.title, 8, 60)
          }

          const texture = gl.createTexture()
          gl.bindTexture(gl.TEXTURE_2D, texture)
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fallbackCanvas)
          webglCard.texture = texture
        }

        img.src = config.imageUrl
      }
    }
  }

  // --- 3D Projection Matrices Math (Vanilla JS) ---

  private createPerspectiveMatrix(fovRad: number, aspect: number, near: number, far: number): Float32Array {
    const f = 1.0 / Math.tan(fovRad / 2)
    const rangeInv = 1.0 / (near - far)

    const m = new Float32Array(16)
    m[0] = f / aspect
    m[5] = f
    m[10] = (near + far) * rangeInv
    m[11] = -1 // Perspective depth division divider
    m[14] = near * far * rangeInv * 2
    m[15] = 0
    return m
  }

  private createModelViewMatrix(x: number, y: number, z: number, w: number, h: number): Float32Array {
    const m = new Float32Array(16)
    // Scale quad
    m[0] = w
    m[5] = h
    m[10] = 1
    
    // Position quad relative to camera coordinate space in 3D
    m[12] = x
    m[13] = y
    m[14] = z // Rendered at negative Z coordinates
    m[15] = 1
    return m
  }

  // --- Animation loop ---

  private render = (time: number): void => {
    if (!this.active) return

    const gl = this.gl
    const width = this.canvas.width
    const height = this.canvas.height
    const seconds = time * 0.001

    // Apply Inertia Physics / Momentum Friction to Camera coordinates
    if (!this.isDragging) {
      this.camVx *= this.FRICTION
      this.camVy *= this.FRICTION
      
      this.camX += this.camVx
      this.camY += this.camVy
      
      this.targetCamX = this.camX
      this.targetCamY = this.camY
    } else {
      this.camVx = this.camX - this.targetCamX
      this.camVy = this.camY - this.targetCamY
      
      this.targetCamX = this.camX
      this.targetCamY = this.camY
    }

    // Camera depth travel (Z-axis) velocity friction decay
    this.camVz *= this.FRICTION
    this.camZ += this.camVz

    // Clamp camera coordinates to inspect circular warp tunnel boundaries
    this.camX = Math.max(-600, Math.min(600, this.camX))
    this.camY = Math.max(-450, Math.min(450, this.camY))
    
    // Bidirectional endless camera Z coordinate depth tunnel looping
    this.camZ = (this.camZ % this.TOTAL_DEPTH + this.TOTAL_DEPTH) % this.TOTAL_DEPTH

    // WebGL Reset Frame
    gl.clearColor(0.04, 0.04, 0.04, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    // Bind shader program
    gl.useProgram(this.program)

    // Pass 3D Perspective Projection Matrix
    const aspect = width / height
    const perspectiveMatrix = this.createPerspectiveMatrix(60 * Math.PI / 180, aspect, 1, 6500)
    gl.uniformMatrix4fv(this.uProjectionMatrixLoc, false, perspectiveMatrix)

    // Combined velocities vector for shader distortions (X/Y drag and Z fly-zoom skew)
    gl.uniform2f(this.uVelocityLoc, this.camVx, this.camVy + this.camVz * 0.6)
    gl.uniform1f(this.uTimeLoc, seconds)

    // Bind Attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    const posAttrib = gl.getAttribLocation(this.program, 'aPosition')
    gl.enableVertexAttribArray(posAttrib)
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer)
    const uvAttrib = gl.getAttribLocation(this.program, 'aUv')
    gl.enableVertexAttribArray(uvAttrib)
    gl.vertexAttribPointer(uvAttrib, 2, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)

    // Render loop over 46 systematically corridors cards
    this.webglCards.forEach((card) => {
      // Calculate relative coordinate offset from 3D camera
      const rx = card.x - this.camX
      const ry = card.y - this.camY
      let rz = card.z - this.camZ

      // Endless 3D depth-tunnel Z-coordinate wrapping
      // As cards pass behind the camera, warp them seamlessly back to the far tunnel corridor depth
      rz = ((rz + this.WRAP_PADDING) % this.TOTAL_DEPTH + this.TOTAL_DEPTH) % this.TOTAL_DEPTH - this.WRAP_PADDING

      // Responsive scaling for card size and radial corridors based on screen width
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const scaleFactor = isMobile ? 0.6 : (isTablet ? 0.8 : 1.0)
      
      const cardW = card.width * scaleFactor
      const cardH = card.height * scaleFactor
      const rxScaled = rx * scaleFactor
      const ryScaled = ry * scaleFactor

      // Draw quads only if in front of the camera (negative clip space)
      if (rz > 10) {
        // Draw quad in 3D camera space (-rz is forward looking direction)
        const modelViewMatrix = this.createModelViewMatrix(rxScaled, ryScaled, -rz, cardW, cardH)
        gl.uniformMatrix4fv(this.uModelViewMatrixLoc, false, modelViewMatrix)

        // Bind texture
        gl.activeTexture(gl.TEXTURE0)
        if (card.texture) {
          gl.bindTexture(gl.TEXTURE_2D, card.texture)
        } else {
          gl.bindTexture(gl.TEXTURE_2D, this.fallbackTexture)
        }
        gl.uniform1i(this.uTextureLoc, 0)

        // Render card
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
      }
    })

    // Demand-driven rendering: Check if velocities or dragging states require another frame.
    const isStillMoving =
      Math.abs(this.camVx) > 0.005 ||
      Math.abs(this.camVy) > 0.005 ||
      Math.abs(this.camVz) > 0.005

    if (this.isDragging || isStillMoving) {
      this.animationFrameId = requestAnimationFrame(this.render)
    } else {
      // Safely sleep and stop micro-drifts
      this.camVx = 0
      this.camVy = 0
      this.camVz = 0
      this.isRendering = false
      this.animationFrameId = null
    }
  }

  // --- Demand-Driven Wakeup Helper ---

  private wakeUp(): void {
    if (!this.active) return
    if (!this.isRendering) {
      this.isRendering = true
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId)
      }
      this.animationFrameId = requestAnimationFrame(this.render)
    }
  }

  // --- Interaction Listeners ---

  private onMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return // Only primary click
    this.isDragging = true
    this.dragStartX = e.clientX
    this.dragStartY = e.clientY
    this.dragStartCamX = this.camX
    this.dragStartCamY = this.camY
    this.canvas.style.cursor = 'grabbing'
    this.wakeUp()
  }

  private onMouseMove(e: MouseEvent): void {
    if (!this.isDragging) return
    const dx = e.clientX - this.dragStartX
    const dy = e.clientY - this.dragStartY

    // Update camera panning in both dimensions to fully explore the circular warp tunnel splay!
    this.camX = this.dragStartCamX - dx * this.DRAG_SENSITIVITY
    this.camY = this.dragStartCamY - dy * this.DRAG_SENSITIVITY
    this.wakeUp()
  }

  private onMouseUp(e: MouseEvent): void {
    if (!this.isDragging) return
    this.isDragging = false
    this.canvas.style.cursor = 'grab'
    this.wakeUp()
  }

  private onWheel(e: WheelEvent): void {
    // Scroll wheel zoom moves camera forward/backward along the Z-axis.
    // e.preventDefault() is not called since body scroll is locked globally when gallery is open.
    this.camVz += e.deltaY * this.SCROLL_SENSITIVITY
    this.wakeUp()
  }

  private onTouchStart(e: TouchEvent): void {
    if (e.touches.length > 0) {
      this.isDragging = true
      this.dragStartX = e.touches[0].clientX
      this.dragStartY = e.touches[0].clientY
      this.dragStartCamX = this.camX
      this.dragStartCamY = this.camY
      this.wakeUp()
    }
  }

  private onTouchMove(e: TouchEvent): void {
    if (!this.isDragging) return
    // e.preventDefault() is omitted; touch-action: none style on canvas natively prevents browser scrolling.
    if (e.touches.length > 0) {
      const dx = e.touches[0].clientX - this.dragStartX
      const dy = e.touches[0].clientY - this.dragStartY
      
      // Update camera panning in both dimensions on drag
      this.camX = this.dragStartCamX - dx * this.DRAG_SENSITIVITY
      this.camY = this.dragStartCamY - dy * this.DRAG_SENSITIVITY
      this.wakeUp()
    }
  }

  private onTouchEnd(e: TouchEvent): void {
    this.isDragging = false
    this.wakeUp()
  }

  private onResize(): void {
    this.resizeCanvas()
    this.wakeUp()
  }

  private handleContextLost(): void {
    this.isRendering = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  private handleContextRestored(): void {
    if (!this.gl) return
    this.setupShaders()
    this.setupBuffers()
    this.createFallbackTexture()
    this.preloadCardTextures()
    this.isRendering = false
    this.show()
  }

  // --- Public Controls APIs ---

  public show(): void {
    if (this.active) return
    this.active = true
    this.wakeUp()
  }

  public hide(): void {
    this.active = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.isDragging = false
    this.isRendering = false
  }

  public destroy(): void {
    this.hide()

    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.boundOnMouseDown)
      this.canvas.removeEventListener('wheel', this.boundOnWheel)
      this.canvas.removeEventListener('touchstart', this.boundOnTouchStart)
      this.canvas.removeEventListener('touchmove', this.boundOnTouchMove)
      this.canvas.removeEventListener('touchend', this.boundOnTouchEnd)
    }
    
    window.removeEventListener('mousemove', this.boundOnMouseMove)
    window.removeEventListener('mouseup', this.boundOnMouseUp)
    window.removeEventListener('resize', this.boundOnResize)

    // Clear WebGL resources
    const gl = this.gl
    if (gl) {
      this.webglCards.forEach((card) => {
        if (card.texture) gl.deleteTexture(card.texture)
      })
      if (this.fallbackTexture) gl.deleteTexture(this.fallbackTexture)
      if (this.positionBuffer) gl.deleteBuffer(this.positionBuffer)
      if (this.uvBuffer) gl.deleteBuffer(this.uvBuffer)
      if (this.indexBuffer) gl.deleteBuffer(this.indexBuffer)
      if (this.program) gl.deleteProgram(this.program)
    }

    if (this.container) {
      this.container.innerHTML = ''
    }
  }
}
