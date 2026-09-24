// Assembles the self-contained Framer files in framer/ from kit/:
// each kit/components/<Name>.tsx keeps its imports at the top and marks where
// shared code goes with `// @include helpers` / `// @include sphere`.
// Framer users paste one framer/*.tsx file and it works on its own.
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const shared = {
  helpers: await readFile(resolve(root, "kit/shared/helpers.tsx"), "utf8"),
  sphere: await readFile(resolve(root, "kit/shared/sphere.tsx"), "utf8"),
}
const banner = (name) =>
  `// Generated from kit/components/${name}.tsx by scripts/assemble.mjs. Edit the kit source, not this file.\n`

await mkdir(resolve(root, "framer"), { recursive: true })
const files = (await readdir(resolve(root, "kit/components"))).filter((f) => f.endsWith(".tsx"))
for (const file of files) {
  const src = await readFile(resolve(root, "kit/components", file), "utf8")
  const out = src.replace(/^\/\/ @include (\w+)\s*$/gm, (_, key) => {
    if (!shared[key]) throw new Error(`${file}: unknown include "${key}"`)
    return shared[key]
  })
  await writeFile(resolve(root, "framer", file), banner(file.replace(/\.tsx$/, "")) + out)
}
console.log(`assembled ${files.length} components into framer/`)
