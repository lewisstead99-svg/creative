// Generated from kit/components/Footer.tsx by scripts/assemble.mjs. Edit the kit source, not this file.
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers (inlined so this file pastes into Framer on its own)
// ─────────────────────────────────────────────────────────────────────────────

const INK = "#1d1d1d"
const PARCHMENT = "#e5e4e0"
const HAIRLINE = "rgba(229, 228, 224, 0.18)"
const FONT_STACK =
    '"Ataero Retina OB Edition", "Ataero Retina OB", Manrope, "Instrument Sans", Inter, ui-sans-serif, system-ui, sans-serif'

type FramerFont = {
    fontFamily?: string
    fontWeight?: number | string
    fontStyle?: string
}

/** Turns a Framer Font-control value into CSS, falling back to the brand stack. */
function fontCss(font: FramerFont | undefined, weight = 500): React.CSSProperties {
    return {
        fontFamily: font?.fontFamily ? `${font.fontFamily}, ${FONT_STACK}` : FONT_STACK,
        fontWeight: font?.fontWeight ?? weight,
        fontStyle: font?.fontStyle ?? "normal",
    }
}

/** Scales a 1440px-reference size with the component width, inside [min, max]. */
function fluid(px1440: number, width: number, min: number, max: number): number {
    return Math.round(Math.min(max, Math.max(min, (width * px1440) / 1440)))
}

