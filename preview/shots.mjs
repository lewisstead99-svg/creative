// Screenshots the built preview at desktop and phone widths, at the top of
// the page and scrolled into the featured-work section.
import { chromium } from "playwright-core"
import { mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const shots = resolve(here, "shots")
await mkdir(shots, { recursive: true })
const url = pathToFileURL(resolve(here, "dist/index.html")).href

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" })
const targets = [
  { name: "desktop", width: 1920, height: 1000 },
  { name: "laptop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
]
for (const t of targets) {
  const page = await browser.newPage({ viewport: { width: t.width, height: t.height } })
  await page.goto(url)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  await page.screenshot({ path: resolve(shots, `${t.name}-hero.png`) })
  await page.evaluate((h) => window.scrollTo(0, h * 1.35), t.height)
  await page.waitForTimeout(500)
  await page.screenshot({ path: resolve(shots, `${t.name}-work.png`) })
  await page.close()
}
await browser.close()
console.log("screenshots written to preview/shots/")
