// app.js — Fabricatr
// One continuous canvas: pages are real HTML, but links swap <main> in place
// so an exhibit can grow into its own page without a cut.
import { renderMaterial, parseSpec, cloneCanvas } from "./material.js"
import { Loom } from "./loom.js"

const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
const fine = matchMedia("(pointer: fine)").matches
const root = document.documentElement

/* --------------------------------------------------------------------------
   Scroll — native scrolling, interpolated on wheel so it feels physical.
   Keyboard, scrollbar and touch stay native. Velocity is published as --vel.
   -------------------------------------------------------------------------- */
const smooth = {
  target: 0, current: 0, vel: 0, velSmooth: 0, animating: false, raf: 0, enabled: fine && !reduced,
  init() {
    this.target = this.current = scrollY
    addEventListener("wheel", (e) => this.onWheel(e), { passive: false })
    addEventListener("scroll", () => { if (!this.animating) { this.target = this.current = scrollY } this.track() }, { passive: true })
    addEventListener("resize", () => { this.target = clamp(this.target, 0, this.max()) })
  },
  max() { return Math.max(0, root.scrollHeight - innerHeight) },
  onWheel(e) {
    if (!this.enabled || e.ctrlKey || document.body.classList.contains("is-locked")) return
    if (e.target && e.target.closest && e.target.closest("[data-native-scroll]")) return
    e.preventDefault()
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1
    this.target = clamp(this.target + e.deltaY * unit, 0, this.max())
    if (!this.animating) { this.animating = true; this.raf = requestAnimationFrame((t) => this.frame(t)) }
  },
  frame() {
    const diff = this.target - this.current
    if (Math.abs(diff) < 0.4) {
      this.current = this.target; scrollTo(0, this.current); this.animating = false; this.vel = 0; this.publish(); return
    }
    this.current += diff * 0.11
    this.vel = diff * 0.11
    scrollTo(0, this.current)
    this.publish()
    this.raf = requestAnimationFrame((t) => this.frame(t))
  },
  lastY: 0, lastT: 0,
  track() {
    // velocity for native scrolling (touch / keyboard)
    const now = performance.now()
    const dt = Math.max(8, now - this.lastT)
    if (!this.animating) this.vel = (scrollY - this.lastY) / dt * 16
    this.lastY = scrollY; this.lastT = now
    this.publish()
  },
  publish() {
    const v = clamp(this.vel / 46, -1, 1)
    this.velSmooth += (v - this.velSmooth) * 0.35
    root.style.setProperty("--vel", this.velSmooth.toFixed(3))
    root.style.setProperty("--vel-abs", Math.abs(this.velSmooth).toFixed(3))
  },
  to(y, instant = false) {
    y = clamp(y, 0, this.max())
    if (instant || !this.enabled) { this.target = this.current = y; scrollTo(0, y); this.publish(); return }
    this.target = y
    if (!this.animating) { this.animating = true; this.raf = requestAnimationFrame((t) => this.frame(t)) }
  },
  velocity() { return this.velSmooth },
}

/* --------------------------------------------------------------------------
   Navigation
   -------------------------------------------------------------------------- */
const nav = {
  el: null, menu: null, toggle: null, open: false, lastY: 0,
  init() {
    this.el = $("[data-nav]"); this.menu = $("[data-menu]"); this.toggle = $("[data-menu-toggle]")
    if (!this.el) return
    addEventListener("scroll", () => this.onScroll(), { passive: true })
    this.toggle?.addEventListener("click", () => this.set(!this.open))
    addEventListener("keydown", (e) => { if (e.key === "Escape" && this.open) this.set(false) })
    $$("a", this.menu).forEach((a) => a.addEventListener("click", () => this.set(false)))
    this.current()
  },
  onScroll() {
    const y = scrollY
    const down = y > this.lastY + 4 && y > 120
    const up = y < this.lastY - 4
    if (down) this.el.classList.add("is-hidden")
    else if (up || y < 120) this.el.classList.remove("is-hidden")
    this.lastY = y
  },
  set(open) {
    this.open = open
    this.menu.classList.toggle("is-closing", !open)
    this.menu.classList.toggle("is-open", open)
    this.menu.setAttribute("aria-hidden", String(!open))
    this.toggle.setAttribute("aria-expanded", String(open))
    this.el.classList.toggle("is-menu", open)
    this.el.classList.remove("is-hidden")
    document.body.classList.toggle("is-locked", open)
    if (open) { $(".menu__inner", this.menu)?.focus({ preventScroll: true }) }
    else { this.toggle.focus({ preventScroll: true }); setTimeout(() => this.menu.classList.remove("is-closing"), 700) }
  },
  current() {
    const path = location.pathname.replace(/index\.html$/, "")
    $$("[data-nav] a, [data-menu] a").forEach((a) => {
      const href = a.getAttribute("href")
      const is = href && href !== "/" && path.startsWith(href.replace(/index\.html$/, ""))
      if (is) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current")
    })
  },
}

