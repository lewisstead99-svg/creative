// build.mjs — writes every page of the Fabricatr site from data/ and the
// templates below. No dependencies. Run: node scripts/build.mjs
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { site } from "../data/site.mjs"
import { projects } from "../data/projects.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const year = new Date().getFullYear()
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const pad = (n) => String(n).padStart(2, "0")
const attrJSON = (o) => JSON.stringify(o).replace(/'/g, "&#39;")

/* ---------------------------------------------------------------- pieces */
const material = (spec, label, cls = "") =>
  `<canvas class="${cls}" data-material='${attrJSON(spec)}' role="img" aria-label="${esc(label)}"></canvas>`

const media = (p, { cls = "exhibit__media", weft = true, image = null, variant = "cover", attrs = "", tag = null } = {}) => {
  const img = image || p.images?.[variant]
  const label = `${p.name} — material study`
  return `<div class="${cls}" data-media ${attrs}>
      ${material(p.material, label)}
      ${img ? `<img src="${esc(img)}" alt="${esc(p.name)}" loading="lazy" decoding="async">` : ""}
      ${tag ? `<span class="tag" aria-hidden="true"><span>Fabricatr</span><span>${esc(tag)}</span></span>` : ""}
      ${weft ? `<div class="weft" aria-hidden="true">${"<i></i>".repeat(10)}</div>` : ""}
    </div>`
}

const nav = () => `
<a class="skip" href="#main">Skip to content</a>
<header class="nav" data-nav>
  <a class="nav__mark" href="/" aria-label="Fabricatr — home">Fabricatr</a>
  <p class="nav__status label">Independent design studio</p>
  <div class="nav__end">
    <nav class="nav__links" aria-label="Primary">
      <a href="/work/">Index</a><a href="/studio/">Studio</a><a href="/contact/">Contact</a>
    </nav>
    <button class="pill nav__menu" data-menu-toggle aria-expanded="false" aria-controls="menu"><span class="nav__menu-word" data-open="Menu" data-close="Close"></span></button>
  </div>
</header>
<div class="menu" id="menu" data-menu aria-hidden="true">
  <div class="menu__weft" aria-hidden="true">${"<i></i>".repeat(8)}</div>
  <div class="menu__inner" tabindex="-1">
    <nav class="menu__primary" aria-label="Menu">
      <a href="/work/"><span class="menu__n">01</span><span class="menu__word"><span>Index</span></span></a>
      <a href="/studio/"><span class="menu__n">02</span><span class="menu__word"><span>Studio</span></span></a>
      <a href="/contact/"><span class="menu__n">03</span><span class="menu__word"><span>Contact</span></span></a>
    </nav>
    <div class="menu__side">
      <p class="label">Exhibits</p>
      <ol>${projects.map((p, i) => `<li><a href="/work/${p.slug}/"><span class="label">${pad(i + 1)}</span><span>${esc(p.name)}</span><span>${esc(p.category)}</span></a></li>`).join("")}</ol>
    </div>
    <div class="menu__foot">
      <a class="link" href="mailto:${site.email}">${site.email}</a>
      <ul>${site.social.map((s) => `<li><a class="link" href="${s.href}" target="_blank" rel="noopener">${s.label}</a></li>`).join("")}</ul>
      <p class="label"><span data-clock>--:--</span> ${site.locations.join(" · ")}</p>
    </div>
  </div>
</div>`

const scene = () => `
<footer class="scene" data-scene data-loom="footer" data-theme="dark">
  <canvas class="scene__loom" data-loom-canvas aria-hidden="true"></canvas>
  <div class="scene__top">
    <p class="label label--muted">05 — Final scene</p>
    <p class="label status"><span class="dot" aria-hidden="true"></span>${esc(site.availability)}</p>
  </div>
  <h2 class="scene__title">Let's fabricate<br>something they<br><em>can't forget.</em></h2>
  <div class="scene__foot">
    <a class="scene__mail" href="mailto:${site.email}">${site.email}</a>
    <ul class="scene__socials">${site.social.map((s) => `<li><a class="link" href="${s.href}" target="_blank" rel="noopener">${s.label}</a></li>`).join("")}</ul>
    <div class="scene__bar label">
      <span>© ${year} ${site.name}</span>
      <span>${site.locations.join(" · ")} — <span data-clock>--:--</span></span>
      <a href="#top">Back to top ↑</a>
    </div>
  </div>
</footer>
<div class="transit" data-transit aria-hidden="true"></div>
<div class="wipe" data-wipe aria-hidden="true">${"<i></i>".repeat(8)}</div>
<div class="tip" data-tip aria-hidden="true">Open exhibit</div>
<div class="peek" data-peek aria-hidden="true"><canvas></canvas></div>`

const layout = ({ path, title, description, body, theme = "light", env = "", page = "" }) => {
  const url = `${site.domain}${path}`
  const jsonld = {
    "@context": "https://schema.org", "@type": "Organization", name: site.name, url: site.domain, email: site.email,
    description: site.tagline, sameAs: site.social.map((s) => s.href),
  }
  return `<!doctype html>
<html lang="en-GB" id="top">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.domain}/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${env || (theme === "dark" ? "#0f0e0c" : "#efeae2")}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/mona-sans.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/newsreader-italic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/fabricatr.css">
<script type="module" src="/assets/js/app.js"></script>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body data-theme="${theme}" data-page="${page}"${env ? ` data-env="${env}" style="--env:${env}"` : ""}>
${nav()}
<main id="main" data-main>
${body}
</main>
${scene()}
</body>
</html>
`
}

/* ------------------------------------------------------------------ home */
const exhibitLetters = "abcdefg"
const exhibit = (p, i) => `
<article class="exhibit exhibit--${exhibitLetters[i % 7]}" data-exhibit>
  <a class="exhibit__link" href="/work/${p.slug}/" data-transition="exhibit" aria-label="${esc(p.name)} — open exhibit">
    ${media(p, { tag: `No. ${pad(i + 1)} — ${p.category}` })}
    <div class="exhibit__text">
      <p class="exhibit__meta"><span class="label">${pad(i + 1)}</span><span class="label">${esc(p.category)}</span><span class="label">${esc(p.year)}</span></p>
      <h3 class="exhibit__title">${esc(p.name)}</h3>
      <p class="exhibit__line">${esc(p.line)}</p>
    </div>
  </a>
</article>`

const capabilityMaterial = (c) => ({ weave: c.weave, warp: "#171512", weft: "#efeae2", accent: "#e2381c", seed: 100 + Number(c.n) })

const home = () => layout({
  path: "/", page: "home",
  title: "Fabricatr — Independent design studio",
  description: site.tagline,
  body: `
<section class="opening" data-loom="hero" aria-label="Opening">
  <canvas class="opening__loom" data-loom-canvas aria-hidden="true"></canvas>
  <div class="opening__top">
    <p class="label">00 — Opening</p>
    <p class="label status"><span class="dot" aria-hidden="true"></span>${esc(site.availability)}</p>
    <p class="label">${site.locations.join(" · ")}</p>
  </div>
  <h1 class="wordmark" data-wordmark aria-label="Fabricatr"><span aria-hidden="true">${"FABRICATR".split("").map((l) => `<i>${l}</i>`).join("")}</span></h1>
  <div class="opening__foot">
    <p class="opening__line">Fabricating brands, websites, AI products and motion systems <em>people can't forget.</em></p>
    <div class="opening__aside">
      <p class="label label--muted">Scroll</p>
      <a class="opening__scroll link" href="#exhibits">Selected work <span aria-hidden="true">↓</span></a>
    </div>
  </div>
</section>

<section class="exhibits" id="exhibits" aria-labelledby="exhibits-title">
  <header class="section-head">
    <h2 class="label" id="exhibits-title">01 — Selected work</h2>
    <p class="label label--muted">${["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"][projects.length - 1] || projects.length} exhibits</p>
  </header>
  <div class="exhibits__hall">
    ${projects.map(exhibit).join("")}
  </div>
  <div class="exhibits__end">
    <a class="link" href="/work/">Full index <span aria-hidden="true">→</span></a>
    <p class="label label--muted">Everything, in order</p>
  </div>
</section>

<section class="studio" aria-labelledby="studio-title">
  <header class="section-head">
    <h2 class="label" id="studio-title">02 — Studio</h2>
    <p class="label label--muted">Small by design</p>
  </header>
  <p class="statement" data-words>A small studio, obsessive about the details <em>most people never notice.</em></p>
  <div class="studio__grid">
    <p class="studio__body" data-reveal>${esc(site.name)} is an independent design studio fabricating brands, websites, AI products and motion systems people can't forget. We take on a few projects at a time and stay close to every one of them.</p>
    <p class="studio__body" data-reveal>Most of the work sits where premium property, hospitality and new technology meet: places where the difference between good and unforgettable is in the detail.</p>
    <dl class="spec" data-reveal>
      <div><dt>Studio</dt><dd>Independent</dd></div>
      <div><dt>Based</dt><dd>${site.locations.join(" · ")}</dd></div>
      <div><dt>Works in</dt><dd>Brand, Web, AI, Motion</dd></div>
      <div><dt>Builds with</dt><dd>Framer, code, WebGL</dd></div>
    </dl>
    <p class="studio__more" data-reveal><a class="link" href="/studio/">The studio <span aria-hidden="true">→</span></a></p>
  </div>
</section>

<section class="system" aria-labelledby="system-title">
  <header class="section-head">
    <h2 class="label" id="system-title">03 — Capabilities</h2>
    <p class="label label--muted">Six parts, one system</p>
  </header>
  <ol class="system__rows">
    <span class="system__thread" aria-hidden="true"></span>
    ${site.capabilities.map((c) => `
    <li class="system__row" data-row>
      <button class="system__trigger" aria-expanded="false" aria-controls="cap-${c.n}">
        <span class="system__n">${c.n}</span>
        <span class="system__name">${esc(c.name)}</span>
        <span class="system__line">${esc(c.line)}</span>
        <span class="system__plus" aria-hidden="true"></span>
      </button>
      <div class="system__panel" id="cap-${c.n}">
        <div class="system__panel-inner">
          ${material(capabilityMaterial(c), `${c.name} — weave sample`, "system__swatch")}
          <ul class="system__items">${c.items.map((it) => `<li>${esc(it)}</li>`).join("")}</ul>
        </div>
      </div>
    </li>`).join("")}
  </ol>
</section>

<section class="woven" aria-labelledby="woven-title">
  <h2 class="label" id="woven-title">04 — Woven with</h2>
  <div class="woven__track" data-woven-track aria-label="${esc(site.clients.join(", "))}">
    ${site.clients.map((c) => `<span>${esc(c)}</span><i class="thread" aria-hidden="true"></i>`).join("")}<em>and yours, next.</em>
  </div>
</section>`,
})

/* ----------------------------------------------------------------- index */
const workIndex = () => layout({
  path: "/work/", page: "work",
  title: "Index — Fabricatr",
  description: "Every Fabricatr project, in order: brands, websites and digital products for property, hospitality and technology.",
  body: `
<header class="page-head">
  <p class="label label--muted">Index</p>
  <h1 class="page-head__title" data-words>${["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"][projects.length - 1]} exhibits, <em>in order.</em></h1>
  <p class="page-head__intro" data-reveal>Every project is an exhibit: a brand, a website or a product with its own material. Open one.</p>
</header>
<section class="index" aria-label="All projects">
  <ol class="index__list">
    ${projects.map((p, i) => `
    <li><a class="index__row" href="/work/${p.slug}/" data-transition="exhibit" data-index-row data-tip="Open">
      <span class="index__n label">${pad(i + 1)}</span>
      <span class="index__name">${esc(p.name)}</span>
      <span class="index__cat">${esc(p.category)}</span>
      <span class="index__year">${esc(p.year)}</span>
      ${media(p, { cls: "index__thumb", weft: false })}
    </a></li>`).join("")}
  </ol>
</section>`,
})

/* ---------------------------------------------------------------- studio */
const studio = () => layout({
  path: "/studio/", page: "studio",
  title: "Studio — Fabricatr",
  description: "Fabricatr is a small, independent design studio. Brands, websites, AI products and motion systems, built with obsessive attention to detail.",
  body: `
<header class="page-head">
  <p class="label label--muted">Studio</p>
  <h1 class="page-head__title" data-words>Small by design. <em>Obsessive by nature.</em></h1>
  <p class="page-head__intro" data-reveal>${esc(site.tagline)}</p>
</header>
<section class="principles" aria-labelledby="principles-title">
  <header class="section-head"><h2 class="label" id="principles-title">Principles</h2><p class="label label--muted">Three, held firmly</p></header>
  <ol>
    <li data-reveal><h3>Restraint is a feature.</h3><p>We remove until only the necessary remains, then make the necessary beautiful.</p></li>
    <li data-reveal><h3>The detail is the brand.</h3><p>Type, spacing, motion, the way a page loads. The small things are the whole thing.</p></li>
    <li data-reveal><h3>Built, not mocked.</h3><p>We design in the medium. Sites are built in Framer or code, so what you sign off is what ships.</p></li>
  </ol>
</section>
<section class="process" aria-labelledby="process-title">
  <header class="section-head"><h2 class="label" id="process-title">How it goes</h2><p class="label label--muted">Four movements</p></header>
  <ol class="process__steps">
    <li data-reveal><p class="label">01</p><h3>Brief</h3><p>We listen, then we push back. The right problem is half the work.</p></li>
    <li data-reveal><p class="label">02</p><h3>Fabricate</h3><p>Identity, system and site take shape together, in the real medium.</p></li>
    <li data-reveal><p class="label">03</p><h3>Refine</h3><p>Motion, detail and performance, tuned by hand until it feels inevitable.</p></li>
    <li data-reveal><p class="label">04</p><h3>Ship</h3><p>Launched, documented and handed over properly. Then we stay in touch.</p></li>
  </ol>
</section>
<section class="studio" aria-label="Capabilities">
  <header class="section-head"><h2 class="label">Capabilities</h2><p class="label label--muted">Six parts, one system</p></header>
  <div class="caps">
    ${site.capabilities.map((c) => `<p data-reveal><span class="label label--muted">${c.n} — ${esc(c.name)}</span>${esc(c.line)}<br><span class="caps__items">${c.items.join(", ")}</span></p>`).join("")}
  </div>
</section>
<section class="woven" aria-label="Clients">
  <h2 class="label">Woven with</h2>
  <div class="woven__track" data-woven-track>${site.clients.map((c) => `<span>${esc(c)}</span><i class="thread" aria-hidden="true"></i>`).join("")}<em>and yours, next.</em></div>
</section>`,
})

/* --------------------------------------------------------------- contact */
const contact = () => layout({
  path: "/contact/", page: "contact",
  title: "Contact — Fabricatr",
  description: "Start a project with Fabricatr. Brands, websites, AI products and motion systems.",
  body: `
<header class="page-head">
  <p class="label label--muted">Contact</p>
  <h1 class="page-head__title" data-words>Start <em>something.</em></h1>
  <p class="page-head__intro" data-reveal>Tell us what you're making. One email is enough to begin.</p>
</header>
<section class="contact" aria-label="Get in touch">
  <a class="contact__mail" href="mailto:${site.email}" data-reveal>${site.email}</a>
  <div class="contact__aside" data-reveal>
    <dl class="spec">
      <div><dt>Status</dt><dd>${esc(site.availability)}</dd></div>
      <div><dt>Based</dt><dd>${site.locations.join(" · ")}</dd></div>
      <div><dt>Local time</dt><dd><span data-clock>--:--</span></dd></div>
      ${site.social.map((s) => `<div><dt>${esc(s.label)}</dt><dd><a class="link" href="${s.href}" target="_blank" rel="noopener">${s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a></dd></div>`).join("")}
    </dl>
  </div>
  <form class="form" data-form data-to="${site.email}" ${site.formEndpoint ? `action="${site.formEndpoint}" method="post"` : ""} data-reveal>
    <label>Name<input name="name" type="text" autocomplete="name" required></label>
    <label>Email<input name="email" type="email" autocomplete="email" required></label>
    <label>Company<input name="company" type="text" autocomplete="organization"></label>
    <label>Budget<select name="budget"><option value="">—</option><option>£5k–10k</option><option>£10k–25k</option><option>£25k–50k</option><option>£50k+</option></select></label>
    <label class="form__wide">What are you making?<textarea name="message" rows="3" required></textarea></label>
    <button class="pill form__submit" type="submit"><span class="dot" aria-hidden="true"></span>Send</button>
    <p class="form__note">${site.formEndpoint ? "We'll come back to you personally." : "Opens in your email client, addressed to us."}</p>
  </form>
</section>`,
})

/* --------------------------------------------------------------- project */
const blocks = {
  hero(p, i, kind) {
    const label = `<p class="tag"><span>Exhibit ${pad(i + 1)}</span><span>${esc(p.category)} — ${esc(p.year)}</span></p>`
    const light = p.theme === "light" ? " data-light" : ""
    if (kind === "split") return `
<header class="case__hero case__hero--split">
  <div class="case__hero-text">${label}<h1 class="case__title">${esc(p.name)}</h1><p class="case__line">${esc(p.line)}</p></div>
  ${media(p, { cls: "case__media", weft: false })}
</header>`
    if (kind === "stack") return `
<header class="case__hero case__hero--stack">
  <div class="case__hero-text">${label}<h1 class="case__title">${esc(p.name)}</h1></div>
  ${media(p, { cls: "case__media", weft: false })}
</header>`
    if (kind === "number") {
      const m = p.name.match(/^(\d+)\s+(.*)$/)
      return `
<header class="case__hero case__hero--number">
  <p class="case__numeral" aria-hidden="true">${m ? m[1] : pad(i + 1)}</p>
  ${media(p, { cls: "case__media", weft: false })}
  <div class="case__hero-text">${label}<h1 class="case__title">${esc(p.name)}</h1><p class="case__line">${esc(p.line)}</p></div>
</header>`
    }
    return `
<header class="case__hero case__hero--full"${light}>
  ${media(p, { cls: "case__media case__media--fill", weft: false })}
  <div class="case__hero-text">${label}<h1 class="case__title">${esc(p.name)}</h1><p class="case__line">${esc(p.line)}</p></div>
</header>`
  },
  brief(p) {
    return `
<section class="case__brief">
  <div class="case__brief-text" data-reveal><p class="label">Brief</p><p>${esc(p.description)}</p></div>
  <dl class="spec" data-reveal>
    <div><dt>Client</dt><dd>${esc(p.name)}</dd></div>
    <div><dt>Sector</dt><dd>${esc(p.sector)}</dd></div>
    <div><dt>Year</dt><dd>${esc(p.year)}</dd></div>
    <div><dt>Disciplines</dt><dd>${p.disciplines.map(esc).join("<br>")}</dd></div>
    ${p.url ? `<div><dt>Live</dt><dd><a class="link" href="${p.url}" target="_blank" rel="noopener">${p.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} <span aria-hidden="true">↗</span></a></dd></div>` : ""}
  </dl>
</section>`
  },
  statement(p, i, kind) { return `<section class="case__statement${kind === "right" ? " case__statement--right" : ""}"><p data-words>${esc(p.statement)}</p></section>` },
  full(p, i, kind) {
    return `
<figure class="case__full${kind === "inset" ? " case__full--inset" : ""}">
  ${media(p, { cls: "case__media", variant: "wide", attrs: "data-weft" })}
  <figcaption class="case__caption label label--muted"><span>${esc(p.name)}</span><span>Material study</span></figcaption>
</figure>`
  },
  pair(p) {
    const [a, b] = p.images?.pair || []
    return `
<section class="case__pair">
  ${media(p, { cls: "case__media", image: a, attrs: "data-weft" })}
  ${media({ ...p, material: { ...p.material, seed: p.material.seed + 3 } }, { cls: "case__media", image: b, attrs: "data-weft" })}
</section>`
  },
  offset(p) {
    return `
<section class="case__offset">
  <div class="case__caption label label--muted"><span>${esc(p.category)}</span><span>Breaking the grid</span></div>
  ${media({ ...p, material: { ...p.material, seed: p.material.seed + 5 } }, { cls: "case__media", variant: "wide", attrs: "data-weft" })}
</section>`
  },
  sequence(p) {
    const frames = p.images?.sequence || [null, null, null, null]
    return `
<section class="case__sequence" data-sequence aria-label="Sequence">
  <div class="case__seq-pin">
    <div class="case__seq-head label"><span>Sequence</span><span>${frames.length} frames</span></div>
    <div class="case__seq-track">
      ${frames.map((f, n) => media({ ...p, material: { ...p.material, seed: p.material.seed + 10 + n } }, { cls: "case__media", image: f, weft: false })).join("")}
    </div>
  </div>
</section>`
  },
  mockups(p, i, kind) {
    return `
<section class="case__mockups${kind === "phone" ? " case__mockups--phone" : ""}" aria-label="Screens">
  <div class="device device--desktop" data-reveal>${media(p, { cls: "case__media", variant: "desktop", weft: false })}</div>
  <div class="device device--phone" data-reveal>${media({ ...p, material: { ...p.material, seed: p.material.seed + 7 } }, { cls: "case__media", variant: "mobile", weft: false })}</div>
</section>`
  },
  type(p) {
    const serif = /newsreader/i.test(p.type?.display || "")
    return `
<section class="case__type" aria-label="Typography">
  <div class="case__type-meta label"><span>Typography</span><span>${esc(p.type?.display || "Mona Sans")}</span></div>
  <p class="case__type-sample${serif ? " serif" : ""}" data-reveal>${esc(p.type?.sample || p.line)}</p>
  <div class="case__type-row" data-reveal>
    <div>Aa<span>Display</span></div>
    <div style="font-variation-settings:'wdth' 75">Aa<span>Condensed</span></div>
    <div style="font-variation-settings:'wdth' 125">Aa<span>Extended</span></div>
    <div class="serif">Aa<span>Editorial</span></div>
  </div>
</section>`
  },
  palette(p) {
    const lum = (h) => { const n = parseInt(h.slice(1), 16); return (0.2126 * (n >> 16 & 255) + 0.7152 * (n >> 8 & 255) + 0.0722 * (n & 255)) / 255 }
    return `
<section class="case__palette" aria-label="Colour">
  <div class="case__type-meta label"><span>Colour</span><span>${p.palette.length} tones</span></div>
  <ul data-reveal>${p.palette.map((c) => `<li style="background:${c};color:${lum(c) > 0.55 ? "#171512" : "#ebe6dd"}">${c}</li>`).join("")}</ul>
</section>`
  },
  video(p) {
    if (!p.video?.src) return ""
    return `<figure class="case__video"><video src="${esc(p.video.src)}" poster="${esc(p.video.poster || "")}" muted autoplay loop playsinline></video></figure>`
  },
  next(p, i) {
    const n = projects[(i + 1) % projects.length]
    return `
<a class="case__next" href="/work/${n.slug}/" data-transition="exhibit" data-tip="Next exhibit"${n.theme === "light" ? " data-light" : ""}>
  ${media(n, { cls: "case__media", weft: false })}
  <div class="case__next-text">
    <p class="label">Next exhibit — ${pad(((i + 1) % projects.length) + 1)}</p>
    <p class="case__title">${esc(n.name)}</p>
  </div>
</a>`
  },
}

const project = (p, i) => {
  const body = `<article class="case" data-case="${p.slug}">
${p.recipe.map((step) => { const [name, kind] = step.split(":"); return blocks[name] ? blocks[name](p, i, kind) : "" }).join("\n")}
</article>`
  return layout({
    path: `/work/${p.slug}/`, page: "project",
    title: `${p.name} — Fabricatr`,
    description: p.description,
    body, theme: p.theme, env: p.environment,
  })
}

/* ----------------------------------------------------------------- write */
const out = async (rel, content) => {
  const file = resolve(root, rel)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, content)
  console.log(`  ${rel} (${(content.length / 1024).toFixed(0)} KB)`)
}

console.log("Building Fabricatr:")
await out("index.html", home())
await out("work/index.html", workIndex())
await out("studio/index.html", studio())
await out("contact/index.html", contact())
for (const [i, p] of projects.entries()) await out(`work/${p.slug}/index.html`, project(p, i))

const pages = ["/", "/work/", "/studio/", "/contact/", ...projects.map((p) => `/work/${p.slug}/`)]
await out("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${site.domain}${p}</loc></url>`).join("\n")}
</urlset>
`)
await out("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n`)
await out("favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0f0e0c"/><g stroke="#efeae2" stroke-width="1.5"><path d="M0 7h32M0 13h32M0 25h32"/></g><path d="M0 19h32" stroke="#e2381c" stroke-width="2"/></svg>
`)
