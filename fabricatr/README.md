# Fabricatr — studio website

A static site for [Fabricatr](https://www.fabricatr.com), an independent design studio fabricating brands, websites, AI products and motion systems people can't forget. No framework, no build dependencies: HTML, CSS and three ES modules, generated from two data files.

**Concept.** Everything on the site is made of the same material. A field of threads runs through the opening; the wordmark is woven from the page itself and cinches under the cursor and under scroll. Every project owns a generative woven swatch (its *material*), which stands in until real imagery is dropped in, and which grows from its exhibit into the full-screen environment of its own page without a cut. One red thread runs through the whole thing.

## Pages

| Route | What it is |
|---|---|
| `/` | Opening (the Loom), seven exhibits, studio statement, capabilities system, clients line, final scene |
| `/work/` | The index: every exhibit as a typographic catalogue row, with a material preview under the cursor |
| `/work/<slug>/` | One page per project, each with its own recipe of blocks and its own environment colour |
| `/studio/` | Principles, process, capabilities |
| `/contact/` | Email, status, a form that opens an email or posts to an endpoint you set |

## Editing content

Everything editable lives in `data/`:

- `data/site.mjs` — name, positioning, email, locations, availability line, socials, form endpoint, client list, capabilities.
- `data/projects.mjs` — the exhibits, in order. Each has a name, category, year, disciplines, one line, a short description, an environment colour, a material, a page recipe and optional image slots.

After editing, regenerate the pages:

```bash
node scripts/build.mjs
```

That writes `index.html`, `work/…`, `studio/`, `contact/`, `sitemap.xml`, `robots.txt` and `favicon.svg`. Commit the output; the folder deploys as-is.

### Adding real project imagery

Every project has an `images` object. Fill in any of these paths (relative to the site root, e.g. `/assets/work/sandbanks/cover.jpg`) and the image is placed over the material automatically:

| Slot | Used by | Suggested size |
|---|---|---|
| `cover` | exhibit on the home page, index preview, page hero, next-exhibit strip | 2400 × 1600 |
| `wide` | full-bleed and offset blocks | 2800 × 1600 |
| `pair` | `[a, b]` side-by-side block | 1600 × 1200 each |
| `sequence` | `[f1, f2, f3, f4]` pinned horizontal sequence | 1600 × 1000 each |
| `desktop` | browser frame in the mockups block | 1600 × 1000 |
| `mobile` | phone frame in the mockups block | 780 × 1688 |
| `video` | `{ src, poster }` muted looping video block | mp4 or webm |

Use compressed JPEG or AVIF/WebP; images are lazy-loaded and use the exhibit transition unchanged.

### Page recipes

A project's `recipe` is an ordered list of blocks. Reorder, remove or repeat them per project so no two pages feel templated:

`hero:full` · `hero:split` · `hero:stack` · `hero:number` · `brief` · `statement` · `statement:right` · `full` · `full:inset` · `pair` · `offset` · `sequence` · `mockups` · `mockups:phone` · `type` · `palette` · `video` · `next`

### Materials

`material: { weave, warp, weft, accent, seed }` — weave is one of `plain`, `twill`, `herringbone`, `basket`, `pinstripe`, `satin`; warp and weft are the two thread colours; accent flecks a few threads (and every pinstripe); seed changes the variation. Rendered by `assets/js/material.js`.

## Placeholders to confirm before launch

- `site.email`, `site.social` links and `site.locations` are placeholders.
- Project years, disciplines, sectors, one-liners and statements were written to fit the layout. Nothing claims results, but confirm each with the client before publishing.
- `og.png` is a capture of the opening; replace it if you'd rather use a photograph.

## Deploying

The folder is a complete static site. On Vercel, create a project from this repo and set **Root Directory** to `fabricatr`; the included `vercel.json` handles clean URLs and long-cache headers for `assets/`. Netlify, Cloudflare Pages or any static host work the same way. Nothing to build on the server.

## Working on it

```bash
npm install                 # once, from the repo root (only for screenshots)
node scripts/build.mjs      # regenerate pages
node scripts/shots.mjs      # screenshot every route at 1440 and 390, the Loom under the cursor,
                            # the intro frames, a mid-transition frame and og.png → preview/fabricatr-shots/
```

Structure:

```
fabricatr/
  assets/css/fabricatr.css   design system: tokens, type, motion, every component, responsive rules
  assets/js/app.js           smooth scroll, nav and menu, reveals, capabilities, sequences, router and transitions
  assets/js/loom.js          the signature: thread physics and the variable-width wordmark
  assets/js/material.js      generative woven swatches
  assets/fonts/              Mona Sans (variable width and weight) and Newsreader Italic (display instance), self-hosted
  data/                      site.mjs and projects.mjs — the only files you need to edit
  scripts/build.mjs          generator
  scripts/shots.mjs          screenshot harness
```

## Design system in brief

- **Environments.** Calico `#efeae2` (light) and Carbon `#0f0e0c` (dark); each project sets its own environment colour on `body`, and the fixed nav inverts over any of them with a difference blend.
- **Thread.** `#e2381c`, used structurally: the red thread in the Loom, the woven tags, the active capability, the status dot.
- **Type.** Mona Sans for everything, with the width axis as an expressive dimension (75–125); Newsreader Italic for a handful of editorial words. Labels are 11px, tracked, uppercase, tabular.
- **Motion.** Three durations (220 / 640 / 1400 ms), expo-out for reveals, in-out for the weft strips. Word masks, weft-strip image reveals, a shuttle pass on hover, scroll-velocity cinch on titles. Everything respects `prefers-reduced-motion`, and the site reads correctly with every animation removed.
- **Transitions.** Exhibits FLIP into their page (the material scales to the viewport and the new page paints underneath); every other link uses the eight-strip weave wipe. Pages remain real HTML for SEO and no-JS visitors.
