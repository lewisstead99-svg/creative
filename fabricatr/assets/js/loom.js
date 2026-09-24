// loom.js — the signature.
// A field of horizontal threads is drawn in the colour of the page over the
// wordmark, so the letters read as if they were woven from the page itself.
// The pointer pulls the threads (they converge on it like pinched cloth), the
// letters' width axis cinches where the cloth is under tension, and scroll
// velocity bunches the whole weave. One thread is red. Everything springs back.

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const expoOut = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
const R_LIMIT = (loom) => loom.radius * 0.9

export class Loom {
  /**
   * @param {HTMLElement} section
   * @param {{ canvas: HTMLCanvasElement, letters?: HTMLElement[], theme?: 'light'|'dark', intro?: boolean, tension?: () => number, velocity?: () => number }} o
   */
  constructor(section, o) {
    this.section = section
    this.canvas = o.canvas
    this.ctx = this.canvas.getContext("2d")
    this.letters = o.letters || []
    this.theme = o.theme || "light"
    this.getTension = o.tension || (() => 0)
    this.getVelocity = o.velocity || (() => 0)
    this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    this.coarse = matchMedia("(pointer: coarse)").matches
    this.pointer = { x: -9999, y: -9999, vx: 0, vy: 0, on: false, t: 0 }
    this.squeeze = 0
    this.squeezeV = 0
    this.visible = false
    this.running = false
    this.t0 = performance.now()
    this.introDone = !o.intro || this.reduced
    this.letterState = this.letters.map(() => ({ w: this.introDone ? 125 : 75, y: 0, o: this.introDone ? 1 : 0 }))
    this.resize = this.resize.bind(this)
    this.frame = this.frame.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.onTouch = this.onTouch.bind(this)

    this.resize()
    addEventListener("resize", this.resize)
    section.addEventListener("pointermove", this.onMove)
    section.addEventListener("pointerleave", this.onLeave)
    section.addEventListener("touchmove", this.onTouch, { passive: true })
    section.addEventListener("touchend", this.onLeave)
    this.io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; if (this.visible) this.start() }, { threshold: 0 })
    this.io.observe(section)
    if (this.introDone) section.classList.add("is-loomed")
    else setTimeout(() => section.classList.add("is-loomed"), 900)
  }

  resize() {
    const r = this.section.getBoundingClientRect()
    this.w = Math.max(1, Math.round(r.width))
    this.h = Math.max(1, Math.round(r.height))
    const dpr = Math.min(devicePixelRatio || 1, 2)
    this.canvas.width = this.w * dpr
    this.canvas.height = this.h * dpr
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.gap = clamp(this.h / 58, 11, 18)
    this.rows = Math.floor(this.h / this.gap) + 2
    this.step = clamp(this.w / 70, 12, 24)
    this.cols = Math.floor(this.w / this.step) + 2
    const n = this.rows * this.cols
    this.d = new Float32Array(n)
    this.v = new Float32Array(n)
    this.red = Math.round(this.rows * 0.64)
    this.radius = clamp(Math.min(this.w, this.h) * 0.17, 90, 220)
    this.measureLetters()
    this.draw(0)
  }

  measureLetters() {
    const s = this.section.getBoundingClientRect()
    this.letterBox = this.letters.map((el) => {
      const b = el.getBoundingClientRect()
      return { x: b.left - s.left + b.width / 2, y: b.top - s.top + b.height / 2 }
    })
  }

  onMove(e) {
    const r = this.section.getBoundingClientRect()
    const x = e.clientX - r.left, y = e.clientY - r.top
    const now = performance.now()
    const dt = Math.max(8, now - this.pointer.t)
    if (this.pointer.on) {
      this.pointer.vx = clamp((x - this.pointer.x) / dt * 16, -40, 40)
      this.pointer.vy = clamp((y - this.pointer.y) / dt * 16, -40, 40)
    }
    this.pointer.x = x; this.pointer.y = y; this.pointer.on = true; this.pointer.t = now
    this.start()
  }
  onTouch(e) {
    const t = e.touches[0]
    if (t) this.onMove({ clientX: t.clientX, clientY: t.clientY })
  }
  onLeave() { this.pointer.on = false; this.pointer.vx = this.pointer.vy = 0 }

  start() {
    if (this.running || this.reduced) return
    this.running = true
    this.last = performance.now()
    requestAnimationFrame(this.frame)
  }
  stop() { this.running = false }
  destroy() {
    this.stop(); this.io.disconnect()
    removeEventListener("resize", this.resize)
    this.section.removeEventListener("pointermove", this.onMove)
    this.section.removeEventListener("pointerleave", this.onLeave)
    this.section.removeEventListener("touchmove", this.onTouch)
    this.section.removeEventListener("touchend", this.onLeave)
  }

  frame(now) {
    if (!this.running) return
    const dt = clamp((now - this.last) / 16.667, 0.5, 2)
    this.last = now
    this.simulate(dt, now)
    this.draw(now)
    // idle out when nothing is happening and nothing is visible
    if (!this.visible || document.hidden) { this.running = false; return }
    requestAnimationFrame(this.frame)
  }

  simulate(dt, now) {
    const { d, v, cols, rows, step, gap } = this
    const tension = clamp(this.getTension(), 0, 1)
    const k = 0.045 + tension * 0.25
    const c = 0.19
    const cv = 0.03
    const steps = 2
    const h = dt / steps
    const damp = Math.pow(0.90 - tension * 0.1, h)
    const lim = R_LIMIT(this)
    const p = this.pointer
    const R = this.radius
    const R2 = 2 * R * R
    const reach = (R * 2.4) ** 2
    const pull = (1 - tension) * 0.16
    const drag = (1 - tension) * 0.22
    // scroll velocity → squeeze, as a critically damped spring
    const target = clamp(Math.abs(this.getVelocity()), 0, 1)
    this.squeezeV += (target - this.squeeze) * 0.09 * dt
    this.squeezeV *= Math.pow(0.82, dt)
    this.squeeze = clamp(this.squeeze + this.squeezeV * dt, 0, 1.2)

    for (let s = 0; s < steps; s++) {
      for (let j = 0; j < rows; j++) {
        const y = j * gap
        const row = j * cols
        const mass = j === this.red ? 1.35 : 1
        for (let i = 0; i < cols; i++) {
          const idx = row + i
          const di = d[idx]
          const l = i > 0 ? d[idx - 1] : di
          const r = i < cols - 1 ? d[idx + 1] : di
          const u = j > 0 ? d[idx - cols] : di
          const b = j < rows - 1 ? d[idx + cols] : di
          let a = -k * di + c * (l + r - 2 * di) + cv * (u + b - 2 * di)
          if (p.on) {
            const dx = i * step - p.x, dy = y - p.y
            const dist2 = dx * dx + dy * dy
            if (dist2 < reach) {
              const infl = Math.exp(-dist2 / R2)
              const want = clamp(-dy * 0.85, -R * 0.7, R * 0.7)
              a += (want - di) * infl * pull * mass + p.vy * infl * drag
            }
          }
          const nv = clamp((v[idx] + a * h) * damp, -lim, lim)
          v[idx] = nv
          d[idx] = clamp(di + nv * h, -lim, lim)
        }
      }
    }
    // pointer velocity decays between events
    p.vx *= Math.pow(0.85, dt); p.vy *= Math.pow(0.85, dt)

    // letters: cinch under the pointer, cinch under scroll, breathe back
    const sq = clamp(this.squeeze, 0, 1)
    const intro = this.introDone ? 1 : clamp((now - this.t0 - 250) / 1400, 0, 1)
    for (let n = 0; n < this.letters.length; n++) {
      const st = this.letterState[n]
      const box = this.letterBox[n]
      let infl = 0, dy = 0
      if (p.on && box) {
        const ddx = box.x - p.x, ddy = box.y - p.y
        infl = Math.exp(-(ddx * ddx + ddy * ddy) / (2 * (R * 1.5) ** 2))
        dy = clamp(-ddy * infl * 0.10, -14, 14)
      }
      let wantW = 125 - 45 * infl - 38 * sq
      let wantO = 1
      if (!this.introDone) {
        const e = expoOut(clamp((now - this.t0 - 250 - n * 55) / 1300, 0, 1))
        wantW = 75 + 50 * e - 45 * infl
        wantO = clamp(e * 2.2, 0, 1)
        if (n === this.letters.length - 1 && e >= 1) this.introDone = true
      }
      st.w += (wantW - st.w) * 0.14 * dt
      st.y += (dy - st.y) * 0.14 * dt
      st.o += (wantO - st.o) * 0.2 * dt
      const el = this.letters[n]
      el.style.fontVariationSettings = `"wdth" ${st.w.toFixed(1)}`
      el.style.transform = st.y * st.y > 0.01 ? `translateY(${st.y.toFixed(1)}px)` : ""
      if (st.o < 0.999) el.style.opacity = st.o.toFixed(3)
      else if (el.style.opacity) el.style.opacity = ""
    }
    void intro
  }

  draw(now) {
    const { ctx, w, h, cols, rows, step, gap, d } = this
    ctx.clearRect(0, 0, w, h)
    const dark = this.theme === "dark"
    const page = dark ? "#0f0e0c" : "#efeae2"
    const faint = dark ? "rgba(235,230,221,0.08)" : "rgba(23,21,18,0.06)"
    const tension = clamp(this.getTension(), 0, 1)
    const sq = clamp(this.squeeze, 0, 1)
    const cy = h * 0.5
    const breeze = this.reduced ? 0 : (1 - tension) * 1.6
    const t = now * 0.00045
    const intro = this.introDone ? 1 : clamp((now - this.t0) / 1100, 0, 1)

    for (let j = 0; j < rows; j++) {
      const row = j * cols
      const y0 = j * gap
      const reveal = this.introDone ? 1 : expoOut(clamp((intro * 1.6 - j / rows * 0.6), 0, 1))
      if (reveal <= 0) continue
      const xEnd = w * reveal
      ctx.beginPath()
      let px = 0, py = 0
      for (let i = 0; i < cols; i++) {
        const x = i * step
        const wave = breeze * Math.sin(i * 0.28 + t + j * 0.35)
        let y = y0 + d[row + i] + wave
        y += (cy - y) * sq * 0.28
        if (i === 0) { ctx.moveTo(x, y) } else {
          const mx = (px + x) / 2, my = (py + y) / 2
          ctx.quadraticCurveTo(px, py, mx, my)
        }
        px = x; py = y
        if (x > xEnd) break
      }
      ctx.lineTo(px, py)
      if (j === this.red) {
        ctx.strokeStyle = "#e2381c"; ctx.lineWidth = 1.6; ctx.stroke()
      } else {
        ctx.strokeStyle = page; ctx.lineWidth = 1.35; ctx.stroke()
        ctx.strokeStyle = faint; ctx.lineWidth = 1; ctx.stroke()
      }
    }
  }
}
