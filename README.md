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
| `OffBrandKit` | All of the above in one file, for a single paste. |
| `overrides/Blend.tsx` | `withDifference` / `withExclusion` / `withIsolation` overrides for native layers. |

Every component shares the same controls for font, text, muted text, hairline, background, side padding and space above/below, so the rhythm stays consistent across pages.

## Getting it into Framer

Framer has no upload for an HTML site or a repo. Code goes in through its Code panel by pasting, and there are two ways to do that.

**One paste (recommended).** `framer/OffBrandKit.tsx` holds every component as a named export.

1. Open your Framer project. In the left sidebar switch to **Assets**, find **Code**, click **+** and choose **New file**. Name it `OffBrandKit`.
2. The code editor opens with a starter component. Select all, delete, paste the whole of `framer/OffBrandKit.tsx`, and wait for the status at the bottom to show it compiled.
3. Close the editor. All 13 components are now listed under **Assets → Code** and under **Insert → Code**.

**One file per component.** If Framer rejects the big file, paste the individual files from `framer/` instead: one new code file per component. Each is self-contained, and the file name in Framer can be anything.

**If Framer says "Failed to save file … No save id found"**, the code file was not registered before the paste, which is a Framer editor glitch rather than a problem with the code. Reload the browser tab, reopen the file and, if the contents are gone, paste again. If it still fails on the big file after a reload, use the per-component files.

**The preview panel next to the editor** shows a component with no page height, so it is a poor guide for the hero: put the component on a page with height set to Viewport and use Preview.

Either way, add `framer/overrides/Blend.tsx` as a new code file of type **Override** only if you want difference blend on native layers you draw yourself.

## Building the pages

1. **Page background** → Ink `#1d1d1d` on every page (select the page, Fill in the right panel).
2. **Home page.** Insert the components in this order, each with width **Fill**: OffBrandNav → OffBrandHero → FeaturedWork → IntroBlock → LogoGrid → Services → Statement → Testimonials → CTA → Footer. Then:
   - OffBrandNav: Position **Fixed**, pinned to the top, height auto.
   - OffBrandHero: height **Viewport** (100vh).
   - Everything else: height **Auto**. If a component shows a fixed height, switch it to Auto.
3. **Work page**: OffBrandNav → PageHeader → FeaturedWork with *Label column* off, *Stagger* off, and all your cards → CTA → Footer.
4. **Manifesto page**: OffBrandNav → PageHeader → three Statement blocks (label them 01, 02, 03; turn *Rings* off on two of them) → IntroBlock → CTA → Footer.
5. **Contact page**: OffBrandNav → PageHeader → ContactDetails → a native Framer Form block if you want a form → Footer.
6. Select a component and use the right-hand panel to set copy, images, colours and links. Every button, card, nav item, menu item and footer link has a Link control that accepts Framer pages.

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

- `kit/components/*.tsx` are the sources. `kit/shared/` holds the helpers and the sphere. `scripts/assemble.mjs` inlines them into `framer/*.tsx` and into the single `framer/OffBrandKit.tsx`, which is what you paste into Framer. Edit the kit, not `framer/`.
- `preview/dist/index.html` is a self-contained page (React and the font inlined); `preview/dist/artifact.html` is the same site for the claude.ai artifact viewer.
- `preview/shots/` holds the screenshots; `preview/compare.mjs` samples sphere colours against the reference when the gradient needs tuning.
