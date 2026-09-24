// shots.mjs — serves the site and screenshots every route at desktop and
// phone widths, plus the Loom under the cursor and a mid-transition frame.
// Run: node scripts/shots.mjs   (needs playwright-core from the repo root)
import { createServer } from "node:http"
import { readFile, stat, mkdir } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, extname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(resolve(root, "../package.json"))
const { chromium } = require("playwright-core")
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".xml": "application/xml", ".txt": "text/plain" }

const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname)
  let file = join(root, path)
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html")
  } catch { try { await stat(file + ".html"); file += ".html" } catch {} }
  try {
    const body = await readFile(file)
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" })
    res.end(body)
  } catch { res.writeHead(404); res.end("not found") }
})
await new Promise((r) => server.listen(0, r))
const base = `http://127.0.0.1:${server.address().port}`
const out = resolve(root, "../preview/fabricatr-shots")
await mkdir(out, { recursive: true })

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" })
const routes = ["", "work/", "studio/", "contact/", "work/sandbanks-concierge/", "work/private-market-club/", "work/drift-homes/", "work/reshot/", "work/52-pearce-avenue/", "work/berkeleys-drummond/", "work/acorn/"]
const only = process.argv[2]
const targets = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "phone", width: 390, height: 844, mobile: true },
]
const walk = async (page, h) => {
  const total = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < total; y += h * 0.7) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(90) }
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400)
}
for (const t of targets) {
  const ctx = await browser.newContext({ viewport: { width: t.width, height: t.height }, deviceScaleFactor: 1, isMobile: t.mobile, hasTouch: t.mobile })
  const page = await ctx.newPage()
  const errors = []
  page.on("pageerror", (e) => errors.push(e.message))
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()) })
  for (const route of routes) {
    if (only && !route.includes(only) && !(only === "home" && route === "")) continue
    const name = route ? route.replace(/\/$/, "").replace(/\//g, "-") : "home"
    if (route === "" && !t.mobile) {
      await page.goto(`${base}/`, { waitUntil: "commit" })
      for (const ms of [150, 450, 900]) { await page.waitForTimeout(ms === 150 ? 150 : 300); await page.screenshot({ path: resolve(out, `${t.name}-intro-${ms}.png`) }) }
    }
    await page.goto(`${base}/${route}`, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(2200)
    await page.screenshot({ path: resolve(out, `${t.name}-${name}-1.png`) })
    if (route === "" && !t.mobile) {
      await page.mouse.move(t.width * 0.5, t.height * 0.5)
      for (let i = 0; i <= 30; i++) { await page.mouse.move(t.width * (0.5 + i / 100), t.height * (0.5 - i / 150)); await page.waitForTimeout(16) }
      await page.waitForTimeout(500)
      await page.screenshot({ path: resolve(out, `${t.name}-${name}-loom-cursor.png`) })
      await page.mouse.move(-10, -10)
    }
    await walk(page, t.height)
    await page.screenshot({ path: resolve(out, `${t.name}-${name}-full.png`), fullPage: true })
  }
  // transition frame: click the first exhibit on the home page
  if (!only || only === "home") {
    await page.goto(`${base}/`, { waitUntil: "networkidle" })
    await page.waitForTimeout(1500)
    const media = await page.$("[data-exhibit] [data-media]")
    await media.scrollIntoViewIfNeeded()
    await page.waitForTimeout(1600)
    await page.screenshot({ path: resolve(out, `${t.name}-exhibit-hover.png`) })
    await page.click("[data-exhibit] [data-media]")
    await page.waitForTimeout(520)
    await page.screenshot({ path: resolve(out, `${t.name}-transition-mid.png`) })
    await page.waitForTimeout(1800)
    await page.screenshot({ path: resolve(out, `${t.name}-transition-end.png`) })
    // menu
    await page.click("[data-menu-toggle]")
    await page.waitForTimeout(1200)
    await page.screenshot({ path: resolve(out, `${t.name}-menu.png`) })
  }
  if (errors.length) console.log(`${t.name} errors:\n  ` + errors.join("\n  "))
  await ctx.close()
}
// og image: the opening at 1200×630
{
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  await page.goto(`${base}/`, { waitUntil: "networkidle" })
  await page.waitForTimeout(2400)
  await page.mouse.move(700, 250); for (let i = 0; i < 20; i++) { await page.mouse.move(700 + i * 8, 250 + i * 6); await page.waitForTimeout(16) }
  await page.waitForTimeout(350)
  await page.screenshot({ path: resolve(root, "og.png") })
  await ctx.close()
}
await browser.close()
server.close()
console.log(`screenshots in ${out}`)
