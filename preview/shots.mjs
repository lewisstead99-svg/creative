// Screenshots every route of the built site at desktop and phone widths:
// the first screen, plus a full-page capture of each route.
import { chromium } from "playwright-core"
import { mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const shots = resolve(here, "shots")
await mkdir(shots, { recursive: true })
const base = pathToFileURL(resolve(here, "dist/index.html")).href

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" })
const targets = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
]
const routes = ["home", "work", "manifesto", "contact"]
for (const t of targets) {
  const page = await browser.newPage({ viewport: { width: t.width, height: t.height } })
  for (const route of routes) {
    await page.goto(`${base}#${route}`)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(400)
    if (route === "home") {
      await page.screenshot({ path: resolve(shots, `${t.name}-hero.png`) })
      await page.evaluate((h) => window.scrollTo(0, h * 1.35), t.height)
      await page.waitForTimeout(500)
      await page.screenshot({ path: resolve(shots, `${t.name}-work.png`) })
    }
    // walk the page so scroll-linked reveals settle before the full capture
    const total = await page.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < total; y += t.height * 0.8) {
      await page.evaluate((v) => window.scrollTo(0, v), y)
      await page.waitForTimeout(60)
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300)
    await page.screenshot({ path: resolve(shots, `${t.name}-${route}-full.png`), fullPage: true })
  }
  await page.close()
}
await browser.close()
console.log("screenshots written to preview/shots/")