/* --------------------------------------------------------------------------
   Materials — render lazily, re-render when the box changes size
   -------------------------------------------------------------------------- */
const materials = {
  io: null, ro: null, sizes: new WeakMap(),
  init() {
    this.io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { this.paint(e.target); this.io.unobserve(e.target) }
    }, { rootMargin: "40% 0px" })
    this.ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const c = e.target, prev = this.sizes.get(c)
        const w = c.clientWidth, h = c.clientHeight
        if (!prev || !w || !h) continue
        if (Math.abs(w - prev.w) / prev.w > 0.15 || Math.abs(h - prev.h) / prev.h > 0.15) this.paint(c)
      }
    })
  },
  scan(scope) {
    $$("canvas[data-material]", scope).forEach((c) => { this.io.observe(c); this.ro.observe(c) })
  },
  paint(c) {
    const spec = parseSpec(c)
    if (!spec || !c.clientWidth || !c.clientHeight) return
    const w = c.clientWidth, h = c.clientHeight
    const go = () => { if (renderMaterial(c, spec)) { this.sizes.set(c, { w, h }); c.dataset.painted = "1" } }
    if ("requestIdleCallback" in window) requestIdleCallback(go, { timeout: 300 }); else go()
  },
}

/* --------------------------------------------------------------------------
   Reveals — words, blocks, media
   -------------------------------------------------------------------------- */
function splitWords(el) {
  if (el.dataset.split) return
  let n = 0
  const walk = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) {
        const parts = child.textContent.split(/(\s+)/)
        const frag = document.createDocumentFragment()
        for (const p of parts) {
          if (!p) continue
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); continue }
          const w = document.createElement("span"); w.className = "w"
          const s = document.createElement("span"); s.textContent = p; s.style.setProperty("--i", n++)
          w.appendChild(s); frag.appendChild(w)
        }
        child.replaceWith(frag)
      } else if (child.nodeType === 1 && child.tagName !== "BR") walk(child)
    }
  }
  walk(el)
  el.dataset.split = "1"
}
const reveals = {
  io: null,
  init() {
    this.io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); this.io.unobserve(e.target) }
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" })
  },
  scan(scope) {
    $$("[data-words]", scope).forEach(splitWords)
    $$("[data-reveal], [data-words], .exhibit, .case__media[data-weft], .index__row", scope).forEach((el) => this.io.observe(el))
  },
}

/* --------------------------------------------------------------------------
   Pointer helpers — a tip that follows the pointer, magnetic pills
   -------------------------------------------------------------------------- */
const tip = {
  el: null, x: 0, y: 0, tx: 0, ty: 0, on: false, raf: 0,
  init() {
    this.el = $("[data-tip]")
    if (!this.el || !fine) return
    addEventListener("pointermove", (e) => { this.tx = e.clientX; this.ty = e.clientY; if (this.on && !this.raf) this.loop() }, { passive: true })
  },
  show(text) { if (!this.el || !fine) return; this.el.textContent = text; this.on = true; this.el.classList.add("is-on"); this.x = this.tx; this.y = this.ty; this.loop() },
  hide() { if (!this.el) return; this.on = false; this.el.classList.remove("is-on") },
  loop() {
    this.raf = requestAnimationFrame(() => {
      this.x += (this.tx - this.x) * 0.22; this.y += (this.ty - this.y) * 0.22
      this.el.style.transform = `translate(${this.x}px, ${this.y + 28}px) translate(-50%, -50%) scale(${this.on ? 1 : 0.85})`
      this.raf = 0
      if (this.on || Math.abs(this.tx - this.x) > 0.5) this.loop()
    })
  },
}
function magnetic(scope) {
  if (!fine || reduced) return
  $$(".pill, .scene__mail, .opening__scroll", scope).forEach((el) => {
    let raf = 0
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => { el.style.transform = `translate(${dx * 6}px, ${dy * 6}px)` })
    })
    el.addEventListener("pointerleave", () => { cancelAnimationFrame(raf); el.style.transition = "transform 600ms cubic-bezier(0.16,1,0.3,1)"; el.style.transform = ""; setTimeout(() => (el.style.transition = ""), 600) })
  })
}

