// Bundles the exact Framer component sources into:
//  - dist/index.html    self-contained (React + framer-motion inlined) for local checks
//  - dist/artifact.html the same page with React/ReactDOM loaded from cdnjs, for publishing
import { build } from "esbuild"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(here, "dist")
await mkdir(out, { recursive: true })

const woff2 = await readFile(resolve(here, "fonts/manrope-latin-wght-normal.woff2"))
const fontFace = `@font-face { font-family: "Manrope"; font-style: normal; font-weight: 200 800; font-display: block; src: url(data:font/woff2;base64,${woff2.toString("base64")}) format("woff2"); }`

// Maps `react` / `react-dom` imports to the UMD globals when they come from a CDN.
const reactGlobals = {
  name: "react-globals",
  setup(b) {
    b.onResolve({ filter: /^react$/ }, () => ({ path: "react", namespace: "globals" }))
    b.onResolve({ filter: /^react\/jsx-runtime$/ }, () => ({ path: "jsx", namespace: "globals" }))
    b.onResolve({ filter: /^react-dom$/ }, () => ({ path: "react-dom", namespace: "globals" }))
    b.onResolve({ filter: /^react-dom\/client$/ }, () => ({ path: "react-dom", namespace: "globals" }))
    b.onLoad({ filter: /.*/, namespace: "globals" }, (args) => {
      if (args.path === "react") return { contents: "module.exports = window.React", loader: "js" }
      if (args.path === "react-dom") return { contents: "module.exports = window.ReactDOM", loader: "js" }
      return {
        contents: `const R = window.React; const F = R.Fragment;
          const j = (t, p, k) => R.createElement(t, k === undefined ? p : { ...p, key: k }, ...(p && p.children !== undefined ? (Array.isArray(p.children) ? p.children : [p.children]) : []));
          export { j as jsx, j as jsxs, F as Fragment }`,
        loader: "js",
      }
    })
  },
}

async function bundle(external) {
  const result = await build({
    entryPoints: [resolve(here, "main.tsx")],
    bundle: true,
    minify: true,
    format: "iife",
    target: "es2020",
    jsx: "automatic",
    write: false,
    define: { "process.env.NODE_ENV": '"production"' },
    alias: { framer: resolve(here, "framer-stub.ts") },
    plugins: external ? [reactGlobals] : [],
    logLevel: "warning",
  })
  return result.outputFiles[0].text
}

async function page(templateName, js, outName) {
  const template = await readFile(resolve(here, templateName), "utf8")
  const html = template.replace("/*FONTS*/", () => fontFace).replace("<!--BUNDLE-->", () => `<script>${js}</script>`)
  await writeFile(resolve(out, outName), html)
  console.log(`preview/dist/${outName} written (${(html.length / 1024).toFixed(0)} KB)`)
}

await page("index.template.html", await bundle(false), "index.html")
await page("artifact.template.html", await bundle(true), "artifact.html")
