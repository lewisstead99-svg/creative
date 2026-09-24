// material.js — generative woven swatches.
// Every project owns a material: two thread colours, a weave and a seed.
// Rendered once per canvas at the size it is shown; the thread pitch scales
// with width so the same material looks continuous when it grows from an
// exhibit to a full-screen hero.

const WEAVES = {
  plain: (i, j) => (i + j) % 2 === 0,
  twill: (i, j) => ((i + j) % 4) < 2,
  herringbone: (i, j) => {
    const band = Math.floor(i / 16) % 2
    const k = band ? i - j : i + j
    return (((k % 4) + 4) % 4) < 2
  },
  basket: (i, j) => (Math.floor(i / 2) + Math.floor(j / 2)) % 2 === 0,
  pinstripe: (i, j) => (i + j) % 2 === 0,
  satin: (i, j) => ((i * 3 + j) % 5) === 0,
}

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hex(c) {
  const s = c.replace("#", "")
  const n = parseInt(s.length === 3 ? s.split("").map((x) => x + x).join("") : s, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const rgb = ([r, g, b], k = 1) => `rgb(${clamp(r * k, 0, 255) | 0} ${clamp(g * k, 0, 255) | 0} ${clamp(b * k, 0, 255) | 0})`

export function parseSpec(el) {
  try { return JSON.parse(el.getAttribute("data-material")) } catch { return null }
}

/**
 * Render a material into a canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {{weave:string, warp:string, weft:string, accent?:string, seed?:number, pitch?:number}} spec
 * @param {{width?:number, height?:number, dpr?:number}} [opts]
 */
export function renderMaterial(canvas, spec, opts = {}) {
  const cw = Math.round(opts.width || canvas.clientWidth || canvas.width || 800)
  const ch = Math.round(opts.height || canvas.clientHeight || canvas.height || 600)
  if (!cw || !ch) return false
  const dpr = opts.dpr || Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(cw * dpr)
  canvas.height = Math.round(ch * dpr)
  const ctx = canvas.getContext("2d", { alpha: false })
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const rand = mulberry32(spec.seed || 7)
  const over = WEAVES[spec.weave] || WEAVES.plain
  const warp = hex(spec.warp || "#1a1a1a")
  const weft = hex(spec.weft || "#e8e2d8")
  const accent = hex(spec.accent || spec.warp || "#c9a96a")
  const pitch = spec.pitch || clamp(cw / 150, 3.6, 10)
  const cols = Math.ceil(cw / pitch) + 1
  const rows = Math.ceil(ch / pitch) + 1

  // per-thread variation: brightness and a little sway
  const warpK = new Float32Array(cols)
  const warpAcc = new Uint8Array(cols)
  for (let i = 0; i < cols; i++) {
    warpK[i] = 1 + (rand() - 0.5) * 0.16
    if (spec.weave === "pinstripe") warpAcc[i] = i % 14 === 6 ? 1 : 0
    else warpAcc[i] = rand() < 0.035 ? 1 : 0
  }
  const weftK = new Float32Array(rows)
  const weftPhase = new Float32Array(rows)
  for (let j = 0; j < rows; j++) {
    weftK[j] = 1 + (rand() - 0.5) * 0.14
    weftPhase[j] = rand() * Math.PI * 2
  }

  // base: the weft, as continuous bands with a soft cylinder shade
  ctx.fillStyle = rgb(weft, 0.86)
  ctx.fillRect(0, 0, cw, ch)
  const hl = pitch * 0.34
  for (let j = 0; j < rows; j++) {
    const y = j * pitch
    ctx.fillStyle = rgb(weft, weftK[j] * 0.94)
    ctx.fillRect(0, y, cw, pitch)
    ctx.fillStyle = rgb(weft, weftK[j] * 1.06)
    ctx.fillRect(0, y + pitch * 0.18, cw, hl)
  }

  // warp segments wherever the warp passes over the weft
  const sway = pitch * 0.12
  for (let i = 0; i < cols; i++) {
    const base = warpAcc[i] ? accent : warp
    const k = warpK[i]
    const dark = rgb(base, k * 0.92)
    const light = rgb(base, k * 1.12)
    const x = i * pitch
    let runStart = -1
    for (let j = 0; j <= rows; j++) {
      const isOver = j < rows && over(i, j)
      if (isOver && runStart < 0) runStart = j
      if (!isOver && runStart >= 0) {
        const y0 = runStart * pitch - pitch * 0.12
        const y1 = j * pitch + pitch * 0.12
        const dx = Math.sin(weftPhase[runStart % rows] + i * 0.35) * sway
        ctx.fillStyle = dark
        ctx.fillRect(x + dx, y0, pitch, y1 - y0)
        ctx.fillStyle = light
        ctx.fillRect(x + dx + pitch * 0.2, y0, hl, y1 - y0)
        runStart = -1
      }
    }
  }

  // light: one soft fold across the cloth, nothing more
  const g = ctx.createLinearGradient(0, 0, cw, ch)
  g.addColorStop(0, "rgba(255,255,255,0.10)")
  g.addColorStop(0.45, "rgba(255,255,255,0)")
  g.addColorStop(0.72, "rgba(0,0,0,0)")
  g.addColorStop(1, "rgba(0,0,0,0.20)")
  ctx.fillStyle = g
  ctx.fillRect(0, 0, cw, ch)
  const fold = ctx.createRadialGradient(cw * 0.28, ch * 0.3, 0, cw * 0.28, ch * 0.3, Math.max(cw, ch) * 0.9)
  fold.addColorStop(0, "rgba(255,255,255,0.09)")
  fold.addColorStop(1, "rgba(0,0,0,0.05)")
  ctx.fillStyle = fold
  ctx.fillRect(0, 0, cw, ch)
  return true
}

// Copy one rendered canvas into a fresh one (used by the page transition).
export function cloneCanvas(source) {
  const c = document.createElement("canvas")
  c.width = source.width
  c.height = source.height
  c.getContext("2d").drawImage(source, 0, 0)
  return c
}