/* --------------------------------------------------------------------------
   Sections
   -------------------------------------------------------------------------- */
const looms = { hero: null, footer: null }
function initLooms(scope) {
  const hero = $("[data-loom='hero']", scope)
  if (hero && !looms.hero) {
    looms.hero = new Loom(hero, {
      canvas: $("[data-loom-canvas]", hero),
      letters: $$("[data-wordmark] i", hero),
      theme: "light", intro: true,
      velocity: () => smooth.velocity(),
    })
    fitWordmark(hero)
  }
  const foot = $("[data-loom='footer']")
  if (foot && !looms.footer) {
    looms.footer = new Loom(foot, {
      canvas: $("[data-loom-canvas]", foot),
      letters: [], theme: "dark", intro: false,
      velocity: () => smooth.velocity() * 0.6,
      tension: () => {
        const r = foot.getBoundingClientRect()
        // taut as the page ends
        return clamp((innerHeight - r.bottom + innerHeight * 0.35) / (innerHeight * 0.5), 0, 1)
      },
    })
  }
}
function fitWordmark(hero) {
  const span = $("[data-wordmark] > span", hero)
  if (!span) return
  const fit = () => {
    if (!matchMedia("(min-width: 761px)").matches) { span.style.fontSize = ""; looms.hero?.measureLetters(); return }
    // measure every letter at its widest (the resting state), whatever the loom is doing to it right now
    const letters = $$("i", span)
    const saved = letters.map((i) => i.style.fontVariationSettings)
    letters.forEach((i) => (i.style.fontVariationSettings = '"wdth" 125'))
    span.style.fontSize = "100px"
    const avail = hero.clientWidth - parseFloat(getComputedStyle(hero).paddingLeft) * 2
    const w = letters.reduce((sum, i) => sum + i.getBoundingClientRect().width, 0)
    if (w) span.style.fontSize = `${Math.floor(100 * avail / w * 0.985)}px`
    letters.forEach((i, n) => (i.style.fontVariationSettings = saved[n]))
    looms.hero?.measureLetters()
  }
  fit()
  document.fonts.load('600 100px "Mona Sans"').then(fit).catch(() => {})
  document.fonts.ready.then(fit)
  document.fonts.addEventListener("loadingdone", fit)
  addEventListener("resize", fit)
}

function initExhibits(scope) {
  $$("[data-transition='exhibit']", scope).forEach((link) => {
    const media = link.querySelector("[data-media]") || link.closest("[data-exhibit]")?.querySelector("[data-media]")
    link.addEventListener("pointerenter", () => { if (media) tip.show(link.dataset.tip || "Open exhibit"); prefetch(link.href) })
    link.addEventListener("pointerleave", () => tip.hide())
    link.addEventListener("focus", () => prefetch(link.href))
  })
}

function initSystem(scope) {
  const rows = $$("[data-row]", scope)
  if (!rows.length) return
  const list = rows[0].parentElement
  const thread = $(".system__thread", list)
  const place = (row) => {
    if (!thread || !row) return
    thread.style.top = `${row.offsetTop}px`
    thread.style.height = `${row.offsetHeight}px`
  }
  const open = (row) => {
    rows.forEach((r) => { const is = r === row; r.classList.toggle("is-open", is); $("button", r).setAttribute("aria-expanded", String(is)) })
    place(row)
    setTimeout(() => place(row), 660)
  }
  rows.forEach((row) => {
    const btn = $("button", row)
    btn.addEventListener("click", () => { row.classList.contains("is-open") ? open(null) : open(row) })
    if (fine) row.addEventListener("pointerenter", () => open(row))
  })
  addEventListener("resize", () => place(rows.find((r) => r.classList.contains("is-open"))))
  open(rows[0])
}