/** Measures the component's own box so layout never depends on viewport units. */
function useSize(ref: React.RefObject<HTMLElement>, initial = { w: 1440, h: 900 }) {
    const [size, setSize] = React.useState(initial)
    React.useEffect(() => {
        const el = ref.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver((entries) => {
            const r = entries[0]?.contentRect
            if (r && r.width > 0) setSize({ w: r.width, h: r.height })
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [ref])
    return size
}

/** Section label: 13px @1440, tracked, uppercase. */
function labelCss(font: FramerFont | undefined, size: number, color: string): React.CSSProperties {
    return {
        ...fontCss(font, 500),
        fontSize: size,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color,
        lineHeight: 1,
        margin: 0,
    }
}

/** Splits a multiline string into paragraphs on blank lines. */
function paragraphs(text: string): string[] {
    return text
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean)
}

function ArrowNE() {
    return (
        <svg width="0.62em" height="0.62em" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 8l6-6M3.2 2H8v4.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function ArrowE() {
    return (
        <svg width="0.8em" height="0.8em" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

type PillProps = {
    label: string
    href?: string
    size: number
    color: string
    hoverText: string
    border: string
    font?: FramerFont
    newTab?: boolean
    onClick?: () => void
    className?: string
}

/** Ghost pill: the system's one state-change button. Fills with the text colour on hover. */
function Pill({ label, href, size, color, hoverText, border, font, newTab, onClick, className }: PillProps) {
    const Tag: any = href ? "a" : "button"
    return (
        <>
            <Tag
                href={href}
                onClick={onClick}
                target={href && newTab ? "_blank" : undefined}
                rel={href && newTab ? "noreferrer" : undefined}
                className={`ob-pill ${className ?? ""}`}
                style={{
                    ...labelCss(font, size, color),
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.9em",
                    padding: `${Math.round(size * 1.45)}px ${Math.round(size * 2.6)}px`,
                    border: `1px solid ${border}`,
                    borderRadius: 999,
                    background: "transparent",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                }}
            >
                {label}
                <ArrowE />
            </Tag>
            <style>{`.ob-pill { transition: background-color .25s ease, color .25s ease } .ob-pill:hover { background: ${color} !important; color: ${hoverText} !important }`}</style>
        </>
    )
}

/** Ghost text link with a trailing arrow and a fade on hover. */
function TextLink({
    label,
    href,
    size,
    color,
    font,
    arrow = "e",
    newTab,
}: {
    label: string
    href?: string
    size: number
    color: string
    font?: FramerFont
    arrow?: "e" | "ne"
    newTab?: boolean
}) {
    return (
        <>
            <a
                href={href || undefined}
                target={newTab ? "_blank" : undefined}
                rel={newTab ? "noreferrer" : undefined}
                className="ob-textlink"
                style={{
                    ...labelCss(font, size, color),
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45em",
                    textDecoration: "none",
                    padding: "5px 0",
                    borderRadius: 10,
                }}
            >
                {label}
                {arrow === "ne" ? <ArrowNE /> : <ArrowE />}
            </a>
            <style>{`.ob-textlink { transition: opacity .25s ease } .ob-textlink:hover { opacity: .6 }`}</style>
        </>
    )
}

/**
 * OFF+BRAND Footer — the wordmark set edge to edge, three link columns
 * (sitemap, socials, contact) and a hairline bottom bar with copyright,
 * partner note, availability dot and back-to-top.
 *
 * Height is content-sized.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerDisableUnlink
 */
export default function Footer(props: Partial<FooterProps>) {
    const p = { ...FOOTER_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w } = useSize(ref)
    const mobile = w < 860
    const labelSize = fluid(p.labelSize, w, 11, 18)
    const linkSize = fluid(p.linkSize, w, 14, 24)
    const pad = mobile ? Math.round(p.padding * 0.8) : p.padding
    const wordmarkSize = Math.round(Math.max(40, (w - pad * 2) * p.wordmarkScale))
    const year = new Date().getFullYear()

    const column = (title: string, items: FooterLink[], newTab = false) => (
        <div style={{ display: "flex", flexDirection: "column", gap: Math.round(linkSize * 0.6) }}>
            <p style={{ ...labelCss(p.font, labelSize, p.mutedColor), marginBottom: Math.round(linkSize * 0.4) }}>{title}</p>
            {items.map((item, i) => (
                <a
                    key={i}
                    href={item.link || undefined}
                    target={newTab && item.link ? "_blank" : undefined}
                    rel={newTab && item.link ? "noreferrer" : undefined}
                    className="ob-foot-link"
                    style={{ ...fontCss(p.font, 500), fontSize: linkSize, lineHeight: 1.2, letterSpacing: "0.013em", color: p.textColor, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4em", alignSelf: "flex-start" }}
                >
                    {item.label}
                    {newTab && <ArrowNE />}
                </a>
            ))}
        </div>
    )

    return (
        <footer
            ref={ref}
            style={{
                width: "100%",
                ...props.style,
                position: "relative",
                overflow: "hidden",
                background: p.background,
                color: p.textColor,
                padding: `${p.topSpace}px ${pad}px ${p.bottomSpace}px`,
                boxSizing: "border-box",
                borderTop: `1px solid ${p.hairline}`,
                display: "flex",
                flexDirection: "column",
                gap: Math.round(linkSize * 3),
            }}
        >
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1.4fr 1fr 1fr 1fr", gap: mobile ? 40 : 24 }}>
                {!mobile && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: "30ch" }}>
                        <p style={{ ...fontCss(p.font, 400), fontSize: Math.round(labelSize * 1.15), lineHeight: 1.45, letterSpacing: "0.013em", color: p.mutedColor, margin: 0 }}>{p.blurb}</p>
                    </div>
                )}
                {column(p.sitemapTitle, p.sitemap)}
                {column(p.socialsTitle, p.socials, true)}
                <div style={{ display: "flex", flexDirection: "column", gap: Math.round(linkSize * 0.6), gridColumn: mobile ? "1 / -1" : undefined }}>
                    <p style={{ ...labelCss(p.font, labelSize, p.mutedColor), marginBottom: Math.round(linkSize * 0.4) }}>{p.contactTitle}</p>
                    {p.email && (
                        <a href={`mailto:${p.email}`} className="ob-foot-link" style={{ ...fontCss(p.font, 500), fontSize: linkSize, lineHeight: 1.2, letterSpacing: "0.013em", color: p.textColor, textDecoration: "none", alignSelf: "flex-start" }}>
                            {p.email}
                        </a>
                    )}
                    {p.address.split("\n").filter(Boolean).map((line, i) => (
                        <span key={i} style={{ ...fontCss(p.font, 400), fontSize: Math.round(labelSize * 1.15), lineHeight: 1.4, letterSpacing: "0.013em", color: p.mutedColor }}>{line}</span>
                    ))}
                </div>
            </div>

            <div aria-hidden={!p.wordmarkIsLink} style={{ borderTop: `1px solid ${p.hairline}`, paddingTop: Math.round(wordmarkSize * 0.18), overflow: "hidden" }}>
                <a
                    href={p.wordmarkIsLink ? p.wordmarkLink || undefined : undefined}
                    style={{
                        ...fontCss(p.font, 500),
                        fontSize: wordmarkSize,
                        lineHeight: 0.78,
                        letterSpacing: "-0.01em",
                        color: p.textColor,
                        textDecoration: "none",
                        display: "block",
                        whiteSpace: "nowrap",
                        textTransform: "uppercase",
                        marginBottom: `-${Math.round(wordmarkSize * 0.06)}px`,
                    }}
                >
                    {p.wordmark}
                </a>
            </div>

            <div style={{ borderTop: `1px solid ${p.hairline}`, paddingTop: 20, display: "flex", flexWrap: "wrap", alignItems: "center", gap: mobile ? 14 : 28, ...labelCss(p.font, labelSize, p.mutedColor), letterSpacing: "0.05em", lineHeight: 1.3 }}>
                <span>© {year} {p.company}</span>
                {p.note && <span>{p.note}</span>}
                {p.status && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, marginLeft: mobile ? 0 : "auto", color: p.textColor }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.textColor, display: "inline-block" }} />
                        {p.status}
                    </span>
                )}
                {p.backToTop && (
                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="ob-foot-link"
                        style={{ ...labelCss(p.font, labelSize, p.textColor), background: "none", border: "none", cursor: "pointer", padding: "5px 0", display: "inline-flex", alignItems: "center", gap: "0.4em", borderRadius: 10 }}
                    >
                        {p.backToTop}
                        <svg width="0.75em" height="0.75em" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M6 11V1M2 5l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
            </div>
            <style>{`.ob-foot-link { transition: opacity .25s ease } .ob-foot-link:hover { opacity: .6 }`}</style>
        </footer>
    )
}

type FooterLink = { label: string; link: string }

type FooterProps = {
    wordmark: string
    wordmarkIsLink: boolean
    wordmarkLink: string
    wordmarkScale: number
    blurb: string
    sitemapTitle: string
    sitemap: FooterLink[]
    socialsTitle: string
    socials: FooterLink[]
    contactTitle: string
    email: string
    address: string
    company: string
    note: string
    status: string
    backToTop: string
    font?: FramerFont
    labelSize: number
    linkSize: number
    textColor: string
    mutedColor: string
    hairline: string
    background: string
    padding: number
    topSpace: number
    bottomSpace: number
    style?: React.CSSProperties
}

const FOOTER_DEFAULTS: FooterProps = {
    wordmark: "OFF+BRAND.",
    wordmarkIsLink: true,
    wordmarkLink: "",
    wordmarkScale: 0.158,
    blurb: "A founder-led creative studio. Brand, web and motion for companies that refuse to blend in.",
    sitemapTitle: "Sitemap",
    sitemap: [
        { label: "Work", link: "" },
        { label: "Manifesto", link: "" },
        { label: "Studio", link: "" },
        { label: "Contact", link: "" },
    ],
    socialsTitle: "Elsewhere",
    socials: [
        { label: "Instagram", link: "" },
        { label: "LinkedIn", link: "" },
        { label: "Dribbble", link: "" },
    ],
    contactTitle: "Contact",
    email: "hello@itsoffbrand.com",
    address: "Studio 4, 21 Rivington Street\nLondon EC2A 3DT",
    company: "Off+Brand Ltd",
    note: "Webflow Enterprise Partner",
    status: "Available for new projects",
    backToTop: "Back to top",
    font: undefined,
    labelSize: 13,
    linkSize: 18,
    textColor: PARCHMENT,
    mutedColor: "rgba(229, 228, 224, 0.62)",
    hairline: HAIRLINE,
    background: INK,
    padding: 20,
    topSpace: 100,
    bottomSpace: 24,
}

const linkArray = (title: string, defaultValue: FooterLink[]) => ({
    type: ControlType.Array,
    title,
    maxCount: 8,
    control: {
        type: ControlType.Object,
        controls: {
            label: { type: ControlType.String, title: "Label", defaultValue: "Link" },
            link: { type: ControlType.Link, title: "Link" },
        },
    },
    defaultValue,
})

addPropertyControls(Footer, {
    wordmark: { type: ControlType.String, title: "Wordmark", defaultValue: FOOTER_DEFAULTS.wordmark },
    wordmarkScale: { type: ControlType.Number, title: "Wordmark scale", description: "Fraction of the width. 0.158 fits OFF+BRAND. edge to edge.", min: 0.05, max: 0.3, step: 0.002, defaultValue: 0.158 },
    wordmarkIsLink: { type: ControlType.Boolean, title: "Wordmark links", defaultValue: true },
    wordmarkLink: { type: ControlType.Link, title: "Wordmark link", hidden: (p: { wordmarkIsLink?: boolean }) => !p.wordmarkIsLink },
    blurb: { type: ControlType.String, title: "Blurb", displayTextArea: true, defaultValue: FOOTER_DEFAULTS.blurb },
    sitemapTitle: { type: ControlType.String, title: "Column 1", defaultValue: FOOTER_DEFAULTS.sitemapTitle },
    sitemap: linkArray("Sitemap", FOOTER_DEFAULTS.sitemap),
    socialsTitle: { type: ControlType.String, title: "Column 2", defaultValue: FOOTER_DEFAULTS.socialsTitle },
    socials: linkArray("Socials", FOOTER_DEFAULTS.socials),
    contactTitle: { type: ControlType.String, title: "Column 3", defaultValue: FOOTER_DEFAULTS.contactTitle },
    email: { type: ControlType.String, title: "Email", defaultValue: FOOTER_DEFAULTS.email },
    address: { type: ControlType.String, title: "Address", displayTextArea: true, defaultValue: FOOTER_DEFAULTS.address },
    company: { type: ControlType.String, title: "Company", description: "Shown after © and the current year.", defaultValue: FOOTER_DEFAULTS.company },
    note: { type: ControlType.String, title: "Note", defaultValue: FOOTER_DEFAULTS.note },
    status: { type: ControlType.String, title: "Status", defaultValue: FOOTER_DEFAULTS.status },
    backToTop: { type: ControlType.String, title: "Back to top", defaultValue: FOOTER_DEFAULTS.backToTop },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    labelSize: { type: ControlType.Number, title: "Label @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    linkSize: { type: ControlType.Number, title: "Link @1440", min: 14, max: 32, step: 1, unit: "px", defaultValue: 18 },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: PARCHMENT },
    mutedColor: { type: ControlType.Color, title: "Muted text", defaultValue: FOOTER_DEFAULTS.mutedColor },
    hairline: { type: ControlType.Color, title: "Hairline", defaultValue: HAIRLINE },
    background: { type: ControlType.Color, title: "Background", defaultValue: INK },
    padding: { type: ControlType.Number, title: "Side padding", min: 0, max: 120, step: 1, unit: "px", defaultValue: 20 },
    topSpace: { type: ControlType.Number, title: "Space above", min: 0, max: 300, step: 1, unit: "px", defaultValue: 100 },
    bottomSpace: { type: ControlType.Number, title: "Space below", min: 0, max: 200, step: 1, unit: "px", defaultValue: 24 },
})
