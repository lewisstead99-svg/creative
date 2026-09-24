# OFF+BRAND Framer site kit

A full agency website in the style of [itsoffbrand.com](https://www.itsoffbrand.com), built as **Framer code components**: paste the files into Framer, drop the sections on pages, and set copy, images and links in the property panel. The same components are also bundled into a static site (`preview/dist`) that deploys to Vercel as-is, so you can see the whole thing live before touching Framer.

Built from `design/DESIGN.md` and `design/tokens.json` (the extracted style guide) and checked against the reference screenshots in `design/reference/`.

## Pages you get

| Page | Sections, top to bottom |
|---|---|
| Home | OffBrandNav · OffBrandHero · FeaturedWork · IntroBlock · LogoGrid · Services · Statement · Testimonials · CTA · Footer |
| Work | OffBrandNav · PageHeader · FeaturedWork (label column off, no stagger) · CTA · Footer |
| Manifesto | OffBrandNav · PageHeader · Statement ×3 · IntroBlock · CTA · Footer |
| Contact | OffBrandNav · PageHeader · ContactDetails · Footer |

`preview/main.tsx` is the reference assembly for all four.

## Components

All in `framer/`. Every file is self-contained; paste one and it works.

| Component | What it does |
|---|---|
| `OffBrandNav` | Wordmark, ↗ links, ghost Contact pill. Hides on scroll-down. Fixed menu button opens a full-screen menu (display-size links, socials, email). Status dot. |
| `OffBrandHero` | Three staggered display lines in difference blend over the pure-CSS sphere, dotted rings, orbiting dot, scroll cue. Sphere pins itself, grows and slides on scroll, then fades so later sections sit on clean Ink. |
| `FeaturedWork` | Label + All work pill with superscript count, staggered square card grid. Grid-paper placeholder until an image is set. Label column can be turned off for the Work page. |
| `IntroBlock` | Eyebrow, tracked uppercase lead, ghost link; body copy on the right. |
| `LogoGrid` | Hairline grid of client cells; logo image or text name per cell; White / Ink / Original logo treatment. |
| `Services` | Label, heading, hairline rows: title, one-line description, ↗. |
| `Statement` | Display paragraph that reveals word by word on scroll, ghost link, ring ornament. |
| `Testimonials` | One quote at a time, name and role, counter, prev/next, optional autoplay. |
| `CTA` | Two display lines, ghost pill, email, rings with orbiting dot. |
| `Footer` | Link columns, edge-to-edge wordmark, hairline bottom bar with © year, note, availability dot, back to top. |
| `PageHeader` | Inner-page opener: eyebrow, display title with optional count, intro. |
| `ContactDetails` | Hairline grid of ways to reach you. Pair with Framer's native Form block. |
| `IridescentSphere` | The sphere alone, for any other page. |
| `overrides/Blend.tsx` | `withDifference` / `withExclusion` / `withIsolation` overrides for native layers. |

Every component shares the same controls for font, text, muted text, hairline, background, side padding and space above/below, so the rhythm stays consistent across pages.

## Install in Framer

1. **Assets → Code → Create code file.** Name it exactly as the component (`OffBrandHero`, `OffBrandNav`, …), paste the matching file from `framer/`, save. Repeat for each component you need. Add `Blend` as an **Override** file if you want blend on native layers.
2. **Page background** → Ink `#1d1d1d` on every page.
3. **Home page**, as a vertical stack: OffBrandNav (Position: Fixed, width fill, height auto) → OffBrandHero (height 100vh / Fit viewport) → FeaturedWork → IntroBlock → LogoGrid → Services → Statement → Testimonials → CTA → Footer. Everything below the hero is height auto.
4. **Work page**: OffBrandNav → PageHeader → FeaturedWork with *Label column* off, *Stagger* off, and all your cards → CTA → Footer.
5. **Manifesto page**: OffBrandNav → PageHeader → three Statement blocks (label them 01, 02, 03; turn *Rings* off on two of them) → IntroBlock → CTA → Footer.
6. **Contact page**: OffBrandNav → PageHeader → ContactDetails → a native Framer Form block if you want a form → Footer.
7. Wire links: every button, card, nav item and footer link has a Link control that accepts Framer pages.

The canvas shows the hero sphere pinned inside the hero. Press **Preview** to see the sphere carry over into the featured cards and fade out further down.

## Fonts

The reference uses Ataero Retina OB, a licensed custom face. Upload it under **Site settings → Fonts → Custom** and pick it in each component's **Font** control. Until then the components fall back to Manrope, then Instrument Sans, then Inter. Manrope is the stand-in used in the preview and is the closest free match. Weight 500 in Manrope reads like 400 in the original.

## Decisions to know about

**Dark, not parchment.** The style guide describes a warm-parchment canvas, but both reference screenshots are Ink with Parchment text, and the headline colour sampled from the screenshot is exactly what Parchment text produces under a difference blend over Ink. Defaults match the screenshots. Parchment mode on any section is three colour changes: Background `#e5e4e0`, Text `#1d1d1d`, Hairline `rgba(29,29,29,0.2)`. On the hero, leave the headline colour and blend alone: the difference blend turns Parchment text black on Parchment and still inverts over the sphere.

**Cards rounded 10px.** The guide says 0; the live site measures about 10px, which is also the `radius-lg` token. One field to change.

**The gradient appears once.** Only the hero has the sphere. Later sections use the rings and the dot, never the gradient, as the style guide asks.

## Placeholder content

Copy, client names, testimonials, address and phone number are placeholders written to fit the layout. Replace them in the property panel before this goes anywhere public. Card images and logos are empty; the grid-paper pattern and text names only show while they are.

## Deploying the static build

`vercel.json` points Vercel at `preview/dist`, and the build writes one HTML per route (`/`, `/work`, `/manifesto`, `/contact`). Push the branch and Vercel builds it. This is a demo of the components, not a CMS: change copy in `preview/main.tsx` or the component defaults and push again.

## Working on it locally

```bash
npm install
npm run check   # assemble kit → framer/, typecheck, build preview/dist, screenshot every route
```

- `kit/components/*.tsx` are the sources. `kit/shared/` holds the helpers and the sphere. `scripts/assemble.mjs` inlines them into `framer/*.tsx`, which is what you paste into Framer. Edit the kit, not `framer/`.
- `preview/dist/index.html` is a self-contained page (React and the font inlined); `preview/dist/artifact.html` is the same site for the claude.ai artifact viewer.
- `preview/shots/` holds the screenshots; `preview/compare.mjs` samples sphere colours against the reference when the gradient needs tuning.