function initWoven(scope) {
  const track = $("[data-woven-track]", scope)
  if (!track || reduced) return
  const sec = track.closest("section")
  const tick = () => {
    const r = sec.getBoundingClientRect()
    const p = clamp(1 - (r.top + r.height) / (innerHeight + r.height), 0, 1)
    const over = Math.max(0, track.scrollWidth - innerWidth + parseFloat(getComputedStyle(track).paddingLeft) * 2)
    track.style.transform = `translate3d(${(-over * p).toFixed(1)}px, 0, 0)`
  }
  addEventListener("scroll", tick, { passive: true }); addEventListener("resize", tick); tick()
}

function initSequence(scope) {
  $$("[data-sequence]", scope).forEach((sec) => {
    const track = $(".case__seq-track", sec)
    const tick = () => {
      if (!matchMedia("(min-width: 761px)").matches) { track.style.transform = ""; return }
      const r = sec.getBoundingClientRect()
      const p = clamp(-r.top / (r.height - innerHeight), 0, 1)
      const over = Math.max(0, track.scrollWidth - innerWidth)
      track.style.transform = `translate3d(${(-over * p).toFixed(1)}px, 0, 0)`
    }
    addEventListener("scroll", tick, { passive: true }); addEventListener("resize", tick); tick()
  })
}

function initIndex(scope) {
  const peek = $("[data-peek]")
  const rows = $$("[data-index-row]", scope)
  if (!peek || !rows.length || !fine) return
  const canvas = $("canvas", peek)
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0, on = false
  const loop = () => {
    x += (tx - x) * 0.14; y += (ty - y) * 0.14
    peek.style.left = `${x}px`; peek.style.top = `${y}px`
    raf = (on || Math.abs(tx - x) > 0.5) ? requestAnimationFrame(loop) : 0
  }
  addEventListener("pointermove", (e) => { tx = e.clientX + 40; ty = e.clientY; if (!raf) loop() }, { passive: true })
  rows.forEach((row) => {
    row.addEventListener("pointerenter", () => {
      const spec = parseSpec(row.querySelector("[data-material]"))
      if (spec) renderMaterial(canvas, spec, { width: peek.clientWidth, height: peek.clientHeight })
      on = true; peek.classList.add("is-on"); if (!raf) loop()
    })
    row.addEventListener("pointerleave", () => { on = false; peek.classList.remove("is-on") })
  })
}

function initClock() {
  const els = $$("[data-clock]")
  if (!els.length) return
  const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" })
  const tick = () => els.forEach((el) => (el.textContent = fmt.format(new Date())))
  tick(); setInterval(tick, 15000)
}

