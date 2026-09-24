# OFF+BRAND Framer kit

A recreation of the [itsoffbrand.com](https://www.itsoffbrand.com) hero and featured-work section as **Framer code components**. Paste four files into Framer, drop three components on a page, set your copy and images in the property panel. Everything that native Framer layers cannot do (the pure-CSS iridescent sphere, the difference-blend headline, the sphere growing and sliding as you scroll) lives in the components.

Built from `design/DESIGN.md` and `design/tokens.json` (the extracted style guide) and checked against the two reference screenshots in `design/reference/`.

## Files

| File | What it is |
|---|---|
| `framer/OffBrandHero.tsx` | Full hero: three staggered display lines, sphere + rings + orbiting dot, scroll cue. Sphere can pin itself as Fixed and grow on scroll. |
| `framer/OffBrandNav.tsx` | Wordmark, external links with ↗, ghost Contact pill, fixed bottom-right menu button and bottom-left status dot. Hides on scroll-down. |
| `framer/FeaturedWork.tsx` | Section label, All work pill with superscript count, staggered square card grid. Cards with no image show the grid-paper placeholder. |
| `framer/IridescentSphere.tsx` | The sphere alone, for any other page or section. Same controls as the hero's sphere. |
| `framer/overrides/Blend.tsx` | Code overrides (`withDifference`, `withExclusion`, `withIsolation`) for native text layers you draw yourself over the sphere. |
| `preview/` | Local harness that bundles the exact same TSX and screenshots it, so the kit is verified in a real browser before it goes into Framer. |
| `design/` | The style guide, tokens, CSS variables and the two reference screenshots. |

Every component file is self-contained. Paste one and it works; there are no imports between them.

## Install in Framer

1. In your Framer project open **Assets → Code → Create code file**. Name it exactly `OffBrandHero`, replace the contents with `framer/OffBrandHero.tsx`, save.
2. Repeat for `OffBrandNav`, `FeaturedWork` and (optionally) `IridescentSphere`.
3. Create one more code file named `Blend`, choose **Override** as the type, paste `framer/overrides/Blend.tsx`.
4. Set the page background to Ink `#1d1d1d` (Page settings → Background).
5. Build the page as a vertical stack:
   - **OffBrandNav** at the top. Position: **Fixed**, width fill, height auto.
   - **OffBrandHero** next. Width fill, height **100vh** (or "Fit viewport").
   - **FeaturedWork** under it. Width fill, height auto. Its background is transparent so the sphere shows through.
6. Select the hero and set your three lines, the font, and the sphere colours in the property panel. Select FeaturedWork and add cards: title, image, link.

The canvas shows the sphere pinned inside the hero. Press **Preview** to see the real thing: the sphere stays on screen and grows and slides left as the featured cards scroll over it, exactly like the reference.

If you want the sphere inside the hero only (no carry-over into the next section), set the hero's **Sphere pin** to *Inside hero*.

## Fonts

The site uses Ataero Retina OB, a custom licensed face. Upload it in **Site settings → Fonts → Custom** and pick it in each component's **Font** control. Until then the components fall back to Manrope, then Instrument Sans, then Inter. Manrope is the stand-in used in the preview and is the closest free match (geometric, tall x-height, open counters). Weight 500 in Manrope reads like 400 in the original.

## Two decisions to know about

**Dark, not parchment.** The extracted style guide describes a warm-parchment canvas, but both reference screenshots are Ink `#1d1d1d` with Parchment text, and the headline colour sampled from the screenshot is exactly what Parchment text produces under a difference blend over Ink. So the defaults match the screenshots. Parchment mode is three colour changes: hero **Background** → `#e5e4e0`, nav **Text** → `#1d1d1d`, FeaturedWork **Text** and **Hairline** → `#1d1d1d`. Leave the headline colour and blend alone; the difference blend turns Parchment text black on Parchment and still inverts over the sphere.

**Cards are rounded 10px.** The guide says 0px; the live site's cards measure about 10px, which is also the `radius-lg` token. Default is 10, and **Card radius** is one field if you want the sharper print feel.

## What is stubbed

- Card images are empty. Add them per card in the property panel; the grid-paper pattern only shows on cards with no image.
- All links are empty. Wordmark, nav links, Contact, All work, cards, menu button and scroll cue each have a Link control.
- The menu button is a link, not a menu. Wire it to a Framer overlay or page.

## Working on it locally

```bash
npm install
npm run check   # typecheck, build preview/dist, screenshot desktop / laptop / phone
```

`preview/dist/index.html` is a self-contained page (React and the font inlined). `preview/shots/` holds the screenshots. `preview/compare.mjs` samples sphere colours at the same pixels as the reference screenshot when the gradient needs tuning.
