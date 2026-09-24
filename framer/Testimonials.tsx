// Generated from kit/components/Testimonials.tsx by scripts/assemble.mjs. Edit the kit source, not this file.
import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

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
 * OFF+BRAND Testimonials — one large quote at a time with the client's name
 * and role, a position counter and ghost prev/next buttons. Optional
 * autoplay.
 *
 * Height is content-sized.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerDisableUnlink
 */
export default function Testimonials(props: Partial<TestimonialProps>) {
    const p = { ...TESTIMONIAL_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w } = useSize(ref)
    const mobile = w < 860
    const reduced = useReducedMotion()
    const labelSize = fluid(p.labelSize, w, 11, 18)
    const quoteSize = fluid(p.quoteSize, w, 20, 52)
    const pad = mobile ? Math.round(p.padding * 0.8) : p.padding
    const count = Math.max(1, p.items.length)
    const [index, setIndex] = React.useState(0)
    const [dir, setDir] = React.useState(1)
    const go = (d: number) => {
        setDir(d)
        setIndex((i) => (i + d + count) % count)
    }
    React.useEffect(() => {
        if (!p.autoplay || count < 2) return
        const id = window.setInterval(() => go(1), Math.max(2, p.interval) * 1000)
        return () => window.clearInterval(id)
    }, [p.autoplay, p.interval, count])
    const item = p.items[Math.min(index, count - 1)] ?? { quote: "", name: "", role: "" }

    const arrowButton = (d: number, label: string) => (
        <button
            type="button"
            aria-label={label}
            onClick={() => go(d)}
            className="ob-quote-btn"
            style={{
                width: Math.round(labelSize * 3.4),
                height: Math.round(labelSize * 3.4),
                borderRadius: "50%",
                border: `1px solid ${p.hairline}`,
                background: "transparent",
                color: p.textColor,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
                fontSize: labelSize,
                transform: d < 0 ? "scaleX(-1)" : undefined,
            }}
        >
            <ArrowE />
        </button>
    )

    return (
        <section
            ref={ref}
            style={{
                width: "100%",
                ...props.style,
                position: "relative",
                background: p.background,
                color: p.textColor,
                padding: `${p.topSpace}px ${pad}px ${p.bottomSpace}px`,
                boxSizing: "border-box",
                display: "grid",
                gridTemplateColumns: mobile ? "1fr" : "1fr 2fr",
                gap: mobile ? 32 : 24,
                borderTop: `1px solid ${p.hairline}`,
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 32 }}>
                {p.label && <p style={labelCss(p.font, labelSize, p.mutedColor)}>{p.label}</p>}
                {!mobile && count > 1 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {arrowButton(-1, "Previous")}
                        {arrowButton(1, "Next")}
                        <span style={{ ...labelCss(p.font, labelSize, p.mutedColor), marginLeft: 8, fontVariantNumeric: "tabular-nums" }}>
                            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                        </span>
                    </div>
                )}
            </div>
            <div style={{ minHeight: quoteSize * 4.2, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 40 }}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.figure
                        key={index}
                        initial={reduced ? false : { opacity: 0, y: 14 * dir }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduced ? undefined : { opacity: 0, y: -14 * dir }}
                        transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                        style={{ margin: 0, display: "flex", flexDirection: "column", gap: Math.round(quoteSize * 0.9) }}
                    >
                        <blockquote
                            style={{
                                ...fontCss(p.font, 500),
                                fontSize: quoteSize,
                                lineHeight: 1.18,
                                letterSpacing: "0.006em",
                                margin: 0,
                                maxWidth: "26ch",
                                textWrap: "balance" as any,
                            }}
                        >
                            “{item.quote}”
                        </blockquote>
                        <figcaption style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <span style={labelCss(p.font, labelSize, p.textColor)}>{item.name}</span>
                            {item.role && <span style={{ ...labelCss(p.font, labelSize, p.mutedColor), textTransform: "none", letterSpacing: "0.013em" }}>{item.role}</span>}
                        </figcaption>
                    </motion.figure>
                </AnimatePresence>
                {mobile && count > 1 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {arrowButton(-1, "Previous")}
                        {arrowButton(1, "Next")}
                        <span style={{ ...labelCss(p.font, labelSize, p.mutedColor), marginLeft: 8, fontVariantNumeric: "tabular-nums" }}>
                            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                        </span>
                    </div>
                )}
            </div>
            <style>{`.ob-quote-btn { transition: background-color .25s ease, color .25s ease } .ob-quote-btn:hover { background: ${p.textColor}; color: ${p.hoverText} } .ob-quote-btn:focus-visible { outline: 1px solid ${p.textColor}; outline-offset: 3px }`}</style>
        </section>
    )
}

