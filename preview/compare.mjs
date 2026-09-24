// Renders the preview at the reference's exact size and samples the same
// sphere points as the reference screenshot, printing both side by side.
import { chromium } from "playwright-core"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { PNG } from "./png.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const url = pathToFileURL(resolve(here, "dist/index.html")).href
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" })
const page = await browser.newPage({ viewport: { width: 1920, height: 999 } })
await page.goto(url)
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(300)
const buf = await page.screenshot({ path: resolve(here, "shots/compare-hero.png") })
await browser.close()
const png = PNG.parse(buf)
const pts = process.argv.slice(2).map((s) => s.split(",").map(Number))
for (const [x, y] of pts) {
  const [r, g, b] = png.at(x, y)
  console.log(`${x},${y} -> #${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`)
}
