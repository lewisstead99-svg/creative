// Generated from kit/components/CTA.tsx by scripts/assemble.mjs. Edit the kit source, not this file.
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { motion, useReducedMotion } from "framer-motion"

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
 * OFF+BRAND CTA — the closing invitation: two display lines, a ghost pill and
 * the studio email, with the ring ornament and orbiting dot (no sphere; the
 * gradient appears once per page, in the hero).
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 1440
 * @framerIntrinsicHeight 720
 * @framerDisableUnlink
 */
export default function CTA(props: Partial<CTAProps>) {
    const p = { ...CTA_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w, h } = useSize(ref, { w: 1440, h: 720 })
    const mobile = w < 720
    const reduced = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const animate = !reduced && !isCanvas && p.orbitSeconds > 0
    const size = fluid(p.size, w, p.minSize, p.maxSize)
    const labelSize = fluid(p.labelSize, w, 11, 18)
    const pad = mobile ? Math.round(p.padding * 0.8) : p.padding
    const ring = Math.round(Math.max(360, Math.min(w * 0.6, h * 1.1)))
    const dot = Math.round(ring * 0.03)

    return (
        <section
            ref={ref}
            style={{
                width: "100%",
                minHeight: p.minHeight,
                ...props.style,
                position: "relative",
                overflow: "hidden",
                background: p.background,
                color: p.textColor,
                padding: `${p.topSpace}px ${pad}px ${p.bottomSpace}px`,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: Math.round(size * 0.45),
                borderTop: p.hairlineTop ? `1px solid ${p.hairline}` : undefined,
            }}
        >
            {p.rings && (
                <div aria-hidden="true" style={{ position: "absolute", left: mobile ? "50%" : "72%", top: "48%", width: ring, height: ring, transform: "translate(-50%, -50%)", pointerEvents: "none" }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px dotted ${p.ringColor}` }} />
                    <div style={{ position: "absolute", inset: "22%", borderRadius: "50%", border: `1px dotted ${p.ringColor}` }} />
                    <motion.div
                        style={{ position: "absolute", inset: 0, rotate: 30 }}
                        animate={{ rotate: animate ? 390 : 30 }}
                        transition={animate ? { duration: p.orbitSeconds, ease: "linear", repeat: Infinity } : { duration: 0 }}
                    >
                        <div style={{ position: "absolute", left: "50%", top: 0, width: dot, height: dot, transform: "translate(-50%, -50%)", borderRadius: "50%", background: p.dotColor }} />
                    </motion.div>
                </div>
            )}
            {p.label && <p style={{ ...labelCss(p.font, labelSize, p.mutedColor), position: "relative" }}>{p.label}</p>}
            <h2
                style={{
                    ...fontCss(p.font, 500),
                    position: "relative",
                    fontSize: size,
                    lineHeight: 0.88,
                    letterSpacing: "0.01em",
                    textTransform: "uppercase",
                    margin: 0,
                    maxWidth: "12ch",
                    textWrap: "balance" as any,
                }}
            >
                {p.line1}
                <br />
                {p.line2}
            </h2>
            <div style={{ position: "relative", display: "flex", flexWrap: "wrap", alignItems: "center", gap: mobile ? 16 : 28, marginTop: Math.round(size * 0.1) }}>
                {p.buttonLabel && <Pill label={p.buttonLabel} href={p.buttonLink || undefined} size={labelSize} color={p.textColor} hoverText={p.hoverText} border={p.hairline} font={p.font} />}
                {p.email && (
                    <a
                        href={`mailto:${p.email}`}
                        className="ob-cta-email"
                        style={{ ...fontCss(p.font, 500), fontSize: Math.round(labelSize * 1.25), letterSpacing: "0.013em", color: p.textColor, textDecoration: "none", borderBottom: `1px solid ${p.hairline}`, paddingBottom: 3 }}
                    >
                        {p.email}
                    </a>
                )}
            </div>
            <style>{`.ob-cta-email { transition: border-color .25s ease } .ob-cta-email:hover { border-color: ${p.textColor} }`}</style>
        </section>
    )
}

type CTAProps = {
    label: string
    line1: string
    line2: string
    buttonLabel: string
    buttonLink: string
    email: string
    font?: FramerFont
    size: number
    minSize: number
    maxSize: number
    labelSize: number
    rings: boolean
    ringColor: string
    dotColor: string
    orbitSeconds: number
    textColor: string
    mutedColor: string
    hoverText: string
    hairline: string
    hairlineTop: boolean
    background: string
    minHeight: number
    padding: number
    topSpace: number
    bottomSpace: number
    style?: React.CSSProperties
}

const CTA_DEFAULTS: CTAProps = {
    label: "New project",
    line1: "Let's make something",
    line2: "people remember",
    buttonLabel: "Start a project",
    buttonLink: "",
    email: "hello@itsoffbrand.com",
    font: undefined,
    size: 103,
    minSize: 40,
    maxSize: 170,
    labelSize: 13,
    rings: true,
    ringColor: HAIRLINE,
    dotColor: "#9e9e9c",
    orbitSeconds: 70,
    textColor: PARCHMENT,
    mutedColor: "rgba(229, 228, 224, 0.62)",
    hoverText: INK,
    hairline: HAIRLINE,
    hairlineTop: true,
    background: INK,
    minHeight: 680,
    padding: 20,
    topSpace: 160,
    bottomSpace: 120,
}

addPropertyControls(CTA, {
    label: { type: ControlType.String, title: "Label", defaultValue: CTA_DEFAULTS.label },
    line1: { type: ControlType.String, title: "Line 1", defaultValue: CTA_DEFAULTS.line1 },
    line2: { type: ControlType.String, title: "Line 2", defaultValue: CTA_DEFAULTS.line2 },
    buttonLabel: { type: ControlType.String, title: "Button", defaultValue: CTA_DEFAULTS.buttonLabel },
    buttonLink: { type: ControlType.Link, title: "Button link" },
    email: { type: ControlType.String, title: "Email", defaultValue: CTA_DEFAULTS.email },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    size: { type: ControlType.Number, title: "Size @1440", min: 32, max: 200, step: 1, unit: "px", defaultValue: 103 },
    minSize: { type: ControlType.Number, title: "Min size", min: 24, max: 100, step: 1, unit: "px", defaultValue: 40 },
    maxSize: { type: ControlType.Number, title: "Max size", min: 60, max: 300, step: 1, unit: "px", defaultValue: 170 },
    labelSize: { type: ControlType.Number, title: "Label @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    rings: { type: ControlType.Boolean, title: "Rings", defaultValue: true },
    ringColor: { type: ControlType.Color, title: "Ring colour", defaultValue: HAIRLINE, hidden: (p: { rings?: boolean }) => !p.rings },
    dotColor: { type: ControlType.Color, title: "Dot colour", defaultValue: CTA_DEFAULTS.dotColor, hidden: (p: { rings?: boolean }) => !p.rings },
    orbitSeconds: { type: ControlType.Number, title: "Orbit", min: 0, max: 300, step: 5, unit: "s", defaultValue: 70, hidden: (p: { rings?: boolean }) => !p.rings },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: PARCHMENT },
    mutedColor: { type: ControlType.Color, title: "Muted text", defaultValue: CTA_DEFAULTS.mutedColor },
    hoverText: { type: ControlType.Color, title: "Pill hover text", defaultValue: INK },
    hairlineTop: { type: ControlType.Boolean, title: "Top hairline", defaultValue: true },
    hairline: { type: ControlType.Color, title: "Hairline", defaultValue: HAIRLINE },
    background: { type: ControlType.Color, title: "Background", defaultValue: INK },
    minHeight: { type: ControlType.Number, title: "Min height", min: 300, max: 1200, step: 10, unit: "px", defaultValue: 680 },
    padding: { type: ControlType.Number, title: "Side padding", min: 0, max: 120, step: 1, unit: "px", defaultValue: 20 },
    topSpace: { type: ControlType.Number, title: "Space above", min: 0, max: 400, step: 1, unit: "px", defaultValue: 160 },
    bottomSpace: { type: ControlType.Number, title: "Space below", min: 0, max: 400, step: 1, unit: "px", defaultValue: 120 },
})