function initForm(scope) {
  const form = $("[data-form]", scope)
  if (!form) return
  form.addEventListener("submit", (e) => {
    if (form.getAttribute("action")) return
    e.preventDefault()
    const data = new FormData(form)
    const body = [...data.entries()].map(([k, v]) => `${k}: ${v}`).join("\n")
    location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent("New project — " + (data.get("name") || ""))}&body=${encodeURIComponent(body)}`
  })
}

function initAnchors(scope) {
  $$("a[href^='#']", scope).forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1)
      const target = id ? document.getElementById(id) : document.body
      if (!target) return
      e.preventDefault()
      smooth.to(target.getBoundingClientRect().top + scrollY - (id ? 0 : 0))
    })
  })
}

/* --------------------------------------------------------------------------
   Router — fetch, swap <main>, keep the canvas continuous
   -------------------------------------------------------------------------- */
const cache = new Map()
async function fetchPage(url) {
  if (cache.has(url)) return cache.get(url)
  const p = fetch(url, { headers: { "X-Requested-With": "fabricatr" } }).then((r) => { if (!r.ok) throw new Error(r.status); return r.text() })
  cache.set(url, p)
  p.catch(() => cache.delete(url))
  return p
}
function prefetch(href) { try { const u = new URL(href, location.href); if (u.origin === location.origin) fetchPage(u.href).catch(() => {}) } catch {} }

function swap(html, url) {
  const doc = new DOMParser().parseFromString(html, "text/html")
  const newMain = $("main", doc)
  if (!newMain) throw new Error("no main")
  const oldMain = $("main")
  document.title = doc.title
  const desc = $("meta[name='description']", doc)?.content
  if (desc) $("meta[name='description']").content = desc
  const nb = doc.body
  document.body.dataset.theme = nb.dataset.theme || "light"
  if (nb.dataset.env) { document.body.dataset.env = nb.dataset.env; document.body.style.setProperty("--env", nb.dataset.env) }
  else { delete document.body.dataset.env; document.body.style.removeProperty("--env") }
  document.body.dataset.page = nb.dataset.page || ""
  oldMain.replaceWith(newMain)
  if (looms.hero) { looms.hero.destroy(); looms.hero = null }
  smooth.to(0, true)
  nav.current()
  initPage(newMain)
  return newMain
}

let busy = false
async function navigate(url, { mode = "wipe", from = null, push = true } = {}) {
  if (busy) return
  busy = true
  nav.set(false)
  tip.hide()
  try {
    if (mode === "exhibit" && from && !reduced) await exhibitTransition(url, from)
    else await wipeTransition(url)
    if (push) history.pushState({ url }, "", url)
  } catch (err) {
    location.href = url
  } finally { busy = false }
}

async function wipeTransition(url) {
  const wipe = $("[data-wipe]")
  const pageP = fetchPage(url)
  if (reduced || !wipe) { swap(await pageP, url); return }
  wipe.classList.add("is-on"); await nextFrame()
  wipe.classList.add("is-in")
  const [html] = await Promise.all([pageP, wait(560)])
  swap(html, url)
  await nextFrame(); await wait(80)
  wipe.classList.remove("is-in"); wipe.classList.add("is-out")
  await wait(600)
  wipe.classList.remove("is-on", "is-out")
}

async function exhibitTransition(url, media) {
  const transit = $("[data-transit]")
  const source = media.querySelector("img[src], video[src], canvas[data-painted]") || media.querySelector("canvas")
  if (!transit || !source) return wipeTransition(url)
  const rect = media.getBoundingClientRect()
  const vw = innerWidth, vh = innerHeight
  const s = Math.max(rect.width / vw, rect.height / vh)
  const clone = source.tagName === "CANVAS" ? cloneCanvas(source) : source.cloneNode(true)
  transit.replaceChildren(clone)
  transit.style.transition = "none"
  transit.style.opacity = "1"
  transit.style.transform = `translate(${rect.left}px, ${rect.top}px) scale(${s})`
  transit.style.clipPath = `inset(0 ${vw - rect.width / s}px ${vh - rect.height / s}px 0)`
  transit.classList.add("is-on")
  const pageP = fetchPage(url)
  await nextFrame()
  transit.style.transition = "transform 1050ms cubic-bezier(0.83,0,0.17,1), clip-path 1050ms cubic-bezier(0.83,0,0.17,1)"
  transit.style.transform = "none"
  transit.style.clipPath = "inset(0)"
  const [html] = await Promise.all([pageP, wait(1080)])
  swap(html, url)
  // let the new hero paint its own material under the clone, then let go
  await nextFrame(); await wait(120)
  transit.style.transition = "opacity 720ms cubic-bezier(0.16,1,0.3,1)"
  transit.style.opacity = "0"
  await wait(740)
  transit.classList.remove("is-on")
  transit.replaceChildren()
  transit.style.cssText = ""
}

function initRouter() {
  history.scrollRestoration = "manual"
  addEventListener("click", (e) => {
    const a = e.target.closest("a[href]")
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank" || a.hasAttribute("download")) return
    const href = a.getAttribute("href")
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return
    const u = new URL(a.href, location.href)
    if (u.origin !== location.origin) return
    if (u.pathname === location.pathname) { e.preventDefault(); nav.set(false); smooth.to(0); return }
    e.preventDefault()
    const media = a.dataset.transition === "exhibit" ? (a.querySelector("[data-media]") || a.closest("[data-exhibit]")?.querySelector("[data-media]")) : null
    navigate(u.href, { mode: media ? "exhibit" : "wipe", from: media })
  })
  addEventListener("popstate", () => navigate(location.href, { mode: "wipe", push: false }))
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
function initPage(scope) {
  materials.scan(scope)
  reveals.scan(scope)
  initLooms(scope)
  initExhibits(scope)
  initSystem(scope)
  initWoven(scope)
  initSequence(scope)
  initIndex(scope)
  initForm(scope)
  initAnchors(scope)
  magnetic(scope)
}

smooth.init()
nav.init()
materials.init()
reveals.init()
tip.init()
initClock()
initRouter()
initPage(document)
// the footer belongs to every page
materials.scan($("[data-scene]") || document)
magnetic($("[data-scene]") || document)
document.documentElement.classList.add("is-ready")