type Quote = { quote: string; name: string; role: string }

type TestimonialProps = {
    label: string
    items: Quote[]
    autoplay: boolean
    interval: number
    font?: FramerFont
    labelSize: number
    quoteSize: number
    textColor: string
    mutedColor: string
    hoverText: string
    hairline: string
    background: string
    padding: number
    topSpace: number
    bottomSpace: number
    style?: React.CSSProperties
}

const TESTIMONIAL_DEFAULTS: TestimonialProps = {
    label: "Kind words",
    items: [
        { quote: "They rebuilt our site in eight weeks and it looks like nothing else in the category. Enquiries doubled in the first quarter.", name: "Dan Whitfield", role: "Founder, Series B fintech" },
        { quote: "They pushed back on every safe idea we had, and they were right every time.", name: "Priya Raman", role: "Head of Brand, consumer app" },
        { quote: "The first studio that treated Webflow like an engineering platform rather than a page builder.", name: "Tom Alder", role: "CTO, enterprise SaaS" },
    ],
    autoplay: false,
    interval: 7,
    font: undefined,
    labelSize: 13,
    quoteSize: 34,
    textColor: PARCHMENT,
    mutedColor: "rgba(229, 228, 224, 0.62)",
    hoverText: INK,
    hairline: HAIRLINE,
    background: INK,
    padding: 20,
    topSpace: 100,
    bottomSpace: 120,
}

addPropertyControls(Testimonials, {
    label: { type: ControlType.String, title: "Label", defaultValue: TESTIMONIAL_DEFAULTS.label },
    items: {
        type: ControlType.Array,
        title: "Quotes",
        maxCount: 12,
        control: {
            type: ControlType.Object,
            controls: {
                quote: { type: ControlType.String, title: "Quote", displayTextArea: true, defaultValue: "" },
                name: { type: ControlType.String, title: "Name", defaultValue: "" },
                role: { type: ControlType.String, title: "Role", defaultValue: "" },
            },
        },
        defaultValue: TESTIMONIAL_DEFAULTS.items,
    },
    autoplay: { type: ControlType.Boolean, title: "Autoplay", defaultValue: false },
    interval: { type: ControlType.Number, title: "Every", min: 2, max: 20, step: 1, unit: "s", defaultValue: 7, hidden: (p: { autoplay?: boolean }) => !p.autoplay },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    labelSize: { type: ControlType.Number, title: "Label @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    quoteSize: { type: ControlType.Number, title: "Quote @1440", min: 18, max: 64, step: 1, unit: "px", defaultValue: 34 },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: PARCHMENT },
    mutedColor: { type: ControlType.Color, title: "Muted text", defaultValue: TESTIMONIAL_DEFAULTS.mutedColor },
    hoverText: { type: ControlType.Color, title: "Button hover text", defaultValue: INK },
    hairline: { type: ControlType.Color, title: "Hairline", defaultValue: HAIRLINE },
    background: { type: ControlType.Color, title: "Background", defaultValue: INK },
    padding: { type: ControlType.Number, title: "Side padding", min: 0, max: 120, step: 1, unit: "px", defaultValue: 20 },
    topSpace: { type: ControlType.Number, title: "Space above", min: 0, max: 300, step: 1, unit: "px", defaultValue: 100 },
    bottomSpace: { type: ControlType.Number, title: "Space below", min: 0, max: 300, step: 1, unit: "px", defaultValue: 120 },
})
