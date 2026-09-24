// Generated from kit/components/Statement.tsx by scripts/assemble.mjs. Edit the kit source, not this file.
import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion"

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
 * OFF+BRAND Statement — a stacked display paragraph (the manifesto voice)
 * that reveals word by word as it scrolls into view, with an optional ghost
 * link underneath and a faint ring ornament behind.
 *
 * Height is content-sized.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 * @framerIntrinsicWidth 1440
 * @framerDisableUnlink
 */
export default function Statement(props: Partial<StatementProps>) {
    const p = { ...STATEMENT_DEFAULTS, ...props }
    const ref = React.useRef<HTMLElement>(null)
    const { w, h } = useSize(ref, { w: 1440, h: 600 })
    const mobile = w < 720
    const reduced = useReducedMotion()
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const reveal = p.reveal && !reduced && !isCanvas
    const size = fluid(p.size, w, p.minSize, p.maxSize)
    const labelSize = fluid(p.labelSize, w, 11, 18)
    const pad = mobile ? Math.round(p.padding * 0.8) : p.padding
    const words = p.text.split(/\s+/).filter(Boolean)
    const n = Math.max(1, words.length)

    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] })
    useMotionValueEvent(scrollYProgress, "change", (v) => {
        ref.current?.style.setProperty("--ob-p", String(v))
    })
    React.useEffect(() => {
        ref.current?.style.setProperty("--ob-p", String(reveal ? scrollYProgress.get() : 1))
    }, [reveal, scrollYProgress])

    const ring = Math.round(Math.min(w, Math.max(h, 400)) * 0.9)

    return (
        <section
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
                display: "flex",
                flexDirection: "column",
                alignItems: p.align === "center" ? "center" : "flex-start",
                gap: Math.round(size * 0.5),
                ["--ob-p" as any]: reveal ? 0 : 1,
            }}
        >
            {p.rings && (
                <div aria-hidden="true" style={{ position: "absolute", right: mobile ? "-30%" : "6%", top: "50%", width: ring, height: ring, transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px dotted ${p.ringColor}` }} />
                    <div style={{ position: "absolute", inset: "18%", borderRadius: "50%", border: `1px dotted ${p.ringColor}` }} />
                </div>
            )}
            {p.label && <p style={{ ...labelCss(p.font, labelSize, p.mutedColor), position: "relative" }}>{p.label}</p>}
            <p
                style={{
                    ...fontCss(p.font, 500),
                    position: "relative",
                    fontSize: size,
                    lineHeight: p.lineHeight,
                    letterSpacing: "0.01em",
                    textTransform: p.uppercase ? "uppercase" : "none",
                    margin: 0,
                    maxWidth: `${p.maxWidth}%`,
                    textAlign: p.align === "center" ? "center" : "left",
                    textWrap: "balance" as any,
                }}
            >
                {words.map((word, i) => (
                    <span
                        key={i}
                        style={{
                            display: "inline",
                            opacity: reveal ? `clamp(${p.dim}, var(--ob-p, 0) * ${n + 2} - ${i}, 1)` : 1,
                            transition: reveal ? "opacity .2s linear" : undefined,
                        }}
                    >
                        {word}
                        {i < words.length - 1 ? " " : ""}
                    </span>
                ))}
            </p>
            {p.linkLabel && (
                <div style={{ position: "relative" }}>
                    <TextLink label={p.linkLabel} href={p.link} size={labelSize} color={p.textColor} font={p.font} />
                </div>
            )}
        </section>
    )
}

type StatementProps = {
    label: string
    text: string
    linkLabel: string
    link: string
    font?: FramerFont
    size: number
    minSize: number
    maxSize: number
    lineHeight: number
    uppercase: boolean
    align: "left" | "center"
    maxWidth: number
    reveal: boolean
    dim: number
    rings: boolean
    ringColor: string
    labelSize: number
    textColor: string
    mutedColor: string
    background: string
    padding: number
    topSpace: number
    bottomSpace: number
    style?: React.CSSProperties
}

const STATEMENT_DEFAULTS: StatementProps = {
    label: "Manifesto",
    text: "We believe the best brands are built off the beaten path. No templates. No safe choices. Just work that people remember.",
    linkLabel: "Read the manifesto",
    link: "",
    font: undefined,
    size: 70,
    minSize: 32,
    maxSize: 120,
    lineHeight: 0.95,
    uppercase: true,
    align: "left",
    maxWidth: 92,
    reveal: true,
    dim: 0.18,
    rings: true,
    ringColor: HAIRLINE,
    labelSize: 13,
    textColor: PARCHMENT,
    mutedColor: "rgba(229, 228, 224, 0.62)",
    background: INK,
    padding: 20,
    topSpace: 160,
    bottomSpace: 160,
}

addPropertyControls(Statement, {
    label: { type: ControlType.String, title: "Label", defaultValue: STATEMENT_DEFAULTS.label },
    text: { type: ControlType.String, title: "Text", displayTextArea: true, defaultValue: STATEMENT_DEFAULTS.text },
    linkLabel: { type: ControlType.String, title: "Link label", defaultValue: STATEMENT_DEFAULTS.linkLabel },
    link: { type: ControlType.Link, title: "Link" },
    font: { type: ControlType.Font, title: "Font", defaultFontType: "sans-serif" },
    size: { type: ControlType.Number, title: "Size @1440", min: 24, max: 160, step: 1, unit: "px", defaultValue: 70 },
    minSize: { type: ControlType.Number, title: "Min size", min: 18, max: 80, step: 1, unit: "px", defaultValue: 32 },
    maxSize: { type: ControlType.Number, title: "Max size", min: 40, max: 240, step: 1, unit: "px", defaultValue: 120 },
    lineHeight: { type: ControlType.Number, title: "Line height", min: 0.8, max: 1.4, step: 0.05, defaultValue: 0.95 },
    uppercase: { type: ControlType.Boolean, title: "Uppercase", defaultValue: true },
    align: { type: ControlType.Enum, title: "Align", options: ["left", "center"], optionTitles: ["Left", "Center"], displaySegmentedControl: true, defaultValue: "left" },
    maxWidth: { type: ControlType.Number, title: "Max width", min: 40, max: 100, step: 1, unit: "%", defaultValue: 92 },
    reveal: { type: ControlType.Boolean, title: "Scroll reveal", description: "Words brighten one by one as the block scrolls into view.", defaultValue: true },
    dim: { type: ControlType.Number, title: "Resting opacity", min: 0, max: 0.6, step: 0.02, defaultValue: 0.18, hidden: (p: { reveal?: boolean }) => !p.reveal },
    rings: { type: ControlType.Boolean, title: "Rings", defaultValue: true },
    ringColor: { type: ControlType.Color, title: "Ring colour", defaultValue: HAIRLINE, hidden: (p: { rings?: boolean }) => !p.rings },
    labelSize: { type: ControlType.Number, title: "Label @1440", min: 10, max: 24, step: 1, unit: "px", defaultValue: 13 },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: PARCHMENT },
    mutedColor: { type: ControlType.Color, title: "Muted text", defaultValue: STATEMENT_DEFAULTS.mutedColor },
    background: { type: ControlType.Color, title: "Background", defaultValue: INK },
    padding: { type: ControlType.Number, title: "Side padding", min: 0, max: 120, step: 1, unit: "px", defaultValue: 20 },
    topSpace: { type: ControlType.Number, title: "Space above", min: 0, max: 400, step: 1, unit: "px", defaultValue: 160 },
    bottomSpace: { type: ControlType.Number, title: "Space below", min: 0, max: 400, step: 1, unit: "px", defaultValue: 160 },
})
